"use client";

import VideoPlayer from "@/components/VideoPlayer";
import { CourseSection } from "@/interfaces/Course";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const WatchPage = () => {
  const params = useParams();
  const sectionId = params.sectionId;
  const courseId = params.courseId;

  const [sectionData, setSectionData] = useState<CourseSection | null>(null);

  useEffect(() => {
    if (!sectionId || !courseId) return;

    async function getSectionData() {
      try {
        const res = await axios.get(
          `/api/section?cid=${courseId}&sid=${sectionId}`
        );
        setSectionData(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch section details");
      }
    }

    getSectionData();
  }, [sectionId, courseId]);

  if (!sectionData) return null;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral p-4 shadow-sm">
      <div className="aspect-video overflow-hidden rounded-lg">
        <VideoPlayer videoUrl={sectionData?.videoUrl} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{sectionData.title}</h2>
      </div>
    </div>
  );
};

export default WatchPage;
