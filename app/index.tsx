import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoType from "./types/videoType";

const data: VideoType[] = [
  {
    id: 1,
    timestamp: "18-10-2025",
  },
  {
    id: 2,
    timestamp: "19-10-2025",
  },
  {
    id: 3,
    timestamp: "20-10-2025",
  },
  {
    id: 4,
    timestamp: "20-10-2025",
  },
  {
    id: 5,
    timestamp: "20-10-2025",
  },
  {
    id: 6,
    timestamp: "20-10-2025",
  },
  {
    id: 7,
    timestamp: "20-10-2025",
  },
  {
    id: 8,
    timestamp: "20-10-2026",
  },
  {
    id: 9,
    timestamp: "20-10-2027",
  },
];

const VideoItem = ({ id, timestamp }: VideoType) => (
  <View className="flex-row items-center rounded-xl h-24 px-4 mb-3 mx-3 bg-secondary">
    <TouchableOpacity>
      <Text className="text-xl">▶</Text>
    </TouchableOpacity>
    <Text className="flex-1 text-center text-xl">{timestamp}</Text>
    <TouchableOpacity>
      <Text className="text-2xl">☰</Text>
    </TouchableOpacity>
  </View>
);

export default function Index() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <SafeAreaView className="h-full">
      <Text className="text-center mb-4 text-xl">Total Storage: 12 MB</Text>
      <View className="pb-48">
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <VideoItem id={item.id} timestamp={item.timestamp} />
          )}
          keyExtractor={(item) => item.id.toString()}

        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["50%"]}
        index={0}
        enablePanDownToClose={false}
      >
        <BottomSheetView className="h-36 items-center">
          <Text>Pull up for settings ↑</Text>
          <TouchableOpacity className="bg-secondary rounded-xl w-80 h-16 mt-4 justify-center items-center flex-row gap-3">
            <Text className="font-bold">Start Recording</Text>
            <View
              className="w-8 h-8 rounded-full border-2 justify-center items-center"
              style={{ borderColor: "#ef4444" }}
            >
              <View className="w-4 h-4 rounded-full bg-red-500" />
            </View>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}
