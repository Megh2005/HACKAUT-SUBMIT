"use client";

import CourseCard from "@/components/CourseCard";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState<any[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getMyCourses() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/my-courses`);
        setMyCourses(res.data.data);
      } catch (error) {
        toast.error("Error fetching courses");
      } finally {
        setLoading(false);
      }
    }

    getMyCourses();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {loading && (
          <LoaderCircle className="w-6 h-6 animate-spin text-secondary" />
        )}
        {!loading &&
          myCourses?.map((course) => {
            return (
              <CourseCard
                redirectLink={`/watch/${course.id}/1`}
                key={course.id}
                course={course}
              />
            );
          })}
      </div>
    </div>
  );
};

export default MyCourses;
