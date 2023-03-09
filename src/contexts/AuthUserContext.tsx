import {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  createContext,

  useContext,
} from "react";
import { useRouter } from "next/router";

import { auth } from "src/services/firebase";
import { SocialLoginProviders, SocialLoginProviderIds } from "../services/firebase/auth";

type UserType = {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean
}

type UserEditableInfoType = Partial<Omit<UserType, 'uid' | 'email' | 'emailVerified'>>

type ContextValueType = {
  authUser: UserType | null;
  loading: boolean;
  signInWithSocialLogin(provider: AuthProviderIds): Promise<void>;
  signInWithEmailAndPassword(email: string, password: string): Promise<void>;
  createUserWithEmailAndPassword(email: string, password: string): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
  signOut(): Promise<void>;
  updateCurrentUserProfile(profile: UserEditableInfoType): Promise<void>;
  updateCurrentUserPassword(oldPassword: string, newPassword: string): Promise<void>;
  sendEmailVerification(): Promise<void>;
};

const authUserContext = createContext({} as ContextValueType);

interface AuthUserProviderProps {
  children: ReactNode;
}

export function AuthUserProvider({ children }: AuthUserProviderProps) {
  const [authUser, setAuthUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      auth.getAuth(),
      (authState) => {
        console.log(authState)
        if (!authState) {
          setAuthUser(null)
          setLoading(false)
          return;
        }
        setAuthUser({
          uid: authState.uid,
          email: authState.email || "",
          displayName: authState.displayName || "",
          photoURL: authState.photoURL || "",
          emailVerified: !!authState.emailVerified
        })
        console.log(router)
        if (router.asPath === '/signup' || router.asPath === '/signin')
          router.push('/')
        setLoading(false)
      }
    );
    auth.getRedirectResult()
    return () => unsubscribe();
  }, []);

  const signInWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      await auth.signInWithEmailAndPassword(email, password);
    },
    []
  );

  const signInWithSocialLogin = useCallback(
    async (provider: SocialLoginProviderIds) => {
      switch (provider) {
        case SocialLoginProviders.GOOGLE:
          await auth.signInWithGoogle();
        case SocialLoginProviders.FACEBOOK:
          await auth.signInWithFacebook();
        case SocialLoginProviders.GITHUB:
          await auth.signInWithGithub();
        case SocialLoginProviders.TWITTER:
          await auth.signInWithTwitter();
        case SocialLoginProviders.APPLE:
          await auth.signInWithApple();
      }
    },
    []
  );

  const createUserWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      await auth.createUserWithEmailAndPassword(email, password);
    },
    []
  );

  const sendPasswordResetEmail = useCallback(
    async (email: string) => {
      await auth.sendPasswordResetEmail(email);
    },
    []
  );

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

  const updateCurrentUserPassword = useCallback(async (oldPassword, newPassword) => {
    await auth.reauthenticateCurrentUser(oldPassword)
    await auth.updateCurrentUserPassword(newPassword)
  }, [])

  return (
    <authUserContext.Provider value={{
      authUser,
      loading,
      signInWithSocialLogin,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      sendPasswordResetEmail,
      updateCurrentUserProfile,
      updateCurrentUserPassword,
      sendEmailVerification
    }}>
      {children}
    </authUserContext.Provider>
  );
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(authUserContext);
