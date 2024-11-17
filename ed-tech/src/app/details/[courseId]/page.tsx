"use client";

import { makePayment } from "@/actions/makePayment";
import { Course, CourseSection } from "@/interfaces/Course";
import { convertDate, convertDurationToHours } from "@/utils/convertDateTime";
import axios from "axios";
import { CalendarIcon, ClockIcon, ListIcon, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CourseDetails = () => {
  const params = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const courseId = params.courseId;

  const [courseData, setCourseData] = useState<
    (Course & { id: string; isPurchased: boolean }) | null
  >(null);

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const res = await axios.get(`/api/course?cid=${courseId}`);

        if (res.data.success) {
          setCourseData(res.data.data);
        }
      } catch (error) {
        toast.error("Error fetching course details");
      }
    };

    getCourseDetails();
  }, [courseId]);

  if (!courseData) return null;

  const calculateTotalDuration = () => {
    let totalDuration = 0;
    courseData.sections.forEach((section) => {
      totalDuration += parseFloat(section.duration);
    });

    return totalDuration;
  };

  const handlePayment = async () => {
    const paymentDetails = new FormData();

    paymentDetails.set("amount", courseData.price);
    paymentDetails.set("cid", courseData.id);
    paymentDetails.set("userId", session?.user.id as string);
    paymentDetails.set("mobileNumber", "1234567890");

    const redirect = await makePayment(paymentDetails);
    router.push(redirect.url);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-start mx-auto max-w-7xl">
        <div className="space-y-4">
          <CldImage
            src={courseData.thumbnailUrl}
            alt="Course Thumbnail"
            width={600}
            height={400}
            className="aspect-[3/2] object-cover w-full rounded-lg overflow-hidden"
          />
          {session?.user.id !== courseData.createdBy.id &&
            !courseData.isPurchased && (
              <button
                onClick={handlePayment}
                className="btn w-full btn-secondary text-secondary-content font-bold text-base"
              >
                Buy Course ₹ {courseData.price}
              </button>
            )}
        </div>

        <div className="grid gap-4 md:gap-8">
          <div>
            <h1 className="text-3xl font-bold">{courseData.title}</h1>
            <p className="text-neutral-content mt-2">
              {courseData.description}
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              <span className="text-neutral-content">
                Instructor:{" "}
                <span className="text-neutral-content font-bold">
                  {courseData.createdBy.firstName}{" "}
                  {courseData.createdBy.lastName}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ListIcon className="w-5 h-5 text-primary" />
              <span className="text-neutral-content font-bold">
                {courseData.sections.length}{" "}
                {courseData.sections.length > 1 ? "sections" : "section"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-primary" />
              <span className="text-neutral-content">
                Total Duration:{" "}
                <span className="text-neutral-content font-bold">
                  {convertDurationToHours(calculateTotalDuration())}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <span className="text-neutral-content">
                Launched:{" "}
                <span className="text-neutral-content font-bold">
                  {convertDate(courseData.created_at)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-8 lg:mt-16">
        <h1 className="text-2xl font-medium text-white mb-4">
          Course Sections
        </h1>
        <div className="flex flex-col gap-4">
          {courseData.sections.map((section: CourseSection) => {
            return (
              <div
                key={section.id}
                className="rounded-md p-4 bg-neutral text-neutral-content"
              >
                <span>{section.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
