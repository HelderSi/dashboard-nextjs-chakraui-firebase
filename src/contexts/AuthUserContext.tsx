import {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { authConfig } from "../configs/auth";
import { auth } from "../services/firebase";

import { OauthProviders, OauthProviderIds, AuthErrorCodes, AuthError } from "../services/firebase/auth";

type UserType = {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean
}

export const SocialLoginProviderIds = OauthProviders

export type SocialLoginProvider = {
  id: OauthProviderIds;
  name: string;
  enabled: boolean;
}

export const SocialLoginProviders: {
  [id in OauthProviderIds]: SocialLoginProvider
} = {
  [OauthProviders.GOOGLE]: {
    enabled: authConfig.social.providers.google.enabled,
    id: OauthProviders.GOOGLE,
    name: "Google"
  },
  [OauthProviders.FACEBOOK]: {
    enabled: authConfig.social.providers.facebook.enabled,
    id: OauthProviders.FACEBOOK,
    name: "Facebook"
  },
  [OauthProviders.GITHUB]: {
    enabled: authConfig.social.providers.github.enabled,
    id: OauthProviders.GITHUB,
    name: "Github"
  },
  [OauthProviders.TWITTER]: {
    enabled: authConfig.social.providers.twitter.enabled,
    id: OauthProviders.TWITTER,
    name: "Twitter"
  },
  [OauthProviders.APPLE]: {
    enabled: authConfig.social.providers.apple.enabled,
    id: OauthProviders.APPLE,
    name: "Apple"
  },
}

type UserEditableInfoType = Partial<Omit<UserType, 'uid' | 'email' | 'emailVerified'>>

type ContextValueType = {
  authUser: UserType | null;
  loading: boolean;
  passwordRequiredForEmail?: string;
  askEmailAgainForSignInFromLink: boolean;
  authError?: AuthError;
  authState?: AuthStateType;
  resetAuthError(): void;
  signInWithSocialLogin(provider: SocialLoginProvider): Promise<void>;
  signInWithEmailAndPassword(email: string, password: string): Promise<void>;
  sendSignInLinkToEmail(email: string): Promise<boolean>;
  signInWithEmailLink(email?: string): Promise<void>;
  createUserWithEmailAndPassword(email: string, password: string): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
  signOut(): Promise<void>;
  updateCurrentUserProfile(profile: UserEditableInfoType): Promise<void>;
  updateCurrentUserPassword(oldPassword: string, newPassword: string): Promise<void>;
  sendEmailVerification(): Promise<void>;
  getAvailableMethods(): typeof authConfig;
  isSignInWithEmailLink(): boolean;
};

const authUserContext = createContext({} as ContextValueType);

export const AUTH_ERROR_CODES = AuthErrorCodes;

interface AuthUserProviderProps {
  children: ReactNode;
}

// type AuthStateType = {
//   type: 'error' | 'success' | 'incomplete' | 'alert';
//   error?: AuthError;
//   success?: {
//   },
//   incomplete?: {
//     email?: string;
//     actionRequired: 'auth/enter_email_again' | 'auth/sign_in_with_password';
//   },
//   alert?: {
//     code: string;
//     title: string;
//     message: string;
//     severity: 'error' | 'success' | 'warning' | 'info';
//     showToast: boolean;
//   },
//   hiddenActions: {
//     socialLogin: boolean;

//   },
//   actionRequired: {

//   }
// }

type StateCodes = 'INITIAL' | 'SIGN_IN_LINK_SENT_TO_EMAIL' | 'PASSWORD_REQUIRED_FOR_EMAIL' | 'EMAIL_REQUIRED_FOR_SIGN_IN_FROM_LINK' | 'INVALID_SIGN_IN_LINK'

type AuthStateType = {
  code: StateCodes,
  alert?: {
    code: string;
    title: string;
    message: string;
    severity: 'error' | 'success' | 'warning' | 'info';
    showToast: boolean;
  };
  socialLogin: {
    disabled: boolean;
  },
  emailInput: {
    disabled: boolean;
    initialValue?: string;
  };
  passwordInput: {
    disabled: boolean;
    requiredForEmail?: string;
  };
  submit: {
    disabled: boolean;
    action: 'sendSignInLinkToEmail' | 'signInWithEmailLink' | 'signInWithPassword',
    title: 'Entrar' | 'Enviar link' | 'Reenviar link'
  }
}

const defaultStates: Record<StateCodes, AuthStateType> = {
  INITIAL: {
    code: 'INITIAL',
    socialLogin: {
      disabled: !authConfig.social.enabled,
    },
    emailInput: {
      disabled: false,
    },
    passwordInput: {
      disabled: authConfig.email.withoutPassword,
    },
    submit: {
      disabled: false,
      action: authConfig.email.withoutPassword ? 'sendSignInLinkToEmail' : 'signInWithPassword',
      title: authConfig.email.withoutPassword ? 'Enviar link' : 'Entrar'
    }
  },
  SIGN_IN_LINK_SENT_TO_EMAIL: {
    code: 'SIGN_IN_LINK_SENT_TO_EMAIL',
    alert: {
      code: '',
      title: 'Link enviado',
      message: 'Verifique sua caixa de email',
      severity: 'success',
      showToast: true,
    },
    socialLogin: {
      disabled: true,
    },
    emailInput: {
      disabled: false,
    },
    passwordInput: {
      disabled: true,
    },
    submit: {
      disabled: true,
      action: 'sendSignInLinkToEmail',
      title: 'Reenviar link'
    }
  },
  PASSWORD_REQUIRED_FOR_EMAIL: {
    code: 'PASSWORD_REQUIRED_FOR_EMAIL',
    alert: {
      code: '',
      title: '',
      message: '',
      severity: 'warning',
      showToast: true,
    },
    socialLogin: {
      disabled: true,
    },
    emailInput: {
      disabled: true,
      initialValue: ""
    },
    passwordInput: {
      disabled: false,
      requiredForEmail: "",
    },
    submit: {
      disabled: false,
      action: 'signInWithPassword',
      title: 'Entrar'
    }
  },
  EMAIL_REQUIRED_FOR_SIGN_IN_FROM_LINK: {
    code: 'EMAIL_REQUIRED_FOR_SIGN_IN_FROM_LINK',
    alert: {
      code: '',
      title: 'Email não identificado',
      message: 'Favor confirmar seu email',
      severity: 'error',
      showToast: true,
    },
    socialLogin: {
      disabled: true,
    },
    emailInput: {
      disabled: false,
    },
    passwordInput: {
      disabled: true,
    },
    submit: {
      disabled: false,
      action: 'signInWithEmailLink',
      title: 'Entrar'
    }
  },
  INVALID_SIGN_IN_LINK: {
    code: 'INVALID_SIGN_IN_LINK',
    alert: {
      code: '',
      title: 'Link inválido ou expirado',
      message: 'Envie o link novamente',
      severity: 'error',
      showToast: true,
    },
    socialLogin: {
      disabled: true,
    },
    emailInput: {
      disabled: false,
    },
    passwordInput: {
      disabled: true,
    },
    submit: {
      disabled: false,
      action: 'sendSignInLinkToEmail',
      title: 'Enviar link'
    }
  }
}


export function AuthUserProvider({ children }: AuthUserProviderProps) {
  const [authUser, setAuthUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [passwordRequiredForEmail, setPasswordRequiredForEmail] = useState<string>()
  const [askEmailAgainForSignInFromLink, setAskEmailAgainForSignInFromLink] = useState(false)
  const [authError, setAuthError] = useState<AuthError>()
  const [authState, setAuthState] = useState<AuthStateType>(defaultStates.INITIAL)

  const router = useRouter();
  const toast = useToast()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      auth.getAuth(),
      (user) => {
        if (!user) {
          setAuthUser(null)
          setLoading(false)
          return;
        }
        setAuthUser({
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          emailVerified: !!user.emailVerified
        })
        auth.linkPendingCredential(user)
        if (router.route === '/signup' || router.route === '/signin')
          router.push('/')
        setLoading(false)
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    auth.getOauthRedirectResult(
      (credential) => {
      },
      (error) => {
        if (error.code === AuthErrorCodes.REQUIRED_SIGN_IN_WITH_EMAIL_AND_PASSWORD) {
          setPasswordRequiredForEmail(error.email);
          if (router.route === '/signup')
            router.push('/signin')
        }
      })
  }, []);

  const resetAuthError = useCallback(() => {
    setAuthError(undefined)
  }, [])

  useEffect(() => {
    if (authError)
      toast({
        id: authError.code, // used to prevent duplicate
        title: authError?.title,
        description: authError?.message,
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'top'
      })
  }, [authError])

  const signInWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      await auth.signInWithEmailAndPassword(email, password)(
        (credential) => { },
        setAuthError
      )
    },
    []
  );

  const signInWithSocialLogin = useCallback(
    async (provider: SocialLoginProvider) => {
      auth.signInWithOauthProvider(provider.id)
    },
    []
  );

  const createUserWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      await auth.createUserWithEmailAndPassword(email, password)(
        (credential) => { },
        setAuthError
      );
    },
    []
  );

  const signInWithEmailLink = useCallback(
    async (email?: string) => {
      email && auth.saveEmailForSignIn(email)
      await auth.signInWithEmailLink(
        (credential) => { },
        (error) => {
          console.log(error)
          if (error.code === AuthErrorCodes.EMAIL_NOT_FOUND_LOCALLY) {
            //setAskEmailAgainForSignInFromLink(true)
            setAuthState(defaultStates.EMAIL_REQUIRED_FOR_SIGN_IN_FROM_LINK)
          }
          setAuthError(error)
        });
    },
    []
  );

  const sendSignInLinkToEmail = useCallback(
    async (email: string) => {
      const result = await auth.sendSignInLinkToEmail(email);
      if (result.error) {
        setAuthError(result.error)
        return false
      }
      setAuthState(defaultStates.SIGN_IN_LINK_SENT_TO_EMAIL)
      toast({
        title: 'Link enviado',
        description: 'Acesse seu email e clique no link',
        status: 'success',
        duration: null,
        isClosable: true,
        position: 'top'
      })
      return true;
    },
    []
  );

  const sendPasswordResetEmail = useCallback(
    async (email: string) => {
      await auth.sendPasswordResetEmail(email);
    },
    []
  );

  const isSignInWithEmailLink = useCallback(() => {
    return auth.isSignInWithEmailLink()
  }, [])

  const signOut = useCallback(async () => await auth.signOut(), []);

  const updateCurrentUserProfile = useCallback(async (changedProfileInfo: UserEditableInfoType) => {
    const currentUser = auth.getCurrentUser()
    if (currentUser)
      await auth.updateUserProfile(currentUser, changedProfileInfo)
    setAuthUser(prev => ({ ...prev, ...changedProfileInfo } as UserType))
  }, [])

  const sendEmailVerification = useCallback(async () => {
    const currentUser = auth.getCurrentUser()
    if (currentUser)
      await auth.sendEmailVerification(currentUser)
  }, [])

  const updateCurrentUserPassword = useCallback(async (oldPassword: string, newPassword: string) => {
    await auth.reauthenticateCurrentUser(oldPassword)
    await auth.updateCurrentUserPassword(newPassword)
  }, [])

  const getAvailableMethods = useCallback(() => {
    return authConfig
  }, [])

  return (
    <authUserContext.Provider value={{
      authUser,
      loading,
      passwordRequiredForEmail,
      askEmailAgainForSignInFromLink,
      authError,
      authState,
      resetAuthError,
      signInWithSocialLogin,
      signInWithEmailAndPassword,
      sendSignInLinkToEmail,
      signInWithEmailLink,
      createUserWithEmailAndPassword,
      signOut,
      sendPasswordResetEmail,
      updateCurrentUserProfile,
      updateCurrentUserPassword,
      sendEmailVerification,
      getAvailableMethods,
      isSignInWithEmailLink,
    }}>
      {children}
    </authUserContext.Provider>
  );
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(authUserContext);
