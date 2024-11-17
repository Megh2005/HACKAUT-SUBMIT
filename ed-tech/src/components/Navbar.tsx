import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Library, MessageCircle, Video } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-base-100 px-6 py-4 shadow-md flex justify-between gap-4 items-center">
      <div>
        <h1 className="text-2xl font-bold text-secondary">आत्मनिर्भर ++</h1>
      </div>
      <div className="flex gap-2">
        <Link href={"https://sanlap.vercel.app/login"}>
          <button className="btn btn-secondary">
            <span className="text-secondary-content font-medium">
              Chat with expert
            </span>
            <MessageCircle className="text-secondary-content w-6 h-6" />
          </button>
        </Link>
        {session?.user.role !== "creator" && (
          <Link href={"/u/my-courses"}>
            <button className="btn btn-secondary">
              <span className="text-secondary-content font-medium">
                My courses
              </span>
              <Library className="text-secondary-content w-6 h-6" />
            </button>
          </Link>
        )}

        {session?.user.role === "creator" && (
          <Link href={"/c/dashboard"}>
            <button className="btn btn-secondary">
              <span className="text-secondary-content font-medium">
                Creator
              </span>
              <Video className="text-secondary-content w-6 h-6" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
