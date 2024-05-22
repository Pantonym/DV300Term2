import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// create a new story
export const handleStoryCreate = async (storyDetails, userID) => {
    try {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const works = userData.works || [];

            // Add the new story to the works array
            works.push(storyDetails);

            // Update the user's document in Firestore with the new works array
            await setDoc(docRef, { ...userData, works });

            console.log("Story added successfully");
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error adding story: ", error);
    }
};