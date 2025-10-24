import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
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
      snapPoints={["35%"]}
      index={0}
      enablePanDownToClose={false}
    >
      <BottomSheetView className="h-36 items-center">
        <Text>Pull up for settings ↑</Text>

        {/* Start Record Button */}
        <TouchableOpacity
          className="bg-secondary rounded-xl w-80 h-16 mt-4 justify-center items-center flex-row gap-3"
          onPress={onStartRecording}
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
                onValueChange={onDurationChange}
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
                onPress={() => onCameraFaceChange("front")}
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
                onPress={() => onCameraFaceChange("back")}
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
  );
}
