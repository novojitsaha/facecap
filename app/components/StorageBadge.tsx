import { formatFileSize } from "@/lib/utils";
import VideoType from "@/types/videoType";
import { Film, HardDrive } from "lucide-react-native";
import { Text, View } from "react-native";

interface StorageBadgeProps {
  videos: VideoType[];
}

export default function StorageBadge({ videos }: StorageBadgeProps) {
  const getTotalStorageBytes = (): number => {
    return videos.reduce((sum, video) => sum + (video.size || 0), 0);
  };

  return (
    <View className="flex flex-row items-center bg-secondary rounded-full px-3 py-2">
      <View className="flex flex-row items-center gap-1.5">
        <Film className="w-4 h-4" color="#6b7280" />
        <Text className="font-semibold text-sm text-gray-600">
          {videos.length}
        </Text>
      </View>
      <View className="w-px h-4 bg-gray-600 mx-2.5" />
      <View className="flex flex-row items-center gap-1.5">
        <HardDrive className="w-4 h-4" color="#6b7280" />
        <Text className="font-semibold text-sm text-gray-600">
          {formatFileSize(getTotalStorageBytes())}
        </Text>
      </View>
    </View>
  );
}
