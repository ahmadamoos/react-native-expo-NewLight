// import  { useEffect, useState } from "react";
// import * as Facebook from "expo-auth-session/providers/facebook";
// import { Button } from "react-native";
// import { FacebookAuthProvider, signInWithCredential } from "firebase/auth";
// import axios from "axios";
// import { auth } from "../../lib/firebase"; // Adjust the import to your Firebase config
// import root from "../../lib/apihttp"; // Your backend API root

// const FacebookSignUpButton = () => {
//   const [request, response, promptAsync] = Facebook.useAuthRequest({
//     clientId: "1328751585143584",
//     scopes: ["public_profile", "email"],
//   });

//   useEffect(() => {
//     const handleFacebookSignIn = async () => {
//       if (response?.type === "success") {
//         try {
//           const { access_token } = response.params;

//           // Create Firebase credential with Facebook token
//           const credential = FacebookAuthProvider.credential(access_token);
//           const userCredential = await signInWithCredential(auth, credential);
//           const user = userCredential.user;

//           console.log("User signed up with Facebook:", user.uid);

//           // Send user data to MySQL
//           await axios.post(
//             `http://${root}:3000/signup`,
//             {
//               uid: user.uid,
//               avatar: user.displayName ? user.displayName.charAt(0) : "U",
//               username: user.displayName || "Unknown User",
//               email: user.email || "",
//             },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//         } catch (error) {
//           console.error("Facebook Sign-Up Error:", error.message);
//         }
//       }
//     };

//     handleFacebookSignIn();
//   }, [response]);

//   return (
//     <Button
//       title="Sign Up with Facebook"
//       onPress={() => promptAsync()}
//       disabled={!request}
//     />
//   );
// };

// export default FacebookSignUpButton;
// import React from "react";
// import { Button, Image, Platform, Text, TouchableOpacity } from "react-native";
// import { LoginManager, AccessToken } from "react-native-fbsdk-next";
// import {
//   getAuth,
//   FacebookAuthProvider,
//   signInWithCredential,
// } from "firebase/auth";
// import { auth } from "../../lib/firebase";

// async function loginWithFacebook() {
//   try {
//     // Trigger Facebook Login
//     const result = await LoginManager.logInWithPermissions([
//       "public_profile",
//       "email",
//     ]);

//     if (result.isCancelled) {
//       console.log("Login cancelled");
//       return;
//     }

//     // Get the access token
//     const data = await AccessToken.getCurrentAccessToken();

//     if (data) {
//       // Facebook credential
//       const credential = FacebookAuthProvider.credential(data.accessToken);

//       // Sign in to Firebase with the Facebook credential
//       const userCredential = await signInWithCredential(auth, credential);
//       console.log(userCredential.user); // User information after successful sign-in
//     }
//   } catch (error) {
//     console.error("Facebook Login Error:", error);
//   }
// }

// export default function App() {
//   return (
//     <TouchableOpacity onPress={loginWithFacebook}>
//       <Image
//         source={icons.facebookicon}
//         className="w-12 h-12 rounded-3xl mt-2 mx-3 "
//       />
//       <Text className="color-white text-center">facebook</Text>
//     </TouchableOpacity>
//   );
// }
// import { icons } from "@/constants";
// import * as Facebook from "expo-auth-session/providers/facebook";
// import { useEffect } from "react";
// import { Button, Image, Text, TouchableOpacity, View } from "react-native";

// export default function FacebookLogin() {
//   const [request, response, promptAsync] = Facebook.useIdTokenAuthRequest({
//     clientId: "1328751585143584",
//   });

//   useEffect(() => {
//     if (response?.type === "success") {
//       console.log("Facebook Login Success:", response.authentication);
//     }
//   }, [response]);

//   return (
//     <TouchableOpacity onPress={() => promptAsync()}>
//       <Image
//         source={icons.facebookicon}
//         className="w-12 h-12 rounded-3xl mt-2 mx-3 "
//       />
//       <Text className="color-white text-center">facebook</Text>
//     </TouchableOpacity>
//   );
// }a
// import React, { useEffect } from "react";
// import { Image, Text, TouchableOpacity } from "react-native";
// import * as Facebook from "expo-auth-session/providers/facebook";
// import { auth } from "@/lib/firebase";
// import { FacebookAuthProvider, signInWithCredential } from "firebase/auth";
// import { icons } from "@/constants";

// const FacebookLogin = () => {
//   const [request, response, promptAsync] = Facebook.useAuthRequest({
//     clientId: "1328751585143584", // Your Facebook App ID
//     redirectUri: "https://auth.expo.io/@ahmadamous/newlightlastone",
//   });

//   useEffect(() => {
//     if (response?.type === "success") {
//       const { access_token } = response.params; // Facebook's access token
//       authenticateWithFirebase(access_token);
//     }
//   }, [response]);

//   const authenticateWithFirebase = async (token) => {
//     try {
//       const credential = FacebookAuthProvider.credential(token);
//       await signInWithCredential(auth, credential);
//       console.log("✅ User signed in with Facebook!");
//     } catch (error) {
//       console.error("❌ Firebase Auth Error:", error);
//     }
//   };

//   return (
//     <TouchableOpacity onPress={() => promptAsync()}>
//       <Image
//         source={icons.facebookicon}
//         className="w-12 h-12 rounded-3xl mt-2 mx-3"
//       />
//       <Text className="color-white text-center">Facebook</Text>
//     </TouchableOpacity>
//   );
// };

// export default FacebookLogin;
import React from "react";
import { TouchableOpacity, Image, Text } from "react-native";
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import { auth } from "@/lib/firebase"; // Import Firebase auth
import {
  FacebookAuthProvider,
  getAuth,
  signInWithCredential,
} from "firebase/auth";
import { icons } from "@/constants";
import axios from "axios";
import root from "@/lib/apihttp";
import { useRouter } from "expo-router";
const FacebookLogin = () => {
  const router = useRouter();
  const handleFacebookLogin = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // If user is signed in anonymously, delete the anonymous account
      if (user && user.isAnonymous) {
        await user.delete(); // Delete the anonymous account
        console.log("Anonymous account deleted");
      }

      // Open Facebook login
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        console.log("User cancelled the login process");
        return;
      }

      // Get the access token
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        console.error("Something went wrong obtaining the access token");
        return;
      }

      // Use the token to authenticate with Firebase
      const facebookCredential = FacebookAuthProvider.credential(
        data.accessToken
      );

      // Sign in with Firebase using the Facebook credential
      const userCredential = await signInWithCredential(
        auth,
        facebookCredential
      );
      const signedInUser = userCredential.user;

      console.log("User signed in with Facebook:", signedInUser.uid);

      // Handle the user data, such as sending it to your backend API
      await axios.post(
        `http://${root}:3000/signup`,
        {
          uid: signedInUser.uid, // Firebase UID
          avatar: signedInUser.photoURL || signedInUser.displayName.charAt(0), // Default avatar
          username:
            signedInUser.displayName || signedInUser.email.split("@")[0], // Default username
          email: signedInUser.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (signedInUser) {
        router.push("/home");
      }
    } catch (error) {
      console.error("Facebook Login Error:", error);
      Alert.alert(
        "Error",
        "Failed to sign in with Facebook. Please try again."
      );
    }
  };

  return (
    <TouchableOpacity onPress={handleFacebookLogin}>
      <Image
        source={icons.facebookicon}
        className="w-12 h-12 rounded-3xl mt-2 mx-3"
      />
      <Text className="color-white text-center">Facebook</Text>
    </TouchableOpacity>
  );
};

export default FacebookLogin;
