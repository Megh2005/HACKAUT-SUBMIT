"use client";

import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <CldVideoPlayer
      width="1920"
      height="1080"
      src={`ed-tech/sections/${videoUrl.split("/").pop()}`}
    />
  );
};

export default VideoPlayer;
