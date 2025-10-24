import StorageBadge from "@/app/components/StorageBadge";
import VideoItem from "@/app/components/VideoItem";
import { useVideoContext } from "@/app/contexts/VideoContext";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";

interface VideoListProps {
  onPlayVideo: (uri: string) => void;
}

export default function VideoList({ onPlayVideo }: VideoListProps) {
  const { videos, loadVideos, deleteVideo } = useVideoContext();

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  return (
      <>
        <View className="flex flex-row justify-between items-center px-6 py-5">
          <Text className="font-bold text-3xl">My Video Diary</Text>
          <StorageBadge videos={videos} />
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
                onPlay={onPlayVideo}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </>
    );
  }
