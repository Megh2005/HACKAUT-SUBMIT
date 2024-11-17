"use client";

import Link from "next/link";
import icon from "@/app/icon.png";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import chat from "../../public/assets/chat.png";
import experts from "../../public/assets/experts.png";
import accessible from "../../public/assets/accessible.png";
import hero from "../../public/assets/hero.png";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-base-300 text-base-content">
      <header className="mt-4 md:mt-6 px-4 lg:px-6 h-14 flex items-center">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <Image src={icon} alt="आत्मनिर्भर ++ Logo" />
          <span className="ml-2 text-2xl font-bold text-secondary">
            आत्मनिर्भर ++
          </span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unlock Your Learning Potential
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our platform provides a wide range of learning experiences
                    to help you achieve your educational goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-8 text-sm font-medium text-secondary-content shadow transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              <Image
                src={hero}
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-base-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <Image
                  className="w-16 h-16"
                  src={accessible}
                  alt="Accessible Courses"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Accessible Courses</h3>
                  <p>
                    Our platform offers courses that are designed to be
                    accessible to all
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <Image
                  className="w-16 h-16"
                  src={experts}
                  alt="Expert Instruction"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Expert Instruction</h3>
                  <p>
                    Learn from experienced educators who are passionate about
                    helping you succeed.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <Image
                  className="w-16 h-16"
                  src={chat}
                  alt="Chat with Experts"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Chat with Experts</h3>
                  <p>
                    Connect with educators who can help you achieve your goals
                    and direct you to the right course
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-md space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Join the revolution in learning
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Sign up today and start your journey to academic success.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 आत्मनिर्भर ++. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
