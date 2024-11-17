"use client";

import { CalendarIcon, ClockIcon, ListIcon, UserIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { Course } from "@/interfaces/Course";
import { convertDate, convertDurationToHours } from "@/utils/convertDateTime";
import Link from "next/link";

const CourseCard = ({
  course,
  redirectLink,
}: {
  course: Course & { id: string };
  redirectLink: string;
}) => {
  const calculateTotalDuration = () => {
    let totalDuration = 0;
    course.sections.forEach((section) => {
      totalDuration += parseFloat(section.duration);
    });

    return totalDuration;
  };

  return (
    <Link href={redirectLink}>
      <div className="card bg-gradient-to-b from-neutral to-secondary shadow-xl overflow-hidden">
        <div>
          <CldImage
            src={course.thumbnailUrl}
            alt="Course Thumbnail"
            width="400"
            height="200"
            className="w-full h-48 object-cover"
            style={{ aspectRatio: "400/200", objectFit: "cover" }}
          />
        </div>
        <div className="p-6 space-y-4">
          <div className="w-max bg-base-100 text-white px-3 py-1 rounded-md text-sm font-medium">
            ₹ {course.price}
          </div>
          <h2 className="text-xl font-bold text-white line-clamp-1">
            {course.title}
          </h2>
          <p className="text-white/85 line-clamp-1">{course.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4 text-secondary-content" />
            <span className="text-secondary-content">
              Launched: {convertDate(course.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon className="w-4 h-4 text-secondary-content" />
            <span className="text-secondary-content">
              Instructor: {course.createdBy.firstName}{" "}
              {course.createdBy.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ListIcon className="w-4 h-4 text-secondary-content" />
            <span className="text-secondary-content">
              {course.sections.length}{" "}
              {course.sections.length > 1 ? "sections" : "section"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="w-4 h-4 text-secondary-content" />
            <span className="text-secondary-content">
              Total Duration: {convertDurationToHours(calculateTotalDuration())}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
