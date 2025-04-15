import { Tabs } from "expo-router";

const StackLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default StackLayout;
