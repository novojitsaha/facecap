import { CameraType, CameraView } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

interface CameraRecorderProps {
  cameraFace: CameraType;
  duration: number;
  onVideoRecorded: (uri: string) => Promise<void>;
  onComplete: () => void;
}

type RecordingState = "initializing" | "recording" | "saving" | "idle";

export default function CameraRecorder({
  cameraFace,
  duration,
  onVideoRecorded,
  onComplete,
}: CameraRecorderProps) {
  const cameraRef = useRef<CameraView>(null);
  const cameraReadyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingStartTimeRef = useRef<number | null>(null);

  const [state, setState] = useState<RecordingState>("idle");
  const [timeRemaining, setTimeRemaining] = useState<number>(duration);

  useEffect(() => {
    return () => {
      if (cameraReadyTimeoutRef.current) {
        clearTimeout(cameraReadyTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state === "recording" && recordingStartTimeRef.current) {
      countdownIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - recordingStartTimeRef.current!) / 1000;
        const remaining = Math.max(0, duration - elapsed);
        
        if (remaining <= 0.9) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          setTimeRemaining(1);
        } else {
          setTimeRemaining(remaining);
        }
      }, 100);

      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
      };
    }
  }, [state, duration]);

  const startRecording = async () => {
    if (!cameraRef.current) return;

    setState("recording");
    recordingStartTimeRef.current = Date.now();
    setTimeRemaining(duration);

    try {
      const video = await cameraRef.current.recordAsync({
        maxDuration: duration,
      });
      
      if (video?.uri) {
        setState("saving");
        await onVideoRecorded(video.uri);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setState("idle");
      recordingStartTimeRef.current = null;
      onComplete();
    }
  };

  const handleCameraReady = () => {
    setState("initializing");
    
    cameraReadyTimeoutRef.current = setTimeout(() => {
      cameraReadyTimeoutRef.current = null;
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

      {/* Initializing State */}
      {state === "initializing" && (
        <View className="absolute inset-0 items-center justify-center">
          <View className="bg-black/50 rounded-2xl px-10 py-8 items-center justify-center">
            <Text className="text-white text-2xl font-bold">
              Get Ready...
            </Text>
          </View>
        </View>
      )}

      {/* Recording State with Countdown */}
      {state === "recording" && (
        <View className="absolute inset-0 items-center justify-center">
          <View className="bg-black/40 rounded-full w-32 h-32 items-center justify-center">
            <Text className="text-white text-4xl font-bold">
              {Math.ceil(timeRemaining)}
            </Text>
            <Text className="text-white text-sm mt-1">
              {Math.ceil(timeRemaining) === 1 ? "second" : "seconds"}
            </Text>
          </View>
        </View>
      )}

      {/* Saving State */}
      {state === "saving" && (
        <View className="absolute inset-0 items-center justify-center">
          <View className="bg-black/60 rounded-2xl px-8 py-6 items-center justify-center">
            <Text className="text-white text-2xl font-bold">Saving video...</Text>
          </View>
        </View>
      )}
    </View>
  );
}
