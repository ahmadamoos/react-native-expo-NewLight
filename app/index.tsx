import { StatusBar, ActivityIndicator } from "react-native";
import { Text, View, ScrollView, Image } from "react-native";
import { Link, Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import CostomeButton from "@/components/NewLightFolder/CostomeButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { handleAnonymousSignup } from "@/lib/firebase";

export default function Index() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "652501147916-pikagd6nd4dkg1ot3d25b50jekeb0fch.apps.googleusercontent.com", // Use your own client ID
      offlineAccess: true, // Optional if you need refresh token
    });
  }, []);
  const { isLoading, isLoggedIn } = useGlobalContext();
  const router = useRouter();

  // Redirect to home if user is logged in and not loading
  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  // Display a loading spinner while checking the login state
  if (isLoading) {
    return (
      <SafeAreaView className="h-full bg-[#021b36] flex items-center justify-center">
        <ActivityIndicator size="large" color="#dd6f6f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-[#021b36]">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full h-full justify-center items-center px-4">
          <View>
            <Image
              source={images.logolight}
              className="w-[300px] h-[200px]"
              resizeMode="contain"
            />
          </View>
          <View className="items-center py-4">
            <Text className="text-2xl text-white">Welcome</Text>
            <Text className="text-4xl text-white">New Light</Text>
            <Text className="text-white">is the right choice</Text>
          </View>
          <CostomeButton
            title="Get Started"
            handlePress={handleAnonymousSignup}
            containerStyles={"w-full mt-4 "}
          />
        </View>
      </ScrollView>
      <StatusBar barStyle={"light-content"} />
    </SafeAreaView>
  );
}
