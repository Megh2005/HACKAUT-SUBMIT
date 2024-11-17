"use client";

import DiscussionCard, {
  WithActionsDiscussionCard,
} from "@/components/DiscussionCard";
import DiscussionCardSkeleton from "@/components/DiscussionCardSkeleton";
import StyledButton from "@/components/StyledButton";
import { DiscussionCardData } from "@/interfaces/discussion.interface";
import { useAppSelector } from "@/lib/store/hooks";
import { getDiscussionsByCurrentUser } from "@/queries/user.queries";
import { EditIcon, Mail } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import React from "react";
import { useInfiniteQuery } from "react-query";

const ProfilePage = () => {
  const { profilePhoto, displayName, email } = useAppSelector(
    (state) => state.user
  );

  const EnhancedDiscussionCard = WithActionsDiscussionCard(DiscussionCard);

  const {
    isLoading: isDiscussionsLoading,
    isError: isDiscussionsError,
    data: discussions,
  } = useInfiniteQuery({
    queryKey: ["user-discussions", { pageSize: 4 }],
    queryFn: ({ pageParam }) =>
      getDiscussionsByCurrentUser({ pageParam, pageSize: 4 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.metadata.hasNextPage) {
        return lastPage.data.metadata.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div className="flex-1 px-4 md:px-6 md:pl-28 py-8 w-full flex flex-col bg-base-200">
      <h1 className="text-base-content text-xl md:text-2xl font-bold tracking-tight">
        Your Profile
      </h1>
      <div className="mt-6 md:px-4 flex flex-row md:flex-col gap-6 items-start md:items-center">
        <div>
          {profilePhoto ? (
            <div className="avatar">
              <div className="w-20 md:w-36 ring-base-content ring-offset-base-100 ring-1 ring-offset-2 bg-neutral rounded-full">
                <CldImage
                  width={196}
                  height={196}
                  src={profilePhoto}
                  alt="avatar"
                />
              </div>
            </div>
          ) : displayName ? (
            <div className="avatar placeholder">
              <div className="ring-base-content ring-offset-base-100 ring-1 ring-offset-2 bg-neutral text-neutral-content w-20 md:w-36 rounded-full">
                <span className="text-xs">
                  {displayName?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-300 dark:bg-neutral/85 skeleton w-20 h-20 md:w-36 md:h-36 shrink-0 rounded-full"></div>
          )}
        </div>
        <div className="flex-1 ">
          {displayName && email ? (
            <div className="md:text-center">
              <h2 className="text-base-content font-bold text-lg">
                {displayName}
              </h2>
              <div className="flex items-center gap-1 mt-1">
                <Mail className="text-base-content w-4 h-4" />
                <p className="text-sm text-base-content font-bold">{email}</p>
              </div>
            </div>
          ) : (
            <span className="loading loading-spinner loading-sm text-primary"></span>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Link href="/u/profile/edit">
          <div className="px-4 py-2 w-max flex gap-2 items-center rounded-full bg-primary bg-opacity-10 hover:bg-opacity-20 transform active:scale-95 transition duration-150">
            <p className="text-primary text-base font-medium">Edit Profile</p>
            <EditIcon className="w-5 h-5 text-primary" />
          </div>
        </Link>
      </div>
      <div className="my-6">
        <h1 className="text-base-content text-xl md:text-2xl font-medium">
          Latest Discussions
        </h1>
        {discussions?.pages[0].data.data.length === 0 && (
          <div className="mt-4">
            <div className="flex flex-col items-center gap-2 mt-12 md:mt-20">
              <p className="text-center text-base-content text-base md:text-base font-medium">
                You havent&apos;t started any discussions yet
              </p>
              <Link className="mt-2" href="/u/ask">
                <StyledButton content="Start a discussion" />
              </Link>
            </div>
          </div>
        )}
        <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isDiscussionsLoading && (
            <>
              <DiscussionCardSkeleton />
              <DiscussionCardSkeleton />
              <DiscussionCardSkeleton />
              <DiscussionCardSkeleton />
              <DiscussionCardSkeleton />
            </>
          )}
          {discussions?.pages.map((page) => {
            return page.data.data.map((discussion: DiscussionCardData) => {
              return (
                <EnhancedDiscussionCard
                  key={discussion._id}
                  discussion={discussion}
                />
              );
            });
          })}
        </div>
        {!isDiscussionsLoading &&
          !isDiscussionsError &&
          discussions?.pages[0].data.data.length !== 0 && (
            <div className="mt-6 flex justify-center">
              <Link href={`/u/my-discussions`}>
                <StyledButton content="View all" />
              </Link>
            </div>
          )}
      </div>
    </div>
  );
};

export default ProfilePage;
