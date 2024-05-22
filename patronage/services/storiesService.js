import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
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

// fetch user stories
export const fetchUserStories = async (userID) => {
    try {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            return userData.works || [];
        } else {
            console.log("No such document!");
            return [];
        }
    } catch (error) {
        console.error("Error fetching stories: ", error);
        return [];
    }
};

export const deleteStory = async (userID, storyTitle) => {
    console.log('Delete: ', userID, storyTitle)
}

export const publishStory = async (userID, storyTitle) => {
    console.log('Publish: ', userID, storyTitle)
}

export const unPublishStory = async (userID, storyTitle) => {
    console.log('Unpublish: ', userID, storyTitle)
}