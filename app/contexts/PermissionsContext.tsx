import {
    useCameraPermissions,
    useMicrophonePermissions,
} from "expo-camera";
import { createContext, ReactNode, use } from "react";
import { Alert } from "react-native";

interface PermissionsContextValue {
  requestAllPermissions: () => Promise<boolean>;
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

interface PermissionsProviderProps {
  children: ReactNode;
}

export function PermissionsProvider({ children }: PermissionsProviderProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const requestAllPermissions = async (): Promise<boolean> => {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to record videos."
        );
        return false;
      }
    }

    if (!microphonePermission?.granted) {
      const result = await requestMicrophonePermission();
      if (!result.granted) {
        Alert.alert(
          "Permission Required",
          "Microphone permission is required to record audio."
        );
        return false;
      }
    }

    return true;
  };

  return (
    <PermissionsContext value={{ requestAllPermissions }}>
      {children}
    </PermissionsContext>
  );
}

export function usePermissions() {
  const context = use(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within PermissionsProvider");
  }
  return context;
}
