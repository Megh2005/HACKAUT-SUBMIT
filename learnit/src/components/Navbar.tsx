import { MessageCircle, Notebook } from "lucide-react";
import ThemeSwitcher from "../components/ThemeSwitcher";
import Link from "next/link";
import Logout from "./Logout";
import { useAppSelector } from "@/lib/store/hooks";
import { CldImage } from "next-cloudinary";

const Navbar = () => {
  const { profilePhoto, displayName } = useAppSelector((state) => state.user);

  return (
    <aside className="fixed inset-y-0 left-4 top-8 z-50 hidden flex-col md:flex ">
      <ul className="flex flex-col gap-1 menu bg-base-100 dark:bg-white/10 rounded-box shadow-md">
        <li>
          <Link
            href={"/u/notebooks"}
            className="tooltip tooltip-right"
            data-tip="Notebooks"
          >
            <Notebook className="w-6 h-6 text-base-content" />
          </Link>
        </li>
        <li>
          <Link
            href={"/u/discussions"}
            className="tooltip tooltip-right"
            data-tip="Discussion Board"
          >
            <MessageCircle className="w-6 h-6 text-base-content" />
          </Link>
        </li>
        <li>
          <Link
            href={"/u/profile"}
            className="tooltip tooltip-right"
            data-tip="Profile"
          >
            {profilePhoto ? (
              <div className="avatar pt-1">
                <div className="w-6 ring-base-content ring-offset-base-100 ring-1 ring-offset-2 bg-neutral rounded-full">
                  <CldImage
                    width={24}
                    height={24}
                    src={profilePhoto}
                    alt="avatar"
                  />
                </div>
              </div>
            ) : displayName ? (
              <div className="avatar placeholder pt-1">
                <div className="ring-base-content ring-offset-base-100 ring-1 ring-offset-2 bg-neutral text-neutral-content w-6 rounded-full">
                  <span className="text-xs">
                    {displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-300 dark:bg-neutral/85 skeleton w-6 h-6 shrink-0 rounded-full"></div>
            )}
          </Link>
        </li>
        <li>
          <ThemeSwitcher />
        </li>
        <li>
          <Logout />
        </li>
      </ul>
    </aside>
  );
};

export default Navbar;
