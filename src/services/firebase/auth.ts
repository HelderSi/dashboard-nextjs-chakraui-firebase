import { FirebaseError } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    updatePassword,
    reauthenticateWithCredential,
    updateProfile,
    UserProfile,
    User,
    EmailAuthProvider,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    TwitterAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    ProviderId,
    OAuthProvider,
    fetchSignInMethodsForEmail,
    linkWithCredential,
    AuthErrorCodes as FirebaseAuthErrorCodes,
    sendSignInLinkToEmail,
    signInWithEmailLink,
    isSignInWithEmailLink,
    UserCredential
} from 'firebase/auth';
import { ValueOf } from '../../utils/types/ValueOf';
import init from './init'

init()
export const auth = getAuth();
auth.useDeviceLanguage()

const googleAuthProvider = new GoogleAuthProvider();
const facebookAuthProvider = new FacebookAuthProvider();
const githubAuthProvider = new GithubAuthProvider();
const twitterAuthProvider = new TwitterAuthProvider();

const APPLE_PROVIDER_ID = 'apple.com' as 'apple.com';
const appleAuthProvider = new OAuthProvider(APPLE_PROVIDER_ID);

const { PASSWORD, PHONE, ...restProvidersId } = ProviderId;

export const OauthProviders =
{
    ...restProvidersId,
    APPLE: APPLE_PROVIDER_ID,
}

const OauthProvidersClassMapper =
{
    [OauthProviders.GOOGLE]: GoogleAuthProvider,
    [OauthProviders.FACEBOOK]: FacebookAuthProvider,
    [OauthProviders.GITHUB]: GithubAuthProvider,
    [OauthProviders.TWITTER]: TwitterAuthProvider,
    [APPLE_PROVIDER_ID]: OAuthProvider,
}

const OauthProvidersInstanceMapper =
{
    [OauthProviders.GOOGLE]: googleAuthProvider,
    [OauthProviders.FACEBOOK]: facebookAuthProvider,
    [OauthProviders.GITHUB]: githubAuthProvider,
    [OauthProviders.TWITTER]: twitterAuthProvider,
    [APPLE_PROVIDER_ID]: appleAuthProvider,
}

export type OauthProviderIds = ValueOf<typeof OauthProviders>

const getProviderForProviderId = (id: OauthProviderIds) => {
    return OauthProvidersInstanceMapper[id]
}

export const AuthErrorCodes = {
    ...FirebaseAuthErrorCodes,
    GENERIC_ERROR_CODE: "auth/generic-error" as "auth/generic-error",
    NOT_A_LOGIN_LINK: "auth/not-a-login-link" as "auth/not-a-login-link",
    REQUIRED_SIGN_IN_WITH_EMAIL_AND_PASSWORD: "auth/required-sign-in-with-email-and-password" as "auth/required-sign-in-with-email-and-password",
    EMAIL_NOT_FOUND_LOCALLY: "auth/email-not-found-locally" as "auth/email-not-found-locally",
}

export type AuthError = {
    title: string;
    message: string;
    code: string;
    email?: string;
}
const AuthErrorMapper: {
    [code: string]: AuthError
} = {
    [AuthErrorCodes.QUOTA_EXCEEDED]: {
        title: "Erro",
        message: "Quota diária excedida",
        code: AuthErrorCodes.QUOTA_EXCEEDED,
    },
    [AuthErrorCodes.NEED_CONFIRMATION]: { // "auth/account-exists-with-different-credential"
        title: "Erro",
        message: "O email informado já existe",
        code: AuthErrorCodes.NEED_CONFIRMATION
    },
    [AuthErrorCodes.GENERIC_ERROR_CODE]: {
        title: "Erro",
        message: "Um erro não identificado ocorreu",
        code: AuthErrorCodes.GENERIC_ERROR_CODE
    },
    [AuthErrorCodes.NOT_A_LOGIN_LINK]: {
        title: "Erro",
        code: AuthErrorCodes.NOT_A_LOGIN_LINK,
        message: "Link de login inválido"
    },
    [AuthErrorCodes.REQUIRED_SIGN_IN_WITH_EMAIL_AND_PASSWORD]: {
        title: "Conta já existe",
        code: AuthErrorCodes.REQUIRED_SIGN_IN_WITH_EMAIL_AND_PASSWORD,
        message: "A conta já possui um cadastro com email e senha"
    },
    [AuthErrorCodes.EMAIL_NOT_FOUND_LOCALLY]: {
        title: "Erro",
        code: AuthErrorCodes.EMAIL_NOT_FOUND_LOCALLY,
        message: "Não foi possivél identificar o email"
    },
    [AuthErrorCodes.INVALID_OOB_CODE]: {
        title: "Link inválido",
        code: AuthErrorCodes.INVALID_OOB_CODE,
        message: "Envie o link novamente"
    },
    [AuthErrorCodes.INVALID_PASSWORD]: {
        title: "Erro",
        code: AuthErrorCodes.INVALID_PASSWORD,
        message: "Login ou senha inválidos"
    },
    [AuthErrorCodes.INVALID_EMAIL]: {
        title: "Erro",
        code: AuthErrorCodes.INVALID_EMAIL,
        message: "Login ou senha inválidos"
    },
    [AuthErrorCodes.USER_DELETED]: {
        title: "Erro",
        code: AuthErrorCodes.USER_DELETED,
        message: "Login ou senha inválidos"
    },
}

