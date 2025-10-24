import { formatFileSize } from "@/lib/utils";
import VideoType from "@/types/videoType";
import { HardDrive } from "lucide-react-native";
import { Text, View } from "react-native";

interface StorageBadgeProps {
  videos: VideoType[];
}

export default function StorageBadge({ videos }: StorageBadgeProps) {
  const getTotalStorageBytes = (): number => {
    return videos.reduce((sum, video) => sum + (video.size || 0), 0);
  };

  return (
    <View className="flex flex-row items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-2 rounded-full">
      <HardDrive className="w-4 h-4" />
      <Text className="font-medium">{formatFileSize(getTotalStorageBytes())}</Text>
    </View>
  );
}
