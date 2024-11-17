"use client";
import { useState } from "react";
import {
  FaHome,
  FaGithub,
  FaBars,
  FaTimes,
  FaInfoCircle,
  FaUsers,
  FaPhoneAlt,
  FaServicestack,
  FaProjectDiagram,
  FaComments,
} from "react-icons/fa"; // Import icons from react-icons
import Link from "next/link";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Manage hamburger menu state
  const [activeLink, setActiveLink] = useState<string>("home"); // Track active link

  // Toggle the hamburger menu
  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  // Handle active link state
  const handleLinkClick = (link: string): void => {
    setActiveLink(link);
    setIsOpen(false); // Close the menu after clicking on a link
  };

  return (
    <nav className="bg-gray-900 text-white fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-t-3xl shadow-lg w-full sm:w-auto">
      <div className="max-w-screen-lg mx-auto flex items-center justify-center">
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link
            href="/"
            className={`relative group hover:text-blue-500 ${
              activeLink === "home" ? "text-blue-500" : ""
            }`}
            onClick={() => handleLinkClick("home")}
          >
            <FaHome className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Home
            </span>
          </Link>
          <Link
            href="/about"
            className={`relative group hover:text-blue-500 ${
              activeLink === "about" ? "text-blue-500" : ""
            }`}
            onClick={() => handleLinkClick("about")}
          >
            <FaInfoCircle className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              About
            </span>
          </Link>
          <Link
            href="/team"
            className={`relative group hover:text-blue-500 ${
              activeLink === "team" ? "text-blue-500" : ""
            }`}
            onClick={() => handleLinkClick("team")}
          >
            <FaUsers className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Team
            </span>
          </Link>
          <Link
            href="/services"
            className={`relative group hover:text-blue-500 ${
              activeLink === "services" ? "text-blue-500" : ""
            }`}
            onClick={() => handleLinkClick("services")}
          >
            <FaServicestack className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Services
            </span>
          </Link>
          <Link
            href="/projects"
            className={`relative group hover:text-blue-500 ${
              activeLink === "projects" ? "text-blue-500" : ""
            }`}
            onClick={() => handleLinkClick("projects")}
          >
            <FaProjectDiagram className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Projects
            </span>
          </Link>
          <Link
            href="/testimonials"
            className={`relative group hover:text-blue-500 ${
              activeLink === "testimonials" ? "text-blue-500" : ""
            }`}
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
          <Link
            href="https://github.com/techjantaparty"
            target="_blank"
            className={`relative group hover:text-blue-500 ${
              activeLink === "github" ? "text-blue-500" : ""
            }`}
            onClick={() => handleLinkClick("github")}
          >
            <FaGithub className="inline-block mr-2" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              GitHub
            </span>
          </Link>
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-blue-500"
          >
            {isOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Hamburger) */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 text-white p-4 space-y-4 rounded-b-3xl">
          <Link
            href="/"
            className={`block ${activeLink === "home" ? "text-blue-500" : ""}`}
            onClick={() => handleLinkClick("home")}
          >
            <FaHome className="inline-block mr-2" />
            Home
          </Link>
          {/* Repeat the mobile links here */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
