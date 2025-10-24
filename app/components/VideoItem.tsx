import { formatFileSize, formatTimestamp } from "@/lib/utils";
import VideoType from "@/types/videoType";
import { Play, Trash2 } from "lucide-react-native";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

interface VideoItemProps extends VideoType {
  onDelete: (id: number) => void;
  onPlay: (uri: string) => void;
}

export default function VideoItem({
  id,
  timestamp,
  uri,
  thumbnailUri,
  size,
  onDelete,
  onPlay,
}: VideoItemProps) {
  return (
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
}
