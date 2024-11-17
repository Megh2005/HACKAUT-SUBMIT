"use client";

import BackButton from "@/components/BackButton";
import Summary from "@/components/Summary";
import { getSummary } from "@/queries/summary.queries";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import React from "react";

const Summarize = ({ params }: { params: { id: string } }) => {
  const [summary, setSummary] = useState<string[]>([]);
  const [image, setImage] = useState<File | undefined>(undefined);
  const notebookId = params.id;
  const queryClient = useQueryClient();

  const {
    mutate,
    isLoading: uploading,
    data,
  } = useMutation({
    mutationFn: () => getSummary(image as File, notebookId),
    onSuccess: (data) => {
      if (data.data === "null") {
        toast.error("No educational content found", {
          duration: 3000,
          position: "top-center",
        });

        return;
      }

      setSummary((prev) => [...prev, data.data]);
      setImage(undefined);

      queryClient.invalidateQueries({
        queryKey: ["summaries", { notebookId, pageSize: 4 }],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["summaries", { notebookId, pageSize: 10 }],
      });
    },
    onError: () => {
      toast.error("Error summarizing image", {
        duration: 3000,
        position: "top-center",
      });
      setImage(undefined);
    },
  });

  useEffect(() => {
    if (!image) return;
    mutate();
  }, [image]);

  useEffect(() => {
    if (summary.length === 1) return;

    const currentScrollPosition = window.scrollY;

    window.scrollTo({
      top: currentScrollPosition + 200,
      behavior: "smooth",
    });
  }, [summary]);

  return (
    <div className="flex-1 px-4 md:px-6 md:pl-28 py-8 lg:pb-12 w-full flex flex-col bg-base-200 relative">
      <div className="flex gap-3 items-center">
        <BackButton />
        <h1 className="text-base-content text-xl md:text-2xl font-bold tracking-tight">
          Summarize your notes
        </h1>
      </div>

      {summary.length === 0 && (
        <div className="fixed left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]">
          <p className="text-center text-sm sm:text-base font-medium text-base-content/65">
            Upload your notes to get started
          </p>
        </div>
      )}
      <div className="my-4 lg:mt-8">
        {summary.map((s, i) => {
          return <Summary key={i} data={s} />;
        })}
      </div>
      {uploading && (
        <div className="flex flex-col gap-2">
          <div className="bg-gray-300 dark:bg-neutral/85 skeleton h-4 w-full mx-auto max-w-4xl"></div>
          <div className="bg-gray-300 dark:bg-neutral/85 skeleton h-4 w-full mx-auto max-w-4xl"></div>
        </div>
      )}
      <div className="z-50 fixed bottom-20 md:bottom-6 left-[50%] translate-x-[-50%] grid gap-4 transform active:scale-95 transition-transform duration-150">
        <div className="flex justify-center">
          <label
            className="shadow-md dark:shadow-2xl text-primary-content rounded-full cursor-pointer"
            htmlFor="upload-file"
          >
            <div className="flex items-center px-6 py-3 shadow-2xl bg-neutral dark:bg-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-300 rounded-full transition duration-200 ease-in-out">
              {!uploading && (
                <>
                  <span className="mr-2 font-medium text-neutral-content dark:text-neutral">
                    Upload
                  </span>
                  <span className="flex items-center justify-center p-1 bg-secondary rounded-full">
                    <ArrowUp className="text-secondary-content w-5 h-5" />
                  </span>
                </>
              )}
              {uploading && (
                <div className="loading loading-spinner loading-sm text-neutral-content dark:text-neutral"></div>
              )}
            </div>
          </label>
        </div>
        {!uploading && (
          <input
            onChange={(e) => setImage(e.target.files?.[0])}
            className="hidden"
            id="upload-file"
            type="file"
            accept="image/jpeg, image/jpg, image/png"
          />
        )}
      </div>
    </div>
  );
};

export default Summarize;
