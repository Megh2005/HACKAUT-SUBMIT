const DiscussionCardSkeleton = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-4 w-full max-w-xl card bg-base-100 shadow-md rounded-md">
      <div className="bg-neutral-content skeleton h-4 w-full"></div>
      <div className="flex items-center gap-2">
        <div className="bg-neutral-content skeleton w-4 h-4 sm:w-6 sm:h-6 shrink-0 rounded-full"></div>
        <div className="bg-neutral-content skeleton h-3 w-full max-w-20"></div>
        <div className="bg-neutral-content skeleton h-3 w-full max-w-20"></div>
      </div>
      <div className="bg-neutral-content skeleton h-4 w-full max-w-10"></div>
      <div className="mt-4 bg-neutral-content skeleton h-3 w-full"></div>
    </div>
  );
};

export default DiscussionCardSkeleton;
