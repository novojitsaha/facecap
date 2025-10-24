import { useVideoPlayer, VideoView } from "expo-video";
import { X } from "lucide-react-native";
import { Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface VideoPlayerProps {
  videoUri: string | null;
  onClose: () => void;
}

export default function VideoPlayer({
  videoUri,
  onClose,
}: VideoPlayerProps) {
  const player = useVideoPlayer(videoUri, (player) => {
    player.play();
  });

  if (!videoUri) return null;

  return (
    <Modal visible={true} animationType="slide" onRequestClose={onClose}>
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
              onPress={onClose}
            >
              <X size={28} color="white" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
