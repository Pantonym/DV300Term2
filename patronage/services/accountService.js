import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// Get user from an ID
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

// Create user from data, using the ID generated from Authentication so auto generated ID's are not used.
export const createUser = async (data, userID) => {

    try {
        await setDoc(doc(db, "users", userID), data);
        console.log("Created user: ", userID)
    } catch (error) {
        console.log(error)
        console.log("error data: ", data)
    }

}

// Change the user's profile icon, receiving the uri to change the image link. It finds the correct user through userID
export const changeUserProfileIcon = async (uri, userID) => {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const userData = docSnap.data();
        var userImg = userData.userImg;

        // Add the new story to the works array
        userImg = uri;

        // Update the user's document in Firestore with the new works array
        await setDoc(docRef, { ...userData, userImg });

        console.log("Profile Changed Successfully");
    } else {
        console.log("No such document!");
    }
}

// Change username, finding the user through the ID and setting ti to the received newUsername
export const changeUsername = async (userID, newUsername) => {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const userData = docSnap.data();
        var username = userData.username;

        // Add the new username
        username = newUsername;

        // Update the user's document in Firestore with the new username
        await setDoc(docRef, { ...userData, username });

        console.log("Profile Changed Successfully");
    } else {
        console.log("No such document!");
    }
}

export const getAllUsers = async () => {
    try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);
        const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return users;
    } catch (error) {
        console.error("Error getting users:", error);
        throw new Error("Failed to get users");
    }
};

export const addAward = async (userID, selectedGenre, selectedPlace, selectedYear) => {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        var data = docSnap.data();

        data.awards.push({
            "genre": selectedGenre,
            "place": selectedPlace,
            "year": selectedYear
        })

        await updateDoc(docRef, data);

    } else {
        console.log("No such document!");
    }
}

export const removeReward = async (userID, award) => {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        var data = docSnap.data();

        // Filter out the award that matches the one sent through params
        const updatedAwards = data.awards.filter(
            a => !(a.genre === award.genre && a.year === award.year && a.place === award.place)
        );

        await updateDoc(docRef, { awards: updatedAwards });

    } else {
        console.log("No such document!");
    }
}