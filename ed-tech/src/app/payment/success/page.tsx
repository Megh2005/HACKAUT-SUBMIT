"use client";

import { useRouter } from "next/navigation";
import React from "react";

const SuccessPage = () => {
  const router = useRouter();

  return (
    <div className="text-center p-4 md:p-6">
      <p className="text-2xl text-neutral-content font-bold">
        Payment Successfull!
      </p>
      <div className="my-6">
        <button
          onClick={() => router.replace("/u/my-courses")}
          className="btn btn-secondary"
        >
          Go to my courses
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
