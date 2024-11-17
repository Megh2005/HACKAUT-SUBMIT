import React from "react";

const Error = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-48 text-white">
      <div className="px-8 mx-56 py-12 shadow-lg rounded-lg min-w-screen bg-gray-800 sm:max-w-md sm:w-full">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-purple-500">
            <svg
              className="w-20 h-20 animate-spin-slow sm:w-24 sm:h-24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2L12 12M12 12L20 20M12 12L4 20M12 12L20 4M12 12L4 4"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold sm:text-6xl">404</h1>
          <p className="text-lg text-center text-gray-400 sm:text-xl">
            Oops! The page you're looking for doesn't exist.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <a
              href="/"
              className="px-4 py-2 bg-purple-600 text-white font-medium rounded hover:bg-purple-700 transition"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
