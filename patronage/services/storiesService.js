import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addAward } from "./accountService";
import { arrGenres } from "../context/genres";

// create a new story
export const handleStoryCreate = async (storyDetails, userID) => {
    try {
        const userDocRef = doc(db, "users", userID);

        // Create a subcollection for works within the user's document and add the story
        const worksCollectionRef = collection(userDocRef, "works");
        const newStoryDocRef = doc(worksCollectionRef, storyDetails.id);

        // Set the story details in the Firestore
        await setDoc(newStoryDocRef, storyDetails);

        console.log("Story added successfully");
    } catch (error) {
        console.error("Error adding story: ", error);
    }
};

// fetch user stories
export const fetchUserStories = async (userID) => {
    try {
        const worksCollectionRef = collection(db, "users", userID, "works");
        const querySnapshot = await getDocs(worksCollectionRef);

        let stories = [];
        querySnapshot.forEach((doc) => {
            stories.push(doc.data());
        });

        return stories;
    } catch (error) {
        console.error("Error fetching stories: ", error);
        return [];
    }
};

// Delete a work
export const deleteStory = async (userID, storyID) => {
    console.log('Delete: ', userID, storyID);

    try {
        const worksCollectionRef = collection(db, "users", userID, "works");
        const querySnapshot = await getDocs(worksCollectionRef);

        let storyDocId = null;
        querySnapshot.forEach((doc) => {
            if (doc.data().id === storyID) {
                storyDocId = doc.id;
            }
        });

        if (storyDocId) {
            const storyDocRef = doc(db, "users", userID, "works", storyDocId);
            await deleteDoc(storyDocRef);
            console.log("Story deleted successfully");
        } else {
            console.log("No such story found!");
        }
    } catch (error) {
        console.error("Error deleting story: ", error);
    }
};

// Publish a work
export const publishStory = async (userID, storyID) => {
    console.log('Publish: ', userID, storyID);

    try {
        const userDocRef = doc(db, "users", userID);
        const worksCollectionRef = collection(userDocRef, "works");
        const querySnapshot = await getDocs(worksCollectionRef);

        let chosenGenre = "";
        let leaderboardItem = null;
        const currentYear = new Date().getFullYear().toString();

        console.log('Number of works found: ', querySnapshot.size);

        // Find the story in the user's works subcollection
        querySnapshot.forEach((doc) => {
            const work = doc.data();

            if (work.id === storyID) {
                // Set that work's completed value to true
                work.completed = true;

                // Build the leaderboard item
                leaderboardItem = {
                    "id": work.id,
                    "authorID": userID,
                    "genre": work.genre,
                    "description": work.description,
                    "title": work.title,
                    "chapters": work.chapters.map((chapter) => ({
                        "chapterTitle": chapter.chapterTitle,
                        "chapterContent": chapter.chapterContent,
                        "comments": [],
                        "ratings": []
                    }))
                };

                chosenGenre = work.genre.toLowerCase();
                console.log(`Found story to publish: ${work.title}`);
            }
        });

        if (leaderboardItem) {
            // Update the user's work as completed in Firestore
            const storyDocRef = doc(worksCollectionRef, leaderboardItem.id);
            await updateDoc(storyDocRef, { completed: true });

            console.log("Story marked as completed in user's works");

            // Add the story to the leaderboard
            const leaderboardCollectionRef = collection(db, 'leaderboards');
            const shortStoriesDocRef = doc(leaderboardCollectionRef, 'shortStories');
            const yearCollectionRef = collection(shortStoriesDocRef, currentYear);
            const genreCollectionRef = collection(yearCollectionRef, chosenGenre, 'stories');
            const leaderboardStoryDocRef = doc(genreCollectionRef, leaderboardItem.id);

            await setDoc(leaderboardStoryDocRef, leaderboardItem);

            console.log("Story published to leaderboard successfully");
        } else {
            console.log("No such story found in user's works!");
        }
    } catch (error) {
        console.error("Error publishing story: ", error);
    }
};

// unpublish a work
export const unPublishStory = async (userID, storyID) => {
    console.log('Unpublish: ', userID, storyID);

    try {
        const userDocRef = doc(db, "users", userID);
        const worksCollectionRef = collection(userDocRef, "works");
        const querySnapshot = await getDocs(worksCollectionRef);

        let chosenGenre = "";
        const currentYear = new Date().getFullYear().toString();
        let unpublishedItemID = null;

        // Find the story in the user's works subcollection
        querySnapshot.forEach((doc) => {
            const work = doc.data();
            if (work.id === storyID) {
                // Set that work's completed value to false
                work.completed = false;
                unpublishedItemID = doc.id;

                chosenGenre = work.genre.toLowerCase();
                console.log(`Found story to unpublish: ${work.title}`);
            }
        });

        if (unpublishedItemID) {
            const storyDocRef = doc(worksCollectionRef, unpublishedItemID);
            await updateDoc(storyDocRef, { completed: false });

            console.log("Story marked as not completed in user's works");

            // Delete the story from the leaderboard
            const leaderboardCollectionRef = collection(db, 'leaderboards');
            const shortStoriesDocRef = doc(leaderboardCollectionRef, 'shortStories');
            const yearCollectionRef = collection(shortStoriesDocRef, currentYear);
            const genreCollectionRef = collection(yearCollectionRef, chosenGenre, 'stories');
            const leaderboardStoryDocRef = doc(genreCollectionRef, unpublishedItemID);

            await deleteDoc(leaderboardStoryDocRef);

            console.log("Story deleted from leaderboard successfully");
        } else {
            console.log("No such story found in user's works!");
        }
    } catch (error) {
        console.error("Error unpublishing story: ", error);
    }
};

