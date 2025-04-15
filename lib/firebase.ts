import 'react-native-get-random-values';
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword,
  signInWithEmailAndPassword, initializeAuth,
  onAuthStateChanged, browserLocalPersistence,
  setPersistence, getReactNativePersistence, FacebookAuthProvider, signInWithCredential, signInAnonymously, GoogleAuthProvider
} from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import root from './apihttp';
// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
// import * as Facebook from "expo-auth-session/providers/facebook";
// import * as Google from "expo-auth-session/providers/google";
import { getFirestore, doc, setDoc, updateDoc, getDoc, deleteDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Alert } from "react-native";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, set } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ID } from 'react-native-appwrite';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { firebaseConfig } from './firebaseConfig';
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication setup (Web SDK)

export const db = getFirestore(app);
// Optionally, you can use AsyncStorage for persistence in React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Use AsyncStorage for persistence
});

export { auth };
export const storage = getStorage(app);


export const handleAnonymousSignup = async () => {
  try {
    const auth = getAuth();
    const userCredential = await signInAnonymously(auth); // Sign in anonymously
    const user = userCredential.user;

    console.log("Anonymous user signed in:", user.uid);

    // You can now send the user data to the backend

  } catch (error) {
    console.error("Error during anonymous signup:", error);
  }
};
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    const user = userCredential.user; // Get the user object


    console.log("User signed in:", userId);
    return user;
  } catch (error) {
    console.error("Sign-in error:", error.message);
    throw new Error(error.message);
  }
};


export const createUser = async (email, password, username) => {
  try {
    // Create a new user with the provided email and password in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {
      console.log("User created:", user.uid);
      // Send additional data to the server
      await axios.post(`http://${root}:3000/signup`, {
        uid: user.uid, // Use Firebase UID
        avatar: username.charAt(0), // Default avatar
        username: username,
        email: email,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });
    } else {
      console.log("No user created");
    }

    return user;
  } catch (error) {
    console.error("Create user error:", error.message);
    throw new Error(error.message);
  }
};
export const resetPassword = async (email) => {
  try {
    // Send the password reset email
    await sendPasswordResetEmail(auth, email);
    console.log(`Password reset email sent to ${email}`);
    return `Password reset email sent to ${email}`;
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    throw new Error(error.message);
  }
};
export const changePassword = async (newPassword) => {
  try {
    const user = auth.currentUser; // Get the currently signed-in user

    if (!user) {
      throw new Error("No user is currently signed in.");
    }

    // Update the password
    await updatePassword(user, newPassword);
    console.log("Password updated successfully!");
    return "Password updated successfully!";
  } catch (error) {
    console.error("Error updating password:", error.message);
    throw new Error(error.message);
  }
};



export const updateUserRole = async (userId, newRole) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    // Check if the user document exists
    if (!userDoc.exists()) {
      Alert.alert("Error", "User not found.");
      return;
    }

    const userData = userDoc.data();
    const accountId = userData?.userId; // Assuming accountId is the field to query against

    // Ensure that the accountId exists
    if (!userId) {
      Alert.alert("Error", "Account ID is missing for this user.");
      return;
    }

    // Only update if the role is changing
    if (userData.role !== newRole) {
      await updateDoc(userRef, { role: newRole });

      if (newRole === "creator") {
        const creatorRef = collection(db, 'creators'); // Fix: use collection instead of doc
        const q = query(creatorRef, where("creatoraccountId", "==", userId)); // Correct field name
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          Alert.alert("A creator with this account already exists.");
          return;
        }

        // Add user to creators collection
        await setDoc(doc(db, 'creators', userId), {
          creatoraccountId: userId, // Correct field name
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
          role: newRole,
        });
      } else if (newRole === "user") {
        // Remove from creators collection if role changes back to "user"
        const creatorRef = collection(db, 'creators'); // Fix: use collection instead of doc
        const q = query(creatorRef, where("creatoraccountId", "==", userId)); // Correct field name
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          await deleteDoc(doc(db, 'creators', querySnapshot.docs[0].id));
        }
      }

      Alert.alert("Success", `User role updated to ${newRole}`);
    } else {
      Alert.alert("No change detected", `User role is already ${newRole}`);
    }
    return { id: userId, role: newRole };
  } catch (error) {
    console.error("Error updating user role:", error);
    Alert.alert("Error", "There was an issue updating the role.");
    throw new Error(error);
  }
};

