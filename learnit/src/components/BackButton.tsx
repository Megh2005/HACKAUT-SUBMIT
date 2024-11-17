"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="cursor-pointer bg-white hover:bg-white/55 border dark:border-none dark:bg-neutral dark:hover:bg-neutral/75 rounded-full p-2 transform active:scale-95 transition duration-150"
    >
      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-base-content" />
    </button>
  );
};

export default BackButton;
