import VideoType from "@/app/types/videoType";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { Directory, File, Paths } from "expo-file-system";
import { useVideoPlayer, VideoView } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import { HardDrive, Play, Trash2, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${month} ${day}, ${year} · ${hours}:${minutes} ${ampm}`;
};

const VideoItem = ({
  id,
  timestamp,
  uri,
  thumbnailUri,
  size,
  onDelete,
  onPlay,
}: VideoType & {
  onDelete: (id: number) => void;
  onPlay: (uri: string) => void;
}) => (
  <View className="flex-row items-center rounded-xl h-24 px-4 mb-3 mx-3 bg-secondary">
    <TouchableOpacity onPress={() => onPlay(uri)}>
      {thumbnailUri ? (
        <View className="relative">
          <Image
            source={{ uri: thumbnailUri }}
            className="w-16 h-16 rounded-lg"
            resizeMode="cover"
          />
          <View className="absolute inset-0 items-center justify-center">
            <View className="bg-black/50 rounded-full p-2">
              <Play size={20} color="white" fill="white" />
            </View>
          </View>
        </View>
      ) : (
        <View className="w-16 h-16 rounded-lg bg-gray-300 items-center justify-center">
          <Play size={24} color="#666" />
        </View>
      )}
    </TouchableOpacity>
    <TouchableOpacity className="flex-1 px-4" onPress={() => onPlay(uri)}>
      <Text className="text-lg font-semibold">
        {formatTimestamp(timestamp)}
      </Text>
      <Text className="text-sm text-gray-500">{formatFileSize(size)}</Text>
    </TouchableOpacity>
    <Pressable onPress={() => onDelete(id)}>
      {({ pressed }) => (
        <Trash2 color={pressed ? "#ef4444" : "#6b7280"} />
      )}
    </Pressable>
  </View>
);

export default function Index() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [recording, setRecording] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [duration, setDuration] = useState<number>(3); // adjustable length in seconds
  const [cameraFace, setCameraFace] = useState<CameraType>("front");
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [playingVideoUri, setPlayingVideoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const player = useVideoPlayer(playingVideoUri, (player) => {
    player.play();
  });

  useEffect(() => {
    loadVideos();
  }, []);

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

  // Reset timer when recording stops
  useEffect(() => {
    if (!recording) {
      setTimeRemaining(duration);
    }
  }, [recording, duration]);

  const loadVideos = async () => {
    try {
      const saved = await AsyncStorage.getItem("videos");
      if (saved) {
        setVideos(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load videos:", err);
    }
  };

  const saveVideo = async (uri: string) => {
    try {
      // Create File instance for source
      const sourceFile = new File(uri);
      // Destination directory under documentDirectory
      const destDir = new Directory(Paths.document, "videos");

      // Create the directory if it doesn't exist
      if (!destDir.exists) {
        destDir.create({ intermediates: true });
      }

      // Move the file into the dest directory
      sourceFile.move(destDir);

      const newUri = sourceFile.uri;
      console.log("Moved file to:", newUri);

      // Get file size
      const fileSize = sourceFile.size;
      console.log("File size:", fileSize, "bytes");

      // Generate thumbnail
      let thumbnailUri: string | undefined;
      try {
        const { uri: thumbnail } = await VideoThumbnails.getThumbnailAsync(
          newUri,
          {
            time: 0, // Get thumbnail from the first frame
            quality: 0.8,
          }
        );
        thumbnailUri = thumbnail;
        console.log("Thumbnail generated:", thumbnailUri);
      } catch (thumbErr) {
        console.error("Failed to generate thumbnail:", thumbErr);
      }

      // Create video entry with metadata
      const newVideo: VideoType = {
        id: Date.now(),
        uri: newUri,
        timestamp: new Date().toISOString(),
        thumbnailUri,
        size: fileSize,
      };

      // Add to videos list
      const updatedVideos = [newVideo, ...videos];
      setVideos(updatedVideos);

      // Save to AsyncStorage
      await AsyncStorage.setItem("videos", JSON.stringify(updatedVideos));
      console.log("Video saved successfully:", newVideo);
    } catch (err) {
      console.error("Failed to save video (new FS API):", err);
    }
  };

  const deleteVideo = async (id: number) => {
    try {
      // Find the video to delete
      const videoToDelete = videos.find((v) => v.id === id);
      if (!videoToDelete) {
        console.warn("Video not found:", id);
        return;
      }

      // Delete the video file
      try {
        const videoFile = new File(videoToDelete.uri);
        if (videoFile.exists) {
          videoFile.delete();
          console.log("Deleted video file:", videoToDelete.uri);
        }
      } catch (fileErr) {
        console.error("Failed to delete video file:", fileErr);
      }

      // Delete the thumbnail file if it exists
      if (videoToDelete.thumbnailUri) {
        try {
          const thumbnailFile = new File(videoToDelete.thumbnailUri);
          if (thumbnailFile.exists) {
            thumbnailFile.delete();
            console.log("Deleted thumbnail file:", videoToDelete.thumbnailUri);
          }
        } catch (thumbErr) {
          console.error("Failed to delete thumbnail file:", thumbErr);
        }
      }

      // Remove from videos list
      const updatedVideos = videos.filter((v) => v.id !== id);
      setVideos(updatedVideos);

      // Update AsyncStorage
      await AsyncStorage.setItem("videos", JSON.stringify(updatedVideos));
      console.log("Video deleted successfully:", id);
    } catch (err) {
      console.error("Failed to delete video:", err);
    }
  };

  const playVideo = (uri: string) => {
    setPlayingVideoUri(uri);
  };

  const closeVideoPlayer = () => {
    setPlayingVideoUri(null);
  };

  const handleStartRecording = async () => {
    // Check camera permission
    if (!permission || !permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        alert("Camera permission is required to record videos.");
        return;
      }
    }

    // Check microphone permission
    if (!microphonePermission || !microphonePermission.granted) {
      const result = await requestMicrophonePermission();
      if (!result.granted) {
        alert("Microphone permission is required to record audio.");
        return;
      }
    }

    // Render camera and start recording
    setShowCamera(true);
  };

  const startRecording = async () => {
    if (!cameraRef.current) {
      console.warn("Camera not initialized yet.");
      return;
    }
    setRecording(true);
    setTimeRemaining(duration);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    try {
      const video = await cameraRef.current?.recordAsync({
        maxDuration: duration,
      });
      console.log("Video recorded:", video?.uri);
      if (video?.uri) {
        setSaving(true);
        await saveVideo(video.uri);
      }
    } catch (e) {
      console.error("Recording failed:", e);
    } finally {
      clearInterval(timer);
      setRecording(false);
      setSaving(false);
      setShowCamera(false);
    }
  };

  const renderCamera = () => (
    <View className="flex-1">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        mode="video"
        facing={cameraFace}
        onCameraReady={() => {
          console.log("Camera is ready...");
          setTimeout(() => {
            console.log("Starting recording now...");
            startRecording();
          }, 500);
        }}
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

      {/* <Pressable
        onPress={() => {handleCancelRecording()}}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-red-500 w-20 h-20 rounded-full items-center justify-center"
      >
        <Text className="text-white text-2xl">■</Text>
      </Pressable> */}
    </View>
  );

  if (showCamera) {
    return renderCamera();
  }

  const getTotalStorage = (): string => {
    const totalBytes = videos.reduce(
      (sum, video) => sum + (video.size || 0),
      0
    );
    return formatFileSize(totalBytes);
  };

  const RenderVideoPlayer = () => {
    if (!playingVideoUri) return null;

    return (
      <Modal
        visible={true}
        animationType="slide"
        onRequestClose={closeVideoPlayer}
      >
        <View className="flex-1 bg-black">
          <SafeAreaView className="flex-1">
            <View className="flex-1">
              <VideoView
                player={player}
                style={{ flex: 1 }}
                nativeControls
                contentFit="contain"
              />
              <TouchableOpacity
                className="absolute top-10 right-6 bg-black/70 rounded-full p-3 items-center justify-center"
                onPress={closeVideoPlayer}
              >
                <X size={28} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <RenderVideoPlayer />
      <View className="flex-1 px-2">
        <View className="flex flex-row justify-between items-center px-6 py-5 ">
          <Text className="font-bold text-3xl">My Video Diary</Text>

          <View className="flex flex-row items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-2 rounded-full">
            <HardDrive className="w-4 h-4" />
            <Text className="font-medium">{getTotalStorage()}</Text>
          </View>
        </View>
        <View className="px-6 mb-4">
          <Text className="text-l text-right">
            Total {videos.length} {videos.length === 1 ? "video" : "videos"}
          </Text>
        </View>
        <View className="pb-80">
          <FlatList
            data={videos}
            renderItem={({ item }) => (
              <VideoItem
                id={item.id}
                timestamp={item.timestamp}
                uri={item.uri}
                thumbnailUri={item.thumbnailUri}
                size={item.size}
                onDelete={deleteVideo}
                onPlay={playVideo}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["35%"]}
          index={0}
          enablePanDownToClose={false}
        >
          <BottomSheetView className="h-36 items-center">
            <Text>Pull up for settings ↑</Text>

            {/* Start Record Button */}
            <TouchableOpacity
              className="bg-secondary rounded-xl w-80 h-16 mt-4 justify-center items-center flex-row gap-3"
              onPress={handleStartRecording}
            >
              <Text className="font-bold text-xl">Start Recording</Text>
              <View
                className="w-8 h-8 rounded-full border-2 justify-center items-center"
                style={{ borderColor: "#ef4444" }}
              >
                <View className="w-4 h-4 rounded-full bg-red-500" />
              </View>
            </TouchableOpacity>

            {/* Bottom Sheet Options */}

            <View className="w-80 mt-5 gap-4 ">
              {/* Duration Slider */}
              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="">Duration</Text>
                  <Text className="font-semibold text-gray-600">
                    {duration.toFixed(1)}s
                  </Text>
                </View>
                <View className="">
                  <Slider
                    minimumValue={3}
                    maximumValue={5}
                    step={0.5}
                    value={duration}
                    onValueChange={setDuration}
                    minimumTrackTintColor="#6b7280"
                    maximumTrackTintColor="#d1d5db"
                    thumbTintColor="#4b5563"
                    style={{ height: 50 }}
                  />
                </View>
              </View>

              {/* Camera Face Toggle */}
              <View className="flex-row justify-between items-center">
                <Text className="">Camera</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className={`px-6 py-3 rounded-lg ${
                      cameraFace === "front" ? "bg-gray-600" : "bg-secondary"
                    }`}
                    onPress={() => setCameraFace("front")}
                  >
                    <Text
                      className={`font-medium text-base ${
                        cameraFace === "front" ? "text-white" : "text-gray-600"
                      }`}
                    >
                      Front
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`px-6 py-3 rounded-lg ${
                      cameraFace === "back" ? "bg-gray-600" : "bg-secondary"
                    }`}
                    onPress={() => setCameraFace("back")}
                  >
                    <Text
                      className={`font-medium text-base ${
                        cameraFace === "back" ? "text-white" : "text-gray-600"
                      }`}
                    >
                      Back
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}
