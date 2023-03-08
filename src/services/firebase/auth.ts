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
    ProviderId
} from 'firebase/auth';
import init from './init'

init()
export const auth = getAuth();

auth.useDeviceLanguage()
const googleAuthProvider = new GoogleAuthProvider();
const facebookAuthProvider = new FacebookAuthProvider();

export const AuthProviderIds = ProviderId

export default {
    getAuth: () => auth,
    getCurrentUser: () => auth.currentUser,
    signInWithEmailAndPassword: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),

    signInWithGoogle: () => signInWithRedirect(auth, googleAuthProvider),
    signInWithFacebook: () => signInWithRedirect(auth, facebookAuthProvider),

    getRedirectResult: () => getRedirectResult(auth)
        .then((result) => {
            if (!result?.providerId) return null;
            const { providerId } = result
            const provider = {
                [AuthProviderIds.GOOGLE]: GoogleAuthProvider,
                [AuthProviderIds.FACEBOOK]: FacebookAuthProvider,
                [AuthProviderIds.GITHUB]: GithubAuthProvider,
                [AuthProviderIds.TWITTER]: TwitterAuthProvider,
            }[providerId]
            if (!provider) return null;
            // This gives you a Google Access Token. You can use it to access Google APIs.
            const credential = provider.credentialFromResult(result);
            if (!credential) return null;
            const token = credential.accessToken;
            // The signed-in user info.
            return result.user;
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
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