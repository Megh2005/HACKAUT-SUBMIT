"use client";
import { useState } from "react";
import {
  FaHome,
  FaGithub,
  FaInfoCircle,
  FaUsers,
  FaPhoneAlt,
  FaServicestack,
  FaProjectDiagram,
  FaComments,
} from "react-icons/fa"; // Import icons from react-icons
import Link from "next/link";

const Navbar: React.FC = () => {
  const [activeLink, setActiveLink] = useState<string>("home"); // Track active link

  // Handle active link state
  const handleLinkClick = (link: string): void => {
    setActiveLink(link);
  };

  return (
    <nav className="bg-gray-900 text-white fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-t-3xl shadow-lg w-full sm:w-auto">
      <div className="max-w-screen-lg mx-auto flex items-center justify-center">
        {/* Menu (Desktop and Mobile share same layout now) */}
        <div className="flex space-x-6">
          <Link
            href="/"
            className={`relative group hover:text-blue-500 `}
            onClick={() => handleLinkClick("home")}
          >
            <FaHome className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Home
            </span>
          </Link>
          <Link
            href="/about"
            className={`relative group hover:text-blue-500`}
            onClick={() => handleLinkClick("about")}
          >
            <FaInfoCircle className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              About
            </span>
          </Link>
          <Link
            href="/gurugyan"
            className={`relative group hover:text-blue-500`}
            onClick={() => handleLinkClick("team")}
          >
            <FaUsers className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Gurugyan
            </span>
          </Link>
          <Link
            href="/explore"
            className={`relative group hover:text-blue-500`}
            onClick={() => handleLinkClick("services")}
          >
            <FaServicestack className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Explore
            </span>
          </Link>
          <Link
            href="/testimonials"
            className={`relative group hover:text-blue-500`}
            onClick={() => handleLinkClick("testimonials")}
          >
            <FaComments className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Testimonials
            </span>
          </Link>
          <Link
            href="/contact"
            className={`relative group hover:text-blue-500 ${
              activeLink === "contact" ? "text-blue-500" : ""
            }`}
            onClick={() => handleLinkClick("contact")}
          >
            <FaPhoneAlt className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Contact
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
