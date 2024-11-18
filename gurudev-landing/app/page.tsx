"use client";

import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Link from "next/link";

export default function BackgroundBeamsWithCollisionDemo() {
  return (
    <div>
      <BackgroundBeamsWithCollision className="flex-col">
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
            Want To Educate Yourself With Your Passion ?
            <br />
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                <span className="">Welcome To Gurudev</span>
              </div>
            </div>
          </h2>
          <div className="flex gap-10">
            <Link href={"/explore"} className="p-[3px] relative mt-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-xl font-extrabold text-white hover:bg-transparent">
                Explore More
              </div>
            </Link>
            <Link
              href={"http://localhost:5173"}
              target="_blank"
              className="p-[3px] relative mt-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-xl font-extrabold text-white hover:bg-transparent">
                Find Internship
              </div>
            </Link>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
