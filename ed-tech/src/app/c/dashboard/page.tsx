import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import CourseCard from "@/components/CourseCard";
import { Course } from "@/interfaces/Course";
import { ActionResponse } from "@/lib/actionResponse";
import { db } from "@/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Video } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

const getCoursesByCreator = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    const res: ActionResponse = {
      status: "ERROR",
      message: "User Id is required",
      data: null,
    };
    return res;
  }

  if (session?.user.role !== "creator") {
    const res: ActionResponse = {
      status: "ERROR",
      message: "You are not authorized to perform this action",
      data: null,
    };
    return res;
  }

  const coursesRef = collection(db, "courses");
  3;

  const courses = await getDocs(
    query(coursesRef, where("createdBy.id", "==", userId))
  );

  const data = courses.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });

  const response: ActionResponse = {
    status: "SUCCESS",
    message: "Courses fetched successfully",
    data,
  };

  return response;
};

const Dashboard = async () => {
  const courses = await getCoursesByCreator();

  return (
    <div className="p-4 md:p-6">
      <div>
        <h1 className="text-white text-2xl font-medium">Welcome back!</h1>
      </div>
      <div className="flex  justify-end">
        <Link href={"/c/create"}>
          <button className="btn btn-secondary">
            Create <Video />
          </button>
        </Link>
      </div>
      <div>
        <h1 className="text-white text-2xl font-medium">Your courses</h1>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {courses.data.map((course: Course & { id: string }) => {
          return (
            <CourseCard
              redirectLink={`/watch/${course.id}/1`}
              course={course}
              key={course.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
