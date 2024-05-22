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
    console.log('Delete: ', userID, storyTitle);

    try {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            var works = userData.works;
            var newWorks = [];

            // Find the index of the story the user clicked on
            for (let k = 0; k < works.length; k++) {

                if (works[k].title == storyTitle) {
                    // Skip the story the user wants to delete
                    console.log('Found Item To Delete')
                } else {
                    // push all other works
                    newWorks.push(works[k])
                }

            }

            works = newWorks;

            // Update the user's document in Firestore with the new works array
            await setDoc(docRef, { ...userData, works });

            console.log("Story deleted successfully");
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error publishing story: ", error);
    }
}

export const publishStory = async (userID, storyTitle) => {
    console.log('Publish: ', userID, storyTitle);

    try {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            var works = userData.works;

            // Find the index of the story the user clicked on
            for (let k = 0; k < works.length; k++) {

                if (works[k].title == storyTitle) {
                    // Set that work's completed value to true
                    works[k].completed = true
                }

            }

            // Update the user's document in Firestore with the new works array
            await setDoc(docRef, { ...userData, works });

            console.log("Story published successfully");
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error publishing story: ", error);
    }
}

export const unPublishStory = async (userID, storyTitle) => {
    console.log('Unpublish: ', userID, storyTitle)

    try {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            var works = userData.works;

            // Find the index of the story the user clicked on
            for (let k = 0; k < works.length; k++) {

                if (works[k].title == storyTitle) {
                    // Set that work's completed value to true
                    works[k].completed = false
                }

            }

            // Update the user's document in Firestore with the new works array
            await setDoc(docRef, { ...userData, works });

            console.log("Story unpublished successfully");
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error unpublishing story: ", error);
    }
}

export const updateStory = async (userID, storyTitle, newContent, newTitle) => {
    console.log('Update: ', userID, storyTitle, " to: ", newTitle, ' with: ', newContent)

    try {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            var works = userData.works;

            // Find the index of the story the user clicked on
            for (let k = 0; k < works.length; k++) {

                if (works[k].title == storyTitle) {

                    console.log(works[k].title);

                    // Set that work's new values
                    works[k].chapters[0].chapterTitle = newTitle;
                    works[k].chapters[0].chapterContent = newContent;
                    works[k].title = newTitle;

                    console.log(works[k])
                }

            }

            // Update the user's document in Firestore with the new works array
            await setDoc(docRef, { ...userData, works });

            console.log("Story edited successfully");
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error editing story: ", error);
    }
};