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
];

const VideoItem = ({ id, timestamp }: VideoType) => (
  <View className="flex-row items-center border border-gray-400 rounded-xl h-24 px-4 mb-3 mx-3 bg-white">
    <TouchableOpacity>
      <Text>▶</Text>
    </TouchableOpacity>
    <Text className="flex-1 text-center">{timestamp}</Text>
    <TouchableOpacity>
      <Text>☰</Text>
    </TouchableOpacity>
  </View>
);

export default function Index() {
  return (
    <SafeAreaView className="bg-slate-300 h-full">
      <Text className="text-center mb-4">Total Storage: 12 MB</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <VideoItem id={item.id} timestamp={item.timestamp} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}
