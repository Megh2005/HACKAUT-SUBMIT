import { Course } from "@/interfaces/Course";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const WatchPageNavbar = ({ course }: { course: Course & { id: string } }) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral p-4 shadow-xl">
      <h2 className="text-xl font-semibold">Course Sections</h2>
      <nav className="flex flex-col">
        {course.sections.map((section) => (
          <Link
            key={section.id}
            href={`/watch/${course.id}/${section.id}`}
            className="flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors hover:bg-base-100 border-y border-gray-500"
            prefetch={false}
          >
            <span>{section.title}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default WatchPageNavbar;
