import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const getUser = async (userID) => {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        
        return data;
    } else {
        console.log("No such document!");
        return null;
    }
}

export const createUser = async (data, userID) => {

    try {

        await setDoc(doc(db, "users", userID), data);

        console.log("Created user: ", userID)

    } catch (error) {
        console.log(error)
        console.log("error data: ", data)
    }

}