type ResponseType = 'success' | 'error';

type Response = {
    type: ResponseType;
    error?: AuthError;
    success: boolean;
}

export default {
    getAuth: () => auth,
    getCurrentUser: () => auth.currentUser,
    signInWithEmailAndPassword: (email: string, password: string) =>
        (onSuccess: (credential: UserCredential) => void, onError: (error: AuthError) => void) =>
            signInWithEmailAndPassword(auth, email, password).then(onSuccess).catch(error => {
                console.log(error)
                if (error instanceof FirebaseError) {
                    if (AuthErrorMapper[error.code]) {
                        onError(AuthErrorMapper[error.code])
                        return;
                    }
                }
                onError(AuthErrorMapper[AuthErrorCodes.GENERIC_ERROR_CODE])
                return;
            }),

    signInWithGoogle: () => signInWithRedirect(auth, googleAuthProvider),
    signInWithFacebook: () => signInWithRedirect(auth, facebookAuthProvider),
    signInWithGithub: () => signInWithRedirect(auth, githubAuthProvider),
    signInWithTwitter: () => signInWithRedirect(auth, twitterAuthProvider),
    signInWithApple: () => signInWithRedirect(auth, appleAuthProvider),

    signInWithOauthProvider: (providerId: OauthProviderIds) => signInWithRedirect(auth, OauthProvidersInstanceMapper[providerId]),

    linkPendingCredential: async (user: User): Promise<Response> => {
        const pendingCredential = sessionStorage.getItem(`oauth:${user.email}`);

        pendingCredential && linkWithCredential(user, OAuthProvider.credentialFromJSON(pendingCredential)).catch(error => {
            if (error.code === AuthErrorCodes.PROVIDER_ALREADY_LINKED) {
                return {
                    success: true,
                    type: 'success'
                }
            }
        })
        return {
            success: true,
            type: 'success'
        }
    },

    getOauthRedirectResult: async (onSuccess: (credential: UserCredential) => void, onError: (error: AuthError) => void): Promise<void> => getRedirectResult(auth)
        .then((result) => {
            if (!result?.providerId) throw new Error(AuthErrorMapper[AuthErrorCodes.GENERIC_ERROR_CODE].message);

            const { providerId } = result
            const provider = OauthProvidersClassMapper[providerId as OauthProviderIds]
            if (!provider) throw new Error(AuthErrorMapper[AuthErrorCodes.GENERIC_ERROR_CODE].message);

            // This gives you a Access Token
            const credential = provider.credentialFromResult(result);
            if (!credential) throw new Error(AuthErrorMapper[AuthErrorCodes.GENERIC_ERROR_CODE].message);

            const token = credential.accessToken;
            onSuccess(result)
        }).catch((error: FirebaseError) => {
            console.log(error)
            // Handle Errors here.
            if (error.code === AuthErrorCodes.NEED_CONFIRMATION) { // "auth/account-exists-with-different-credential"
                // User's email already exists.
                // The pending credential.
                const pendingCredential = OAuthProvider.credentialFromError(error);;
                // The provider account's email address.
                const email = error.customData?.email as string;
                // save pending credention on sessionStorage
                sessionStorage.setItem(`oauth:${email}`, JSON.stringify(pendingCredential));
                console.log(email)
                // Get sign-in methods for this email.
                fetchSignInMethodsForEmail(auth, email).then(methods => {
                    console.log(methods)
                    // If the user has several sign-in methods,
                    // the first method in the list will be the "recommended" method to use.
                    if (methods[0] === 'password') {
                        // Asks the user their password.
                        onError({
                            ...AuthErrorMapper[AuthErrorCodes.REQUIRED_SIGN_IN_WITH_EMAIL_AND_PASSWORD],
                            email
                        })
                    } else {
                        // All the other cases are external providers.
                        // Construct provider object for that provider.
                        const provider = getProviderForProviderId(methods[0] as OauthProviderIds);
                        // At this point, you should let the user know that they already have an account
                        // but with a different provider, and let them validate the fact they want to
                        // sign in with this provider.
                        // Sign in to provider.
                        signInWithRedirect(auth, provider)
                    }
                }).catch(error => {
                    onError(AuthErrorMapper[AuthErrorCodes.GENERIC_ERROR_CODE])
                })
            }
            // The email of the user's account used.
            onError(AuthErrorMapper[AuthErrorCodes.GENERIC_ERROR_CODE])
        }),
    isSignInWithEmailLink: () => isSignInWithEmailLink(auth, window.location.href),
    sendSignInLinkToEmail: (email: string): Promise<Response> => sendSignInLinkToEmail(auth, email, {
        url: 'http://localhost:3000/signin',
        handleCodeInApp: true,
    }).then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        localStorage.setItem('emailForSignIn', email);
        const response: Response = {
            success: true,
            type: 'success'
        }
        return response;
    }).catch((error: FirebaseError) => {
        console.log(error.code)
        if (AuthErrorMapper[error.code]) {
            return {
                error: AuthErrorMapper[error.code],
                type: "error",
                success: false
            }
        }
        return {
            error: AuthErrorMapper[AuthErrorCodes.GENERIC_ERROR_CODE],
            type: "error",
            success: false
        }
    }),
    signInWithEmailLink: async (onSuccess: (credential: UserCredential) => void, onError: (error: AuthError) => void): Promise<void> => {
        try {
            if (isSignInWithEmailLink(auth, location.href)) {
                // Additional state parameters can also be passed via URL.
                // This can be used to continue the user's intended action before triggering
                // the sign-in operation.
                // Get the email if available. This should be available if the user completes
                // the flow on the same device where they started it.
                let email = localStorage.getItem('emailForSignIn');
                if (!email) {
                    // User opened the link on a different device. To prevent session fixation
                    // attacks, ask the user to provide the associated email again.
                    onError(AuthErrorMapper[AuthErrorCodes.EMAIL_NOT_FOUND_LOCALLY])
                    return;
                }
                // The client SDK will parse the code from the link for you.
                const result = await signInWithEmailLink(auth, email, window.location.href)
                // Clear email from storage.
                window.localStorage.removeItem('emailForSignIn');
                // You can access the new user via result.use 
                // Additional user info profile not available via:
                // result.additionalUserInfo.profile == null
                // You can check if the user is new or existing:
                // result.additionalUserInfo.isNewUser
                onSuccess(result)
            } else {
                onError(AuthErrorMapper[AuthErrorCodes.NOT_A_LOGIN_LINK])
            }
        } catch (error) {
            console.log(error)
            if (error instanceof FirebaseError) {
                if (AuthErrorMapper[error.code]) {
                    onError(AuthErrorMapper[error.code])
                    return;
                }
            }
            onError(AuthErrorMapper[AuthErrorCodes.GENERIC_ERROR_CODE])
            return;
        }
    },
    createUserWithEmailAndPassword: (email: string, password: string) =>
        (onSuccess: (credential: UserCredential) => void, onError: (error: AuthError) => void) =>
            createUserWithEmailAndPassword(auth, email, password).then(onSuccess).catch(error => {
                console.log(error)
                if (error instanceof FirebaseError) {
                    if (AuthErrorMapper[error.code]) {
                        onError(AuthErrorMapper[error.code])
                        return;
                    }
                }
                onError(AuthErrorMapper[AuthErrorCodes.GENERIC_ERROR_CODE])
                return;
            }),
    onAuthStateChanged,
    sendPasswordResetEmail: (email: string) => sendPasswordResetEmail(auth, email),
    signOut: () => signOut(auth),
    updateUserProfile: (user: User, userProfile: UserProfile) => updateProfile(user, userProfile),
    sendEmailVerification: (user: User) => sendEmailVerification(user),
    updateCurrentUserPassword: (newPassword: string) => {
        if (!auth?.currentUser?.email) {
            throw new Error('User not signed in')
        }
        return updatePassword(auth.currentUser, newPassword)
    },
    reauthenticateCurrentUser: (password: string) => {
        if (!auth?.currentUser?.email) {
            throw new Error('User not signed in')
        }
        const userCredentials = EmailAuthProvider.credential(auth.currentUser.email, password)
        return reauthenticateWithCredential(auth.currentUser, userCredentials)
    }
}


