import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { VideoProvider } from "@/contexts/VideoContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <PermissionsProvider>
          <VideoProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </VideoProvider>
        </PermissionsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
