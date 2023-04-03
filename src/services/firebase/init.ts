import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from 'configs/firebase'

export default function init() {
    // if a Firebase instance doesn't exist, create one
    if (!getApps().length) {
        initializeApp(firebaseConfig)
    }
}