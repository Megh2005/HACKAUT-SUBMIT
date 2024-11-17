import { FrownIcon } from "lucide-react";
import React from "react";

const FailurePage = () => {
  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-center items-center gap-2">
        <p className="text-2xl text-neutral-content font-bold">
          Payment Failed!
        </p>
        <FrownIcon className="w-8 h-8 text-neutral-content" />
      </div>
    </div>
  );
};

export default FailurePage;
