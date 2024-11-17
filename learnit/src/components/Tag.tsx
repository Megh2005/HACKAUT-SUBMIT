import { MouseEventHandler } from "react";

const Tag = ({
  value,
  onClickHandler,
}: {
  value: string;
  onClickHandler: MouseEventHandler | undefined;
}) => {
  return (
    <div
      onClick={onClickHandler}
      className="badge badge-secondary gap-2 p-3 cursor-pointer"
    >
      <span className="text-secondary-content text-xs sm:text-sm font-bold">
        {value}
      </span>
      {onClickHandler && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-4 w-4 stroke-secondary-content"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      )}
    </div>
  );
};

export default Tag;