export const getUsersByUsername = async (prefix) => {
  try {
    const q = query(
      collection(db, "users"),
      where("username", ">=", prefix),
      where("username", "<=", prefix + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return users;
  } catch (error) {
    console.error("Error getting users by username:", error);
    throw new Error(error);
  }
};
export const getCreatoresByUsername = async () => {
  try {
    const creatorCollection = collection(db, "creators");
    const querySnapshot = await getDocs(creatorCollection);
    const creators = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return creators;
  } catch (error) {
    console.error("Error getting creators by username:", error);
    throw new Error(error);
  }
};

const uriToBlob = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error converting URI to Blob:", error);
    throw error;
  }
};



export const uploadFile = async (file, type, index) => {
  if (!file) {
    throw new Error("File URI is missing");
  }


  const uniqueId = uuidv4();
  const fileName = `${uniqueId}-${index}.jpg`; // Unique filename
  const storageRef = ref(storage, `mySQL/${fileName}`); // Reference in Firebase Storage

  console.log("Uploading file:", file);
  console.log("File name:", fileName);

  try {
    const fileBlob = await uriToBlob(file); // Convert URI to Blob
    const snapshot = await uploadBytes(storageRef, fileBlob); // Upload Blob to Firebase
    const downloadURL = await getDownloadURL(snapshot.ref); // Get the download URL
    console.log("File uploaded successfully. Download URL:", downloadURL);

    // Convert to gs:// URL
    const gsUrl = `gs://newlightnew-82e5f.firebasestorage.app/mySQL/${fileName}`;

    return { gsUrl, publicUrl: downloadURL }; // Return both gsUrl and public URL
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(error);
  }
};
export const deleteImage = async (gsUrl) => {
  try {
    // Extract the file path from the gsUrl
    const filePath = gsUrl.replace('gs://newlightnew-82e5f.firebasestorage.app/', '');

    console.log('File path:', filePath);

    // Get a reference to the file in Firebase Storage
    const storageRef = ref(storage, filePath);

    // Delete the file
    await deleteObject(storageRef);
    console.log('File deleted successfully');
    Alert.alert('Success', 'Image deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    Alert.alert('Error', 'Failed to delete the image');
  }
};
export const uploadFileforads = async (file, type, index) => {
  if (!file) {
    throw new Error("File URI is missing");
  }


  const uniqueId = uuidv4();
  const fileName = `${uniqueId}-${index}.jpg`; // Unique filename
  const storageRef = ref(storage, `adsImages/${fileName}`); // Reference in Firebase Storage

  console.log("Uploading file:", file);
  console.log("File name:", fileName);

  try {
    const fileBlob = await uriToBlob(file); // Convert URI to Blob
    const snapshot = await uploadBytes(storageRef, fileBlob); // Upload Blob to Firebase
    const downloadURL = await getDownloadURL(snapshot.ref); // Get the download URL
    console.log("File uploaded successfully. Download URL:", downloadURL);

    // Convert to gs:// URL
    const gsUrl = `gs://newlightnew-82e5f.firebasestorage.app/adsImages/${fileName}`;

    return { gsUrl, publicUrl: downloadURL }; // Return both gsUrl and public URL
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(error);
  }
};
export const deleteImageforads = async (data) => {
  try {
    // Extract file paths and delete them
    await Promise.all(
      data.map(async (item) => {
        try {
          const filePath = item.gsUrl.replace(
            "gs://newlightnew-82e5f.firebasestorage.app/",
            ""
          );
          const storageRef = ref(storage, filePath);
          await deleteObject(storageRef);
          console.log("File deleted successfully:", filePath);
        } catch (error) {
          console.error("Error deleting file:", error);
          throw error; // Rethrow error so Promise.all can catch it
        }
      })
    );

    // Show success alert after all images are deleted
    Alert.alert("Success", "All images deleted successfully");
  } catch (error) {
    Alert.alert("Error", "Failed to delete some or all images");
  }
};
