import { Tabs } from "expo-router";

const StackLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: "none" }, // Hides the tab bar
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="[id]" options={{ headerShown: false }} />

      <Tabs.Screen name="homeScreen" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default StackLayout;