// update a work
export const updateStory = async (userID, storyID, newContent, newTitle, newDescription, newGenre) => {
    try {
        const userDocRef = doc(db, "users", userID);
        const worksCollectionRef = collection(userDocRef, "works");
        const storyDocRef = doc(worksCollectionRef, storyID);

        const storyDocSnap = await getDoc(storyDocRef);

        if (storyDocSnap.exists()) {
            const storyData = storyDocSnap.data();

            // Update the story's values
            storyData.title = newTitle;
            storyData.description = newDescription;
            storyData.genre = newGenre;
            storyData.chapters[0].chapterTitle = newTitle;
            storyData.chapters[0].chapterContent = newContent;

            console.log(storyData);

            // Update the story document in Firestore
            await updateDoc(storyDocRef, storyData);

            console.log("Story edited successfully");
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error editing story: ", error);
    }
};

// Get short stories of a specific genre and calculate average ratings
export const getShortStoriesByGenre = async (genre) => {
    try {
        const currentYear = new Date().getFullYear().toString();
        const storiesCollectionRef = collection(db, 'leaderboards', 'shortStories', currentYear, genre.toLowerCase(), 'stories');
        const querySnapshot = await getDocs(storiesCollectionRef);

        let stories = [];

        querySnapshot.forEach((doc) => {
            let storyData = doc.data();
            const ratings = storyData.chapters[0].ratings || [];
            const totalRating = ratings.reduce((sum, rating) => sum + rating.voteAmount, 0);
            const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
            storyData.averageRating = averageRating;
            stories.push(storyData);
        });

        return stories;
    } catch (error) {
        console.error("Error fetching short stories by genre:", error);
        return [];
    }
};

// Get Author Username
export const getAuthorUsername = async (userID) => {
    const userRef = doc(db, 'users', userID);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        return docSnap.data().username;
    } else {
        console.log('No such document!');
        return null;
    }
};

// Get all short stories
export const getAllShortStories = async () => {
    try {
        const currentYear = new Date().getFullYear().toString();
        let allStories = [];

        // Fetch stories for all predefined genres concurrently
        const fetchStoriesByGenrePromises = arrGenres.map(async (genreObj) => {
            const genre = genreObj.value.toLowerCase();
            const storiesCollectionRef = collection(db, 'leaderboards', 'shortStories', currentYear, genre, 'stories');
            const storiesSnapshot = await getDocs(storiesCollectionRef);

            storiesSnapshot.forEach(storyDoc => {
                let storyData = storyDoc.data();
                const ratings = storyData.chapters[0].ratings || [];
                const totalRating = ratings.reduce((sum, rating) => sum + rating.voteAmount, 0);
                const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
                storyData.averageRating = averageRating;
                allStories.push(storyData);
            });
        });

        await Promise.all(fetchStoriesByGenrePromises);
        return allStories;
    } catch (error) {
        console.error("Error fetching short stories", error);
        return [];
    }
};

// Rate a story
export const rateStory = async (authorID, voteAmount, workGenre, storyID) => {
    try {
        // Get the ID of the logged in user
        const userID = await AsyncStorage.getItem('UserID');
        const selectedGenre = workGenre.toLowerCase();
        const currentYear = new Date().getFullYear().toString();

        // Reference to the specific story document
        const storyRef = doc(db, 'leaderboards', 'shortStories', currentYear, selectedGenre, 'stories', storyID);
        const storyDoc = await getDoc(storyRef);

        // Test if the user is the author
        if (userID === authorID) {
            console.log("User cannot vote on their own story");
            return false;
        }

        if (storyDoc.exists()) {
            const storyData = storyDoc.data();

            // Check if the user has already voted
            const hasVoted = storyData.chapters[0].ratings.some(rating => rating.voterID === userID);

            if (hasVoted) {
                console.log("User has already voted on this story.");
                return false;
            } else {
                // Build the new rating object
                const newRating = { "voterID": userID, "voteAmount": voteAmount };
                storyData.chapters[0].ratings.push(newRating);

                // Update the document with the new ratings
                await updateDoc(storyRef, {
                    chapters: storyData.chapters
                });

                console.log("Rating added successfully.");
                return true;
            }
        } else {
            console.log("No such story!");
            return false;
        }
    } catch (error) {
        console.error("Error adding rating: ", error);
        return false;
    }
};

