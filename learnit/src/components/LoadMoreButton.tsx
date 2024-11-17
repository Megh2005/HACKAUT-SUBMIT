import { RotateCcw } from "lucide-react";
import React from "react";

const LoadMoreButton = ({ clickHandler }: { clickHandler: () => void }) => {
  return (
    <button
      onClick={() => clickHandler()}
      className="text-sm text-primary font-bold px-4 py-2 w-max flex gap-2 items-center rounded-full bg-primary bg-opacity-10 hover:bg-opacity-20 transition ease-in-out transform active:scale-95 duration-150"
    >
      Load more
      <RotateCcw className="w-4 h-4 text-primary" />
    </button>
  );
};

export default LoadMoreButton;
