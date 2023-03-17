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
    AuthErrorCodes,
    sendSignInLinkToEmail,
    signInWithEmailLink,
    isSignInWithEmailLink
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

const GENERIC_ERROR_CODE = "auth/generic-error";
const NOT_A_LOGIN_LINK_ERROR_CODE = "auth/not-a-login-link"
type AuthError = {
    message: string;
    code: string;
}
const AuthErrorMapper: {
    [code: string]: AuthError
} = {
    [AuthErrorCodes.QUOTA_EXCEEDED]: {
        message: "Quota diária excedida",
        code: AuthErrorCodes.QUOTA_EXCEEDED
    },
    [AuthErrorCodes.NEED_CONFIRMATION]: { // "auth/account-exists-with-different-credential"
        message: "O email informado já existe",
        code: AuthErrorCodes.NEED_CONFIRMATION
    },
    [GENERIC_ERROR_CODE]: {
        message: "Um erro não identificado ocorreu",
        code: GENERIC_ERROR_CODE
    },
    [NOT_A_LOGIN_LINK_ERROR_CODE]: {
        code: NOT_A_LOGIN_LINK_ERROR_CODE,
        message: "Link de login inválido"
    }
}

export default {
    getAuth: () => auth,
    getCurrentUser: () => auth.currentUser,
    signInWithEmailAndPassword: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),

    signInWithGoogle: () => signInWithRedirect(auth, googleAuthProvider),
    signInWithFacebook: () => signInWithRedirect(auth, facebookAuthProvider),
    signInWithGithub: () => signInWithRedirect(auth, githubAuthProvider),
    signInWithTwitter: () => signInWithRedirect(auth, twitterAuthProvider),
    signInWithApple: () => signInWithRedirect(auth, appleAuthProvider),

    signInWithOauthProvider: (providerId: OauthProviderIds) => signInWithRedirect(auth, OauthProvidersInstanceMapper[providerId]),

    getOauthRedirectResult: () => getRedirectResult(auth)
        .then((result) => {
            console.log(result)
            if (!result?.providerId) return null;
            const { providerId } = result
            const provider = OauthProvidersClassMapper[providerId as OauthProviderIds]

            if (!provider) return null;
            // This gives you a Access Token
            const credential = provider.credentialFromResult(result);
            if (!credential) return null;
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            const pendingCredential = sessionStorage.getItem(`oauth:${user.email}`);
            console.log('pendingCredential', pendingCredential)
            pendingCredential && linkWithCredential(user, OAuthProvider.credentialFromJSON(pendingCredential)).catch(err => {
                console.log(JSON.stringify(err)) // TODO: handle Error (auth/provider-already-linked).
            })
            return user;
        }).catch((error: FirebaseError) => {
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
                        // In real scenario, you should handle this asynchronously.
                        // var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
                        // signInWithEmailAndPassword(auth, email, password).then((result) => {
                        //     // Step 4a.
                        //     return result.user.linkWithCredential(pendingCredential);
                        // }).then(function () {
                        //     // GitHub account successfully linked to the existing Firebase user.
                        //     goToApp();
                        // });
                        return 'ASK_PASSWORD';
                    }

                    // All the other cases are external providers.
                    // Construct provider object for that provider.
                    const provider = getProviderForProviderId(methods[0] as OauthProviderIds);
                    // At this point, you should let the user know that they already have an account
                    // but with a different provider, and let them validate the fact they want to
                    // sign in with this provider.
                    // Sign in to provider.
                    console.log(provider)
                    signInWithRedirect(auth, provider)
                }).catch(console.log)
            }
            const errorMessage = error.message;
            // The email of the user's account used.
            console.log(error)
            return 'ERROR'
        }),
    isSignInWithEmailLink: () => isSignInWithEmailLink(auth, window.location.href),
    sendSignInLinkToEmail: (email: string) => sendSignInLinkToEmail(auth, email, {
        url: 'http://localhost:3000/signin',
        handleCodeInApp: true,
    }).then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        localStorage.setItem('emailForSignIn', email);
    }).catch((error: FirebaseError) => {
        if (AuthErrorMapper[error.code]) {
            return AuthErrorMapper[error.code]
        }
        console.log(error.code)
        return AuthErrorMapper[GENERIC_ERROR_CODE]
    }),
    signInWithEmailLink: () => {
        if (isSignInWithEmailLink(auth, location.href)) {
            // Additional state parameters can also be passed via URL.
            // This can be used to continue the user's intended action before triggering
            // the sign-in operation.
            // Get the email if available. This should be available if the user completes
            // the flow on the same device where they started it.
            let email = localStorage.getItem('emailForSignIn');
            if (!email) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                email = prompt('Por favor, confirme seu email:');
            }
            // The client SDK will parse the code from the link for you.
            email && signInWithEmailLink(auth, email, window.location.href)
                .then((result) => {
                    // Clear email from storage.
                    window.localStorage.removeItem('emailForSignIn');
                    // You can access the new user via result.user
                    // Additional user info profile not available via:
                    // result.additionalUserInfo.profile == null
                    // You can check if the user is new or existing:
                    // result.additionalUserInfo.isNewUser
                })
                .catch((error) => {
                    // Some error occurred, you can inspect the code: error.code
                    // Common errors could be invalid email and invalid or expired OTPs.
                    console.log(error)
                });
        } else {
            return AuthErrorMapper[NOT_A_LOGIN_LINK_ERROR_CODE]
        }
    },
    createUserWithEmailAndPassword: (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password),
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