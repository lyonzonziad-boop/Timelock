import type { MediaView } from "@/types";

export function MediaItem({ media }: { media: MediaView }) {
  if (media.kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="cp-media-img" src={media.url} alt={media.name} loading="lazy" />;
  }
  if (media.kind === "video") {
    return <video className="cp-media-img" src={media.url} controls preload="metadata" />;
  }
  return <audio className="cp-media-audio" src={media.url} controls preload="metadata" />;
}
