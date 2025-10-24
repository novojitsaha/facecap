import VideoType from "@/types/videoType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, File, Paths } from "expo-file-system";
import * as VideoThumbnails from "expo-video-thumbnails";
import { createContext, ReactNode, use, useState } from "react";

interface VideoContextValue {
  videos: VideoType[];
  loadVideos: () => Promise<void>;
  saveVideo: (uri: string) => Promise<void>;
  deleteVideo: (id: number) => Promise<void>;
}

const VideoContext = createContext<VideoContextValue | null>(null);

interface VideoProviderProps {
  children: ReactNode;
}

export function VideoProvider({ children }: VideoProviderProps) {
  const [videos, setVideos] = useState<VideoType[]>([]);

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
      const sourceFile = new File(uri);
      const destDir = new Directory(Paths.document, "videos");

      if (!destDir.exists) {
        destDir.create({ intermediates: true });
      }

      sourceFile.move(destDir);
      const newUri = sourceFile.uri;
      const fileSize = sourceFile.size;

      let thumbnailUri: string | undefined;
      try {
        const { uri: thumbnail } = await VideoThumbnails.getThumbnailAsync(
          newUri,
          { time: 0, quality: 0.8 }
        );
        thumbnailUri = thumbnail;
      } catch (thumbErr) {
        console.error("Failed to generate thumbnail:", thumbErr);
      }

      const newVideo: VideoType = {
        id: Date.now(),
        uri: newUri,
        timestamp: new Date().toISOString(),
        thumbnailUri,
        size: fileSize,
      };

      const updatedVideos = [newVideo, ...videos];
      setVideos(updatedVideos);
      await AsyncStorage.setItem("videos", JSON.stringify(updatedVideos));
    } catch (err) {
      console.error("Failed to save video:", err);
    }
  };

  const deleteVideo = async (id: number) => {
    try {
      const videoToDelete = videos.find((v) => v.id === id);
      if (!videoToDelete) return;

      try {
        const videoFile = new File(videoToDelete.uri);
        if (videoFile.exists) videoFile.delete();
      } catch (fileErr) {
        console.error("Failed to delete video file:", fileErr);
      }

      if (videoToDelete.thumbnailUri) {
        try {
          const thumbnailFile = new File(videoToDelete.thumbnailUri);
          if (thumbnailFile.exists) thumbnailFile.delete();
        } catch (thumbErr) {
          console.error("Failed to delete thumbnail file:", thumbErr);
        }
      }

      const updatedVideos = videos.filter((v) => v.id !== id);
      setVideos(updatedVideos);
      await AsyncStorage.setItem("videos", JSON.stringify(updatedVideos));
    } catch (err) {
      console.error("Failed to delete video:", err);
    }
  };

  return (
    <VideoContext value={{ videos, loadVideos, saveVideo, deleteVideo }}>
      {children}
    </VideoContext>
  );
}

export function useVideoContext() {
  const context = use(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within VideoProvider");
  }
  return context;
}
