import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from "react-native";
// import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "@/components/NewLightFolder/FormField";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CostomeButton from "@/components/NewLightFolder/CostomeButton";
import { Link, router, useRouter } from "expo-router";
import { auth, createUser, handleAnonymousSignup } from "../../lib/firebase"; // Import all sign-up functions
import { useGlobalContext } from "../../context/GlobalProvider"; // Import global context
import icons from "../../constants/icons";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import FacebookLogin from "@/components/NewLightFolder/facebookSignUp";
import axios from "axios";
import root from "@/lib/apihttp";

// Configure Google SignIn

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use global context
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const handleGoogleSignup = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // If user is signed in anonymously, delete anonymous account
      if (user && user.isAnonymous) {
        await user.delete(); // Delete the anonymous account
        console.log("Anonymous account deleted");
      }

      // Ensure that Google Play services are available
      await GoogleSignin.hasPlayServices();
      console.log("Google Play services are available");

      // Perform the Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      console.log("Google sign-in successful");

      // Access the ID token from userInfo
      const idToken = userInfo.idToken;

      // Get the Firebase Auth credential using the ID token
      const credential = GoogleAuthProvider.credential(idToken);
      console.log("Credential created");

      // Sign in with Firebase using the credential
      const userCredential = await signInWithCredential(auth, credential);
      const signedInUser = userCredential.user;

      console.log("User signed in:", signedInUser.uid);

      // Send user data to your backend API
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
        router.replace("/home");
      }
    } catch (error) {
      console.error("Google sign-in error:", error.message);
      Alert.alert("Error", "Failed to sign in with Google. Please try again.");
    }
  };

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      // Set it to global state
      setUser(result);
      setIsLoggedIn(true);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error from signup page", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="h-full">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 h-full">
            <ImageBackground
              source={images.bac}
              resizeMode="cover"
              className="flex-1 justify-center"
            >
              <View className="w-full min-h-[83vh] justify-center items-center px-4 my-6">
                <Image
                  source={images.logolight}
                  className="w-[160px] h-[120px] top-4"
                  resizeMode="contain"
                />
                <FormField
                  title="UserName"
                  value={form.username}
                  handleChangeText={(e) => setForm({ ...form, username: e })}
                  otherStyles="mt-7"
                />
                <FormField
                  title="Email"
                  value={form.email}
                  handleChangeText={(e) => setForm({ ...form, email: e })}
                  otherStyles="mt-7"
                  keyboardType="email-address"
                />
                <FormField
                  title="Password"
                  value={form.password}
                  handleChangeText={(e) => setForm({ ...form, password: e })}
                  otherStyles="mt-7"
                />
                <CostomeButton
                  title="Sign up"
                  handlePress={submit}
                  containerStyles="mt-7 py-6 w-80 bg-[#dd6f6f]"
                  isLoading={isSubmitting}
                />
                <View className="flex flex-row">
                  <FacebookLogin />
                  <TouchableOpacity onPress={handleGoogleSignup}>
                    <Image
                      source={icons.googleicon}
                      className="w-12 h-12 rounded-3xl mt-2 mx-3"
                    />
                    <Text className="color-white text-center">google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleAnonymousSignup}>
                    <Image
                      source={icons.anonymousicon}
                      className="w-12 h-12 rounded-3xl mt-2 mx-3"
                    />
                    <Text className="color-white text-center">anonymous</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-1 items-center">
                  <Text className="text-white text-2xl justify-center font-semibold mt-10 text-center">
                    Welcome to New Light
                  </Text>
                  <Text className="text-white text-1xl justify-center font-semibold mt-10 text-center">
                    You have an account?
                    <Link href="/(auth)/sign-in" className="text-[#dd6f6f]">
                      {" "}
                      Sign In
                    </Link>
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SignUp;
