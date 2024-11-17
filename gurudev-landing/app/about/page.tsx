"use client";

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const words = `Gurudev is your one-stop solution for all your learning and career aspirations. Our platform offers a comprehensive suite of AI-powered tools to elevate your educational journey.  From personalized course recommendations to intelligent note-taking and summarization, we empower you to learn efficiently and effectively. Our innovative quiz generator provides interactive assessments to reinforce your understanding, while our internship search platform connects you with exciting opportunities to gain practical experience. To validate your achievements, our blockchain-based certificate generator and verifier ensure secure and transparent credentialing. With Gurudev, you have the tools and resources to succeed in your academic and professional endeavors
`;

export default function TextGenerateEffectDemo() {
  return (
    <div className="flex flex-col text-center sm:px-36 items-center justify-center min-h-screen">
      <h1 className="mb-[-200px] text-6xl font-extrabold text-center leading-none tracking-tight bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent">
        About Us
      </h1>
      <div className="flex items-center justify-center min-h-screen">
        <TextGenerateEffect
          filter={true}
          className="text-center capitalize px-2 sm:px-14"
          words={words}
        />
      </div>
    </div>
  );
}