// Get leaderboard stories
export const getLeaderboards = async (genre) => {
    try {
        const currentYear = new Date().getFullYear().toString();
        const genreRef = collection(db, 'leaderboards', 'shortStories', currentYear, genre.toLowerCase(), 'stories');
        const querySnapshot = await getDocs(genreRef);

        let genreStories = [];

        querySnapshot.forEach((doc) => {
            let storyData = doc.data();
            const ratings = storyData.chapters[0].ratings || [];
            const totalRating = ratings.reduce((sum, rating) => sum + rating.voteAmount, 0);
            const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
            storyData.averageRating = averageRating;
            genreStories.push(storyData);
        });

        return genreStories;
    } catch (error) {
        console.error("Error fetching stories:", error);
        return [];
    }
};

// Get a single story by its ID
export const getShortStoryByID = async (storyID) => {
    try {
        const year = new Date().getFullYear().toString();
        const genres = arrGenres;

        for (const genre of genres) {
            const storyRef = doc(db, 'leaderboards', 'shortStories', year, genre.value.toLowerCase(), 'stories', storyID);
            const docSnap = await getDoc(storyRef);

            if (docSnap.exists()) {
                let storyData = docSnap.data();
                const ratings = storyData.chapters[0].ratings || [];
                const totalRating = ratings.reduce((sum, rating) => sum + rating.voteAmount, 0);
                const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
                storyData.averageRating = averageRating;

                return storyData;
            }
        }

        console.error("No matching story found.");
        return null;
    } catch (error) {
        console.error("Error fetching story: ", error);
        return null;
    }
};

// Add comment function
export const addComment = async (storyID, chapterIndex, comment, genre) => {
    try {
        const year = new Date().getFullYear().toString();
        const storyRef = doc(db, 'leaderboards', 'shortStories', year, genre.toLowerCase(), 'stories', storyID);
        const docSnap = await getDoc(storyRef);

        if (docSnap.exists()) {
            const storyData = docSnap.data();
            // Add the comment to the specified chapter (assuming 'chapters' exists as a subcollection)
            storyData.chapters[chapterIndex].comments.push(comment);

            // Update the Firestore document
            await setDoc(storyRef, storyData);

            return true;
        } else {
            console.error("No matching story found.");
            return false;
        }
    } catch (error) {
        console.error("Error adding comment:", error);
        return false;
    }
};

// Delete your own comment from a story
export const deleteComment = async (storyID, chapterIndex, commentIndex, genre) => {
    try {
        const year = new Date().getFullYear().toString();
        const storyRef = doc(db, 'leaderboards', 'shortStories', year, genre.toLowerCase(), 'stories', storyID);
        const docSnap = await getDoc(storyRef);

        if (docSnap.exists()) {
            const storyData = docSnap.data();
            // Remove the comment from the specified chapter
            storyData.chapters[chapterIndex].comments.splice(commentIndex, 1);

            // Update the Firestore document
            await setDoc(storyRef, storyData);

            return true;
        } else {
            console.error("No matching story found.");
            return false;
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        return false;
    }
};

// Function to end the competition, move top 3 to previousLeaders, and add awards to relevant users
// --It is no longer needed to remove the stories as the competitions would be ended at 11:59 31 December, meaning the next year's stories will be displayed by the time users use the app again.
export const endCompetition = async (genre) => {
    try {
        const year = new Date().getFullYear().toString();
        const normalizedGenre = genre.trim().toLowerCase();

        // Reference to the stories collection for the specific genre and year
        const storyRef = collection(db, 'leaderboards', 'shortStories', year, normalizedGenre, 'stories');
        const storySnapshot = await getDocs(storyRef);

        if (!storySnapshot.empty) {
            // Filter stories by those with 5 or more ratings
            const filteredStories = storySnapshot.docs.filter(doc => doc.data().chapters[0].ratings.length >= 5);

            // Sort filtered stories by average rating percentage descending
            filteredStories.sort((a, b) => b.data().averageRating - a.data().averageRating);

            // Get the top 3 stories
            const top3Stories = filteredStories.slice(0, 3);

            // Add the top 3 stories to the previousLeaders collection
            for (let i = 0; i < top3Stories.length; i++) {
                const story = top3Stories[i].data();
                const place = i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze';

                // Add story to previousLeaders collection under genre/year/storyID
                const previousLeaderRef = doc(db, 'previousLeaders', normalizedGenre, year, top3Stories[i].id);
                await setDoc(previousLeaderRef, {
                    ...story,
                    place,
                    year
                });

                // Add award to the user
                await addAward(story.authorID, normalizedGenre, place, year);
            }

            console.log(`Competition ended for ${genre}. Top 3 stories moved to previousLeaders and awards assigned.`);
        } else {
            console.log("No matching documents found for the genre and year.");
        }
    } catch (error) {
        console.error("Error ending competition: ", error);
    }
};