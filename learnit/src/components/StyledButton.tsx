import { MoveRight } from "lucide-react";
import React from "react";

const StyledButton = ({ content }: { content: string }) => {
  return (
    <div className="px-4 py-2 w-max flex gap-2 items-center rounded-full bg-primary bg-opacity-10 hover:bg-opacity-20 transform active:scale-95 transition duration-150">
      <p className="text-primary text-base font-medium">{content}</p>
      <MoveRight className="w-5 h-5 text-primary" />
    </div>
  );
};

export default StyledButton;
