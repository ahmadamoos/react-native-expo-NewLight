import { Tabs } from "expo-router";

const StackLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="settings" options={{ headerShown: false }} />
      <Tabs.Screen name="customerSupport" options={{ headerShown: false }} />
      <Tabs.Screen name="location" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default StackLayout;
