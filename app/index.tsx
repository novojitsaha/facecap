import CameraRecorder from "@/app/components/CameraRecorder";
import RecordingControls from "@/app/components/RecordingControls";
import VideoList from "@/app/components/VideoList";
import VideoPlayer from "@/app/components/VideoPlayer";
import { usePermissions } from "@/app/contexts/PermissionsContext";
import { useVideoContext } from "@/app/contexts/VideoContext";
import { CameraType } from "expo-camera";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { saveVideo } = useVideoContext();
  const { requestAllPermissions } = usePermissions();

  const [showCamera, setShowCamera] = useState(false);
  const [duration, setDuration] = useState(3);
  const [cameraFace, setCameraFace] = useState<CameraType>("front");
  const [playingVideoUri, setPlayingVideoUri] = useState<string | null>(null);

  const handleStartRecording = async () => {
    const hasPermissions = await requestAllPermissions();
    if (hasPermissions) {
      setShowCamera(true);
    }
  };

  const handleVideoRecorded = async (uri: string) => {
    await saveVideo(uri);
  };

  const handleRecordingComplete = () => {
    setShowCamera(false);
  };

  if (showCamera) {
    return (
      <CameraRecorder
        cameraFace={cameraFace}
        duration={duration}
        onVideoRecorded={handleVideoRecorded}
        onComplete={handleRecordingComplete}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <VideoPlayer
        videoUri={playingVideoUri}
        onClose={() => setPlayingVideoUri(null)}
      />

      <View className="flex-1 px-2">
        <VideoList onPlayVideo={setPlayingVideoUri} />

        <RecordingControls
          duration={duration}
          cameraFace={cameraFace}
          onDurationChange={setDuration}
          onCameraFaceChange={setCameraFace}
          onStartRecording={handleStartRecording}
        />
      </View>
    </SafeAreaView>
  );
}
