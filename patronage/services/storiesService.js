import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addAward } from "./accountService";

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

// Delete a work
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

// Publish a work
export const publishStory = async (userID, storyTitle) => {
    console.log('Publish: ', userID, storyTitle);

    try {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            var works = userData.works;
            var leaderboardItem = []
            var chosenGenre = "";

            // Find the index of the story the user clicked on
            for (let k = 0; k < works.length; k++) {

                if (works[k].title == storyTitle) {
                    // Set that work's completed value to true
                    works[k].completed = true

                    // build the leaderboard item
                    leaderboardItem = {
                        "id": works[k].id,
                        "authorID": userID,
                        "genre": works[k].genre,
                        "description": works[k].description,
                        "title": works[k].title,
                        "chapters": [
                            {
                                "chapterTitle": works[k].title,
                                "chapterContent": works[k].chapters[0].chapterContent,
                                "comments": [],
                                "ratings": []
                            }
                        ]
                    }

                    chosenGenre = works[k].genre;
                    chosenGenre = chosenGenre.toLowerCase();

                }

            }

            // Update the user's document in Firestore with the new works array
            await setDoc(docRef, { ...userData, works });

            console.log("Story published successfully");

            // Once everything is done, upload the data
            try {
                const storiesRef = doc(db, 'leaderboards', 'shortStories');
                const docSnapLeader = await getDoc(storiesRef);

                if (docSnapLeader.exists()) {
                    const leaderboardsData = docSnapLeader.data();
                    const genreData = leaderboardsData[chosenGenre];

                    if (genreData) {
                        // Push the new leaderboard item to the genreData array
                        genreData.push(leaderboardItem);
                        // Update the genreData in Firestore
                        await updateDoc(storiesRef, {
                            [chosenGenre]: genreData
                        });
                        console.log("Genre data updated successfully");
                    } else {
                        console.log(`No such genre '${chosenGenre}' in 'shortStories'!`);
                    }
                } else {
                    console.log("No such document 'shortStories'!");
                }
            } catch (error) {
                console.error("Error updating genre data: ", error);
            }

        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error publishing story: ", error);
    }
}

// unpublish a work
export const unPublishStory = async (userID, storyTitle) => {
    console.log('Unpublish: ', userID, storyTitle)

    try {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            var works = userData.works;
            var chosenGenre = "";

            let unpublishedItem = null;

            // Find the index of the story the user clicked on
            for (let k = 0; k < works.length; k++) {
                if (works[k].title === storyTitle) {
                    // Set that work's completed value to false
                    works[k].completed = false;

                    // Prepare the unpublished item for deletion
                    unpublishedItem = {
                        authorID: userID,
                        title: works[k].title
                    };

                    chosenGenre = works[k].genre;
                    chosenGenre = chosenGenre.toLowerCase();
                }
            }

            // Update the user's document in Firestore with the new works array
            await setDoc(docRef, { ...userData, works });

            console.log("Story unpublished successfully");

            // Delete the item from the leaderboard
            try {
                const storiesRef = doc(db, 'leaderboards', 'shortStories');
                const docSnapLeader = await getDoc(storiesRef);

                if (docSnapLeader.exists()) {
                    const leaderboardsData = docSnapLeader.data();
                    const genreData = leaderboardsData[chosenGenre];

                    console.log(genreData)

                    if (genreData) {
                        // Find the index of the item to delete
                        const indexToDelete = genreData.findIndex(item =>
                            item.authorID === unpublishedItem.authorID &&
                            item.title === unpublishedItem.title
                        );

                        if (indexToDelete !== -1) {
                            // Remove the item from the array
                            genreData.splice(indexToDelete, 1);

                            // Update the genreData in Firestore
                            await updateDoc(storiesRef, {
                                [chosenGenre]: genreData
                            });

                            console.log("Item deleted from leaderboard");
                        } else {
                            console.log(`No matching item found in leaderboard for ${unpublishedItem.title}`);
                        }
                    } else {
                        console.log(`No such genre '${chosenGenre}' in 'shortStories'!`);
                    }
                } else {
                    console.log("No such document 'shortStories'!");
                }
            } catch (error) {
                console.error("Error deleting item from leaderboard: ", error);
            }

        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error unpublishing story: ", error);
    }
}

