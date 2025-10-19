import { Stack } from "expo-router";
import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="bg-primary">
        <Text className="text-center font-bold text-2xl">FaceCap</Text>
      </SafeAreaView>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
