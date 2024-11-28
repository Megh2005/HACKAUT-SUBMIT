"use client";

import Link from "next/link";
import Image from "next/image";
import homeDemo from "../../public/home-demo.png";
import { MoveRight } from "lucide-react";
import chat from "../../public/assets/chat.png";
import accessible from "../../public/assets/accessible.png";
import experts from "../../public/assets/experts.png";

export default function Home() {
  return (
    <div className="min-h-screen px-5 py-8 bg-base-200">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-gray-300 pb-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold text-primary">
            आत्मनिर्भर ++
          </h1>
          <div className="flex gap-4">
            <Link href={"/login"}>
              <button className="btn btn-md btn-primary">Login</button>
            </Link>
            <Link className="hidden md:block" href={"/signup"}>
              <button className="btn bg-neutral/10">Sign Up</button>
            </Link>
          </div>
        </header>
        <main>
          <p className="py-1 relative text-balance text-center md:text-6xl text-3xl mt-10 bg-gradient-to-b from-accent to-primary bg-clip-text text-transparent font-bold ">
            Engaging Courses. <br /> Structured Learning Path. <br /> आत्मनिर्भर
            ++ has everything you need
          </p>
          <div className="flex justify-center mt-10">
            <Link href={"/signup"}>
              <div className="px-4 py-2 w-max flex gap-2 items-center rounded-full bg-primary bg-opacity-10 hover:bg-opacity-20 transform active:scale-95 transition duration-150">
                <p className="text-primary text-base font-medium">
                  Start Learning
                </p>
                <MoveRight className="w-5 h-5 text-primary" />
                <i className="shine-btn"></i>
              </div>
            </Link>
          </div>
          <div className="mockup-browser bg-neutral border my-10">
            <div className="mockup-browser-toolbar">
              <div className="input text-base-content">
                https://atmanirvar-one.vercel.app
              </div>
            </div>
            <div className="bg-base-300 flex justify-center">
              <Image className="w-full" src={homeDemo} alt="LearnIt Homepage" />
            </div>
          </div>
          <div className="py-8 flex flex-col md:flex-row justify-evenly gap-8 md:gap-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Image
                className="w-16 h-16"
                src={accessible}
                alt="Chat with Experts"
              />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">
                  Accessible Courses
                </h3>
                <p className="text-balance ">
                  Our platform offers courses that are designed to be accessible
                  to all
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Image className="w-16 h-16" src={chat} alt="Chat with Experts" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">
                  Chat with Experts
                </h3>
                <p className="text-balance">
                  Connect with educators who can help you achieve your goals and
                  direct you to the right course
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Image
                className="w-16 h-16"
                src={experts}
                alt="Chat with Experts"
              />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">
                  Expert Instructions
                </h3>
                <p className="text-balance">
                  Learn from experienced educators who are passionate about
                  helping you succeed.
                </p>
              </div>
            </div>
          </div>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 आत्मनिर्भर ++. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
              prefetch={false}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
              prefetch={false}
            >
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
