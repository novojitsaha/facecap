export default interface VideoType {
  id: number;
  timestamp: string;
  uri: string;
  thumbnailUri?: string;
  size: number; // Size in bytes
}