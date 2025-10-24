import { CameraType, CameraView } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

interface CameraRecorderProps {
  cameraFace: CameraType;
  duration: number;
  onVideoRecorded: (uri: string) => Promise<void>;
  onComplete: () => void;
}

export default function CameraRecorder({
  cameraFace,
  duration,
  onVideoRecorded,
  onComplete,
}: CameraRecorderProps) {
  const cameraRef = useRef<CameraView>(null);
  const [recording, setRecording] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(duration);

  // Countdown timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (recording && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0.1) {
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [recording, timeRemaining]);

  const startRecording = async () => {
    if (!cameraRef.current) {
      console.warn("Camera not initialized yet.");
      return;
    }
    setRecording(true);
    setTimeRemaining(duration);

    try {
      const video = await cameraRef.current.recordAsync({
        maxDuration: duration,
      });
      console.log("Video recorded:", video?.uri);
      if (video?.uri) {
        setSaving(true);
        await onVideoRecorded(video.uri);
      }
    } catch (e) {
      console.error("Recording failed:", e);
    } finally {
      setRecording(false);
      setSaving(false);
      onComplete();
    }
  };

  const handleCameraReady = () => {
    console.log("Camera is ready...");
    setTimeout(() => {
      console.log("Starting recording now...");
      startRecording();
    }, 500);
  };

  return (
    <View className="flex-1">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        mode="video"
        facing={cameraFace}
        onCameraReady={handleCameraReady}
      />

      {recording && (
        <View className="absolute inset-0 items-center justify-center">
          <View className="bg-black/40 rounded-full w-32 h-32 items-center justify-center">
            <Text className="text-white text-3xl font-bold">
              {timeRemaining.toFixed(0)}
            </Text>
            <Text className="text-white text-sm mt-1">seconds</Text>
          </View>
        </View>
      )}

      {saving && (
        <View className="absolute inset-0 items-center justify-center">
          <View className="bg-black/60 rounded-2xl px-8 py-6 items-center justify-center">
            <Text className="text-white text-2xl font-bold">Saving video</Text>
          </View>
        </View>
      )}
    </View>
  );
}
