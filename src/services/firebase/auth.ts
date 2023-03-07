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
    AuthCredential,
    User,
    EmailAuthProvider,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult
} from 'firebase/auth';
import init from './init'

init()
export const auth = getAuth();

auth.useDeviceLanguage()
const googleAuthProvider = new GoogleAuthProvider();

export enum AuthProviderIds {
    GOOGLE = 'google.com',
    FACEBOOK = 'facebook',
    TWITTER = 'twitter',
    GITHUB = 'github',
}

export default {
    getAuth: () => auth,
    getCurrentUser: () => auth.currentUser,
    signInWithEmailAndPassword: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),

    signInWithGoogle: () => signInWithRedirect(auth, googleAuthProvider),

    getRedirectResult: () => getRedirectResult(auth)
        .then((result) => {
            if (!result) return null;

            console.log(result)
            const { providerId } = result

            switch (providerId as AuthProviderIds) {
                case AuthProviderIds.GOOGLE:
                    // This gives you a Google Access Token. You can use it to access Google APIs.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    if (!credential) return null;
                    const token = credential.accessToken;
                    // The signed-in user info.
                    return result.user;
                case AuthProviderIds.FACEBOOK:
                    return null;
                case AuthProviderIds.TWITTER:
                    return null;
                case AuthProviderIds.GITHUB:
                    return null;
                default:
                    return null;
            }

        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
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