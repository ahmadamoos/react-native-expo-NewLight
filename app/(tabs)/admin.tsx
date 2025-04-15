import { StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import CostomeButton from "@/components/NewLightFolder/CostomeButton";

const Admin = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b ">
      <LinearGradient colors={["#021b36", "#0a2a4d"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className="w-full px-6 items-center">
            <Image
              source={images.logolight}
              className="w-72 h-48 mb-6"
              resizeMode="contain"
            />
            <View className="items-center py-4">
              <Text className="text-3xl font-bold text-white mb-2">
                Welcome
              </Text>
              <Text className="text-4xl font-extrabold text-white">
                New Light
              </Text>
              <Text className="text-base text-gray-300 mt-1">
                Your best choice for lighting solutions
              </Text>
            </View>
            <CostomeButton
              title="Go to Add Products page"
              handlePress={() => router.push("/(creat)/AddProdacts")}
              containerStyles="bg-[#FF6B6B] w-full py-3 rounded-lg mt-8 shadow-lg"
              textStyles="text-white text-lg font-semibold"
              accessibilityLabel="Go to Add Products page"
              accessibilityHint="Navigates to the Add Products page"
            />
          </View>
        </ScrollView>
        <StatusBar barStyle="light-content" />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Admin;