// update a work
export const updateStory = async (userID, storyTitle, newContent, newTitle, newDescription, newGenre) => {
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
                    works[k].description = newDescription;
                    works[k].genre = newGenre;

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

// Get short stories of a specific genre and calculate average ratings
export const getShortStoriesByGenre = async (genre) => {
    try {
        const storiesRef = doc(db, 'leaderboards', 'shortStories');
        const docSnap = await getDoc(storiesRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const stories = data[genre] || [];

            // Calculate the average rating for each story
            stories.forEach(story => {
                const ratings = story.chapters[0].ratings || [];
                const totalRating = ratings.reduce((sum, rating) => sum + rating.voteAmount, 0);
                const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
                story.averageRating = averageRating;
            });

            return stories;
        } else {
            console.log("No such document!");
            return [];
        }
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
        const storiesRef = doc(db, 'leaderboards', 'shortStories');
        const docSnap = await getDoc(storiesRef);

        if (docSnap.exists()) {
            const storiesData = docSnap.data();
            return storiesData; // Return the entire shortStories object
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching short stories", error);
        return null;
    }
};

// Rate a story
export const rateStory = async (authorID, voteAmount, workTitle, workGenre) => {
    try {
        // Get the ID of the logged in user
        const userID = await AsyncStorage.getItem('UserID');
        const selectedGenre = workGenre.toLowerCase();

        const storyRef = doc(db, 'leaderboards', 'shortStories');
        const storyDoc = await getDoc(storyRef);

        // Test if the user is the author
        if (userID === authorID) {
            console.log("User cannot vote on their own story");
            return false;
        }

        if (storyDoc.exists()) {
            const allStories = storyDoc.data();
            const genreStories = allStories[selectedGenre];

            let storyFound = null;
            let storyIndex = -1;

            // Find the story to update
            for (let k = 0; k < genreStories.length; k++) {
                if (genreStories[k].authorID === authorID && genreStories[k].title === workTitle) {
                    storyFound = genreStories[k];
                    storyIndex = k;
                    break;
                }
            }

            if (storyFound) {
                // Check if the user has already voted
                const hasVoted = storyFound.chapters[0].ratings.some(rating => rating.voterID === userID);

                if (hasVoted) {

                    return false;

                } else {

                    // Build the new ratings
                    storyFound.chapters[0].ratings.push({ "voterID": userID, "voteAmount": voteAmount });

                    // Update the genreStories array
                    genreStories[storyIndex] = storyFound;

                    // Write the updated genreStories back to Firestore
                    await updateDoc(storyRef, {
                        [selectedGenre]: genreStories
                    });

                    console.log("Rating added successfully.");
                    return true;

                }
            } else {
                console.log("No matching story found to update.");
                return false;
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
        const storyRef = doc(db, 'leaderboards', 'shortStories');
        const storyDoc = await getDoc(storyRef);

        if (storyDoc.exists()) {

            // Only get leaderboard stories from a specific genre
            const allStories = storyDoc.data();
            const genreStories = allStories[genre.toLowerCase()] || [];

            // Calculate the average rating for each story
            genreStories.forEach(story => {
                const ratings = story.chapters[0].ratings || [];
                const totalRating = ratings.reduce((sum, rating) => sum + rating.voteAmount, 0);
                const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
                story.averageRating = averageRating;
            });

            return genreStories;

        } else {
            console.log("No such document!");
            return [];
        }
    } catch (error) {
        console.error("Error fetching stories: ", error);
        return [];
    }
};

// Get a single story's ID
export const getShortStoryID = async (authorID, storyTitle) => {
    try {
        const storiesRef = doc(db, 'leaderboards', 'shortStories');
        const docSnap = await getDoc(storiesRef);

        if (docSnap.exists()) {
            const allStories = docSnap.data();
            for (const genre in allStories) {
                const stories = allStories[genre];
                for (const story of stories) {
                    if (story.authorID === authorID && story.title === storyTitle) {
                        return story.id;
                    }
                }
            }

            console.error("No matching story found.");
            return null;
        } else {
            console.error("No document found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching storyID: ", error);
        return null;
    }
};

// Get a single story by its ID
export const getShortStoryByID = async (storyID) => {
    try {
        const storiesRef = doc(db, 'leaderboards', 'shortStories');
        const docSnap = await getDoc(storiesRef);

        if (docSnap.exists()) {
            const allStories = docSnap.data();
            for (const genre in allStories) {
                const stories = allStories[genre];
                for (const story of stories) {
                    if (story.id === storyID) {
                        return story;
                    }
                }
            }
            console.error("No matching story found.");
            return null;
        } else {
            console.error("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching story: ", error);
        return null;
    }
};

// Add comment function
export const addComment = async (storyID, chapterIndex, comment) => {
    try {
        const storiesRef = doc(db, 'leaderboards', 'shortStories');
        const docSnap = await getDoc(storiesRef);

        if (docSnap.exists()) {
            const allStories = docSnap.data();
            for (const genre in allStories) {
                const stories = allStories[genre];
                for (let story of stories) {
                    if (story.id === storyID) {
                        // Add the comment to the specified chapter (future proofing for other story types with more than one chapter)
                        story.chapters[chapterIndex].comments.push(comment);

                        // Update the Firestore document
                        await updateDoc(storiesRef, { [genre]: allStories[genre] });

                        return true;
                    }
                }
            }
            console.error("No matching story found.");
            return false;
        } else {
            console.error("No such document!");
            return false;
        }
    } catch (error) {
        console.error("Error adding comment:", error);
        return false;
    }
};

// Delete your own comment from a story
export const deleteComment = async (storyID, chapterIndex, commentIndex) => {
    try {
        const storiesRef = doc(db, 'leaderboards', 'shortStories');
        const docSnap = await getDoc(storiesRef);

        if (docSnap.exists()) {
            const allStories = docSnap.data();
            for (const genre in allStories) {
                const stories = allStories[genre];
                for (let story of stories) {
                    if (story.id === storyID) {
                        // Remove the comment from the specified chapter
                        story.chapters[chapterIndex].comments.splice(commentIndex, 1);

                        // Update the Firestore document
                        await updateDoc(storiesRef, { [genre]: allStories[genre] });

                        return true;
                    }
                }
            }
            console.error("No matching story found.");
            return false;
        } else {
            console.error("No such document!");
            return false;
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        return false;
    }
};

// Function to end the competition, remove stories, move top 3 to previousLeaders, and add awards to relevant users
export const endCompetition = async (genre) => {
    try {
        const storyRef = doc(db, 'leaderboards', 'shortStories');
        const storyDoc = await getDoc(storyRef);

        if (storyDoc.exists()) {
            const allStories = storyDoc.data();
            const normalizedGenre = genre.trim().toLowerCase();
            const genreStories = allStories[normalizedGenre] || [];

            // Sort stories by average rating descending
            genreStories.sort((a, b) => b.averageRating - a.averageRating);

            // Get the top 3 stories
            const top3Stories = genreStories.slice(0, 3);

            // Get the current year
            const year = new Date().getFullYear();

            // Add the top 3 stories to the previousLeaders collection
            for (let i = 0; i < top3Stories.length; i++) {
                const story = top3Stories[i];
                const place = i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze';

                // Add story to previousLeaders collection under genre/year
                const previousLeaderRef = doc(db, `previousLeaders/${normalizedGenre}/${year.toString()}/${story.id}`);
                await setDoc(previousLeaderRef, {
                    ...story,
                    place,
                    year
                });

                // Add award to the user
                await addAward(story.authorID, genre, place, year.toString());
            }

            // Set the genre stories to an empty array
            console.log(allStories[normalizedGenre]);
            allStories[normalizedGenre] = [];
            console.log(allStories[normalizedGenre]);

            // Update the leaderboards collection
            await updateDoc(storyRef, allStories);

            console.log(`Competition ended for ${genre}. Top 3 stories moved to previousLeaders and awards assigned.`);
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error ending competition: ", error);
    }
};