"use client";

import WatchPageNavbar from "@/components/WatchPageNavbar";
import { Course } from "@/interfaces/Course";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const WatchPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const params = useParams();
  const courseId = params.courseId as string;

  const [courseData, setCourseData] = useState<
    (Course & { id: string }) | null
  >(null);

  useEffect(() => {
    if (!courseId) return;

    async function fetchSections() {
      try {
        const res = await axios.get(`/api/course?cid=${courseId}`);

        if (res.data.success) {
          setCourseData(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch course details");
      }
    }

    fetchSections();
  }, [courseId]);

  if (!courseData) return null;

  return (
    <div className="min-h-screen bg-base-300">
      <div className="grid grid-cols-[280px_1fr] gap-6 p-6">
        <WatchPageNavbar course={courseData} />
        {children}
      </div>
    </div>
  );
};

export default WatchPageLayout;
