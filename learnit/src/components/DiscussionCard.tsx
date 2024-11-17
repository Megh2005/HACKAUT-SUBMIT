"use client";

import { DiscussionCardData } from "@/interfaces/discussion.interface";
import { convertDateTime } from "@/utils/convertDateTime";
import { CalendarIcon, EditIcon, Trash2, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteDiscussionModal from "./DeleteDiscussionModal";

const DiscussionCard = ({ discussion }: { discussion: DiscussionCardData }) => {
  return (
    <Link href={`/u/d/${discussion._id}`}>
      <div className="w-full max-w-xl card bg-base-100 shadow-md rounded-md">
        <div className="card-body p-4 sm:p-6 md:p-8">
          <div className="card-title">
            <p className="text-lg sm:text-xl text-base-content font-bold">
              {discussion.title}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 my-2">
            <div className="flex items-center gap-2">
              {discussion.askedBy.profilePhoto ? (
                <div className="avatar">
                  <div className="ring-base-content ring-offset-base-100 ring-1 ring-offset-2 w-4 sm:w-6 rounded-full">
                    <Image
                      src={discussion.askedBy.profilePhoto}
                      alt="avatar"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="ring-base-content ring-offset-base-100 ring-1 ring-offset-2 bg-neutral text-neutral-content w-4 sm:w-6 rounded-full">
                    <span className="text-xs">
                      {discussion.askedBy.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <p className="text-xs sm:text-sm text-base-content font-medium">
                {discussion.askedBy.displayName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-base-content/85" />
              <p className="text-xs sm:text-sm text-base-content/85">
                {convertDateTime(discussion.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {discussion.tags.map((tag, index) => (
              <div
                key={index}
                className="badge badge-secondary text-xs sm:text-sm font-normal"
              >
                {tag}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-sm sm:text-base text-base-content line-clamp-2">
              {discussion.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const WithActionsDiscussionCard = (
  Component: React.FC<{ discussion: DiscussionCardData }>
) => {
  const WithActionsDiscussionCard = (props: {
    discussion: DiscussionCardData;
  }) => {
    return (
      <div>
        <div className="flex gap-2 mb-2 justify-end">
          <Link href={`/u/d/${props.discussion._id}/edit`}>
            <div className="cursor-pointer shadow-md rounded-full px-4 py-2 flex gap-2 justify-center items-center bg-primary bg-opacity-10 hover:bg-opacity-20 transform active:scale-95 transition duration-150">
              <p className="text-primary text-xs md:text-sm font-medium">
                Edit
              </p>
              <EditIcon className="w-4 md:w-5 h-4 md:h-5 text-primary" />
            </div>
          </Link>
          <DeleteDiscussionModal discussion={props.discussion} />
        </div>
        <Component {...props} />
      </div>
    );
  };

  WithActionsDiscussionCard.displayName = `withActions(${
    Component.displayName || Component.name || "Component"
  })`;

  return WithActionsDiscussionCard;
};

export default DiscussionCard;
