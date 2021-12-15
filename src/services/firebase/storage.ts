import {
    getStorage,
    ref,
    uploadBytes,
    uploadString,
    getDownloadURL,
    StringFormat,
    deleteObject
} from "firebase/storage";
import init from './init'

init()
const storage = getStorage();

export default {
    uploadBytes: (path: string, file: Blob | Uint8Array | ArrayBuffer) => uploadBytes(ref(storage, path), file),
    uploadString: (path: string, file: string, format?: StringFormat) => uploadString(ref(storage, path), file, format),
    getDownloadURL: (path: string) => getDownloadURL(ref(storage, path)),
    deleteObject: (path: string) => deleteObject(ref(storage, path)),
}