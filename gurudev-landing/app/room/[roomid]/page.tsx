"use client";

import React, { useRef, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { v4 as uuid } from "uuid";

interface RoomProps {
  params: { roomid: string };
}

const Room: React.FC<RoomProps> = ({ params }) => {
  const { fullName } = useUser();
  const roomID = params.roomid;
  const meetingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initializeMeeting = async () => {
      if (!meetingRef.current) return;

      const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || "0", 10);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";
      if (!appID || !serverSecret) {
        console.error("ZegoCloud App ID or Server Secret is missing!");
        return;
      }

      // Generate Kit Token
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        uuid(),
        fullName || `user_${Date.now()}`,
        720
      );

      // Create instance and start the call
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: meetingRef.current,
        sharedLinks: [
          {
            name: "Shareable link",
            url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        maxUsers: 10,
      });
    };

    initializeMeeting();
  }, [fullName, roomID]);

  return <div className="w-full h-screen" ref={meetingRef}></div>;
};

export default Room;
