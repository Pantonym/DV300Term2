import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const getUser = async (userID) => {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        // console.log("User data from Firestore:", data);

        return data;
    } else {
        console.log("No such document!");
        return null;
    }
}