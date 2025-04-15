import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "@/components/NewLightFolder/FormField";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CostomeButton from "@/components/NewLightFolder/CostomeButton";
import { Link, useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { signIn, handleAnonymousSignup } from "../../lib/firebase";
import icons from "../../constants/icons";
import axios from "axios";
import root from "@/lib/apihttp";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import FacebookLogin from "@/components/NewLightFolder/facebookSignUp";
const SignIn = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser, setIsLoggedIn, isLoggedIn, isLoading, user } =
    useGlobalContext();

  useEffect(() => {
    if (isLoggedIn) {
      console.log("User is logged in.", user);
      router.replace("/home");
    } else {
      console.log("User is not logged in.", user);
    }
  }, [isLoggedIn, router]);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);
      setIsLoggedIn(true);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

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
                  title="Sign In"
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
                    Log in to New Light
                  </Text>
                  <Text className="text-white text-1xl justify-center font-semibold mt-10 text-center">
                    Don't have an account?
                    <Link href="/(auth)/sign-up" className="text-[#dd6f6f]">
                      Sign Up
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

export default SignIn;
