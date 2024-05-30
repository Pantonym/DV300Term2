import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { changeUserProfileIcon } from "./accountService";

// Upload Image to Buckets
export const handleImageUpload = async (uri, fileName) => {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
            resolve(xhr.response);
        }

        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        }

        xhr.responseType = "blob";
        // open the network, get the image using this uri, and set async to true
        xhr.open('GET', uri, true);
        // Similar to return in normal functions
        xhr.send(null);
    })

    // only refers to where it should be stored, and what it should be called
    const imageRef = ref(storage, fileName);

    // The filename is the user's uID so that the icon is replaced in the bucket. This removes the need to delete the old icon as it is replaced by the new one.
    const uploadResult = await uploadBytes(imageRef, blob);

    await changeUserProfileIcon(await getDownloadURL(imageRef), fileName) // returns the url of the image on firebase

    blob.close();
}