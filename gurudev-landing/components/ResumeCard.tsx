import Link from "next/link";
import React from "react";

interface ResumeCardProps {
  score: number;
  summary: string;
  suggestions: string[];
  additional_tips: string;
}

const ResumeCard = ({ content }: { content: ResumeCardProps }) => {
  return (
    <div className="rounded-md border border-gray-700 shadow-xl p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">
        Resume Score:{" "}
        <span
          className={
            content.score > 80
              ? `text-green-500`
              : content.score > 60 && content.score < 80
              ? `text-yellow-500`
              : `text-red-600`
          }
        >
          {content.score}
        </span>
      </h1>
      <h1 className="text-3xl font-bold text-white underline underline-offset-8">
        Overview
      </h1>
      <p className="text-medium text-lg text-white">{content.summary}</p>
      <h1 className="text-3xl text-white font-bold underline underline-offset-8">
        Suggestions
      </h1>
      <ul className="space-y-4">
        {content.suggestions.map((suggestion, index) => (
          <li className="text-white list-disc ml-4" key={index}>
            {suggestion}
          </li>
        ))}
      </ul>
      <div>
        <h1 className="text-3xl text-white font-bold underline underline-offset-8">
          Additional Tips
        </h1>
        <p className="mt-6 text-medium text-lg text-white">
          {content.additional_tips}
        </p>
      </div>
      <div>
        <div className="space-y-4">
          {content.score > 80 ? (
            <p className="text-green-500 font-medium text-lg">
              Looks like you are on a good track. To brush up your knowledge, we
              suggest you to start learning with our AI powered learning
              platform.
            </p>
          ) : (
            <p className="text-yellow-400 font-medium text-lg">
              Your resume score is low. If you want to learn new skills and
              improve your resume, we suggest you to look into our engaging
              courses that give you a structured learning path.
            </p>
          )}
          <div className="flex gap-4">
            <Link href={"https://learnit-tawny.vercel.app"}>
              <button className="mt-6 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
                Start Learning
              </button>
            </Link>
            <Link href={"https://atmanirvar-one.vercel.app"}>
              <button className="mt-6 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
                Explore courses
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
