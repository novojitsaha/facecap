import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { CameraType } from "expo-camera";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RecordingControlsProps {
  duration: number;
  cameraFace: CameraType;
  onDurationChange: (value: number) => void;
  onCameraFaceChange: (face: CameraType) => void;
  onStartRecording: () => void;
}

export default function RecordingControls({
  duration,
  cameraFace,
  onDurationChange,
  onCameraFaceChange,
  onStartRecording,
}: RecordingControlsProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["17%", "40%"]}
      index={0}
      enablePanDownToClose={false}
      backgroundStyle={{ backgroundColor: "#ffffff" }}
      handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 40 }}
    >
      <BottomSheetView className="flex-1 px-6 pt-2 pb-8">
        {/* Start Record Button */}
        <TouchableOpacity
          className="bg-gray-100 rounded-2xl h-16 mb-3 justify-center items-center flex-row gap-3"
          onPress={onStartRecording}
          activeOpacity={0.8}
        >
          <Text className="font-bold text-xl text-gray-900">
            Start Recording
          </Text>
          <View className="w-8 h-8 rounded-full border-2 border-red-500 justify-center items-center">
            <View className="w-4 h-4 rounded-full bg-red-500" />
          </View>
        </TouchableOpacity>

        {/* Pull up hint */}
        <View className="items-center mb-10">
          <View className="flex-row items-center gap-2">
            <Text className="text-gray-400 text-sm font-medium">
              Swipe up for more options
            </Text>
            <Ionicons name="chevron-up" size={18} color="#9ca3af" />
          </View>
        </View>

        {/* Settings Section */}
        <View className="gap-6">
          {/* Duration Selector */}
          <View className="gap-3">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-gray-700 font-semibold text-base">
                Duration
              </Text>
              <View className="bg-gray-100 px-3 py-1.5 rounded-full">
                <Text className="font-bold text-gray-800">
                  {duration.toFixed(1)}s
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              {[3, 3.5, 4, 4.5, 5].map((value) => (
                <View key={value} className="flex-1">
                  <TouchableOpacity
                    className={`py-3.5 rounded-xl ${
                      duration === value
                        ? "bg-gray-900"
                        : "bg-gray-100 border border-gray-200"
                    }`}
                    onPress={() => onDurationChange(value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`font-semibold text-sm text-center ${
                        duration === value ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {value}s
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Camera Face Toggle */}
          <View className="gap-3">
            <Text className="text-gray-700 font-semibold text-base">
              Camera
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className={`flex-1 py-4 rounded-xl flex-row items-center justify-center gap-2 ${
                  cameraFace === "front"
                    ? "bg-gray-900"
                    : "bg-gray-100 border border-gray-200"
                }`}
                onPress={() => onCameraFaceChange("front")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="camera-reverse"
                  size={20}
                  color={cameraFace === "front" ? "#ffffff" : "#4b5563"}
                />
                <Text
                  className={`font-semibold text-base ${
                    cameraFace === "front" ? "text-white" : "text-gray-600"
                  }`}
                >
                  Front
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-4 rounded-xl flex-row items-center justify-center gap-2 ${
                  cameraFace === "back"
                    ? "bg-gray-900"
                    : "bg-gray-100 border border-gray-200"
                }`}
                onPress={() => onCameraFaceChange("back")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="camera"
                  size={20}
                  color={cameraFace === "back" ? "#ffffff" : "#4b5563"}
                />
                <Text
                  className={`font-semibold text-base ${
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
  );
}
