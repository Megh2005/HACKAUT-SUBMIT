"use client";

import CourseCard from "@/components/CourseCard";
import Signout from "@/components/Signout";
import { Course } from "@/interfaces/Course";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

const Home = () => {
  const [courses, setCourses] = useState<(Course & { id: string })[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<
    (Course & { id: string })[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchInput, 350);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredCourses([]);
      return;
    }
    const filteredCourses = courses.filter((course) => {
      return course.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    });

    setFilteredCourses(filteredCourses);
  }, [debouncedSearch, courses]);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/courses`);

        setCourses(res.data.data);
      } catch (error) {
        toast.error("Error fetching courses");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">All courses</h1>
        <Signout />
      </div>
      <div className="max-w-xl my-4">
        <label className="input input-bordered flex items-center gap-2">
          <input
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="grow"
            placeholder="Search"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {loading && (
          <LoaderCircle className="w-6 h-6 animate-spin text-secondary" />
        )}
        {filteredCourses.length === 0 &&
          !searchInput &&
          !loading &&
          courses?.map((course) => {
            return (
              <CourseCard
                redirectLink={`/details/${course.id}`}
                course={course}
                key={course.id}
              />
            );
          })}
        {filteredCourses.length > 0 &&
          searchInput &&
          filteredCourses?.map((course) => {
            return (
              <CourseCard
                redirectLink={`/details/${course.id}`}
                course={course}
                key={course.id}
              />
            );
          })}
        {filteredCourses.length === 0 && searchInput && (
          <div>
            <p>No courses found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
