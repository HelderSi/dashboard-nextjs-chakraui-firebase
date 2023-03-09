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
} from 'firebase/auth';
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

export const SocialLoginProviders =
{
    ...restProvidersId,
    APPLE: APPLE_PROVIDER_ID,
}

const socialLoginProvidersClassMapper =
{
    [SocialLoginProviders.GOOGLE]: GoogleAuthProvider,
    [SocialLoginProviders.FACEBOOK]: FacebookAuthProvider,
    [SocialLoginProviders.GITHUB]: GithubAuthProvider,
    [SocialLoginProviders.TWITTER]: TwitterAuthProvider,
    [APPLE_PROVIDER_ID]: OAuthProvider,
}

const socialLoginProvidersInstanceMapper =
{
    [SocialLoginProviders.GOOGLE]: googleAuthProvider,
    [SocialLoginProviders.FACEBOOK]: facebookAuthProvider,
    [SocialLoginProviders.GITHUB]: githubAuthProvider,
    [SocialLoginProviders.TWITTER]: twitterAuthProvider,
    [APPLE_PROVIDER_ID]: appleAuthProvider,

}

type ValueOf<T> = T[keyof T]; // Indexed Access Types
export type SocialLoginProviderIds = ValueOf<typeof SocialLoginProviders>


const getProviderForProviderId = (id: SocialLoginProviderIds) => {
    return socialLoginProvidersInstanceMapper[id]
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

    getRedirectResult: () => getRedirectResult(auth)
        .then((result) => {
            console.log(result)
            if (!result?.providerId) return null;
            const { providerId } = result
            const provider = socialLoginProvidersClassMapper[providerId as SocialLoginProviderIds]
            if (!provider) return null;
            // This gives you a Google Access Token. You can use it to access Google APIs.
            const credential = provider.credentialFromResult(result);
            if (!credential) return null;
            const token = credential.accessToken;
            // The signed-in user info.
            return result.user;
        }).catch((error) => {
            // Handle Errors here.
            if (error.code === 'auth/account-exists-with-different-credential') {
                // User's email already exists.
                // The pending credential.
                const pendingCredential = error.credential;
                // The provider account's email address.
                const email = error.customData.email;
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
                        return;
                    }

                    // All the other cases are external providers.
                    // Construct provider object for that provider.
                    const provider = getProviderForProviderId(methods[0] as SocialLoginProviderIds);
                    console.log(provider)
                    signInWithRedirect(auth, provider)

                }).catch(console.log)


            }
            const errorMessage = error.message;
            // The email of the user's account used.
            console.log(error)
        }),

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