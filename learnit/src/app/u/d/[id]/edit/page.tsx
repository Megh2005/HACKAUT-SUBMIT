"use client";

import BackButton from "@/components/BackButton";
import TagInput from "@/components/TagInput";
import useTagInput from "@/hooks/useTagInput";
import { getDiscussion } from "@/queries/discussion.queries";
import { discussionSchema, tagSchema } from "@/schemas/DiscussionSchema";
import { SERVER_ERROR_MESSAGE } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { X } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { z } from "zod";

const EditDiscussion = () => {
  const discussionId = useParams().id as string;

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["update-discussion", { discussionId }],
    queryFn: () => getDiscussion(discussionId),
    onError: () => {
      toast.error("Error fetching discussion", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof discussionSchema>>({
    resolver: zodResolver(discussionSchema),
    defaultValues: {
      title: data?.discussion.title,
      description: data?.discussion.description,
      attachment: null,
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.discussion.title,
        description: data.discussion.description,
        attachment: null,
      });

      setImageSrc(data.discussion.attachment);
      setTags(data.discussion.tags);
    }
  }, [data, reset]);

  const attachment = watch("attachment") as FileList;

  useEffect(() => {
    if (attachment?.length > 0) {
      // Create a URL for the selected file
      const file = attachment.item(0);
      if (file) {
        const fileURL = URL.createObjectURL(file);
        setImageSrc(fileURL);

        // Clean up the object URL after component unmount or when a new file is selected
        return () => URL.revokeObjectURL(fileURL);
      }
    } else {
      setImageSrc(imageSrc || null);
    }
  }, [attachment]);

  const {
    deleteTag,
    inputValue,
    setInputValue,
    setTagError,
    setTags,
    tagError,
    tags,
  } = useTagInput();

  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (formData: z.infer<typeof discussionSchema>) => {
    const { success, data, error } = tagSchema.safeParse(tags);
    if (error) {
      setTagError(error.errors[0].message);
    }
    if (!success) return;

    submitDiscussion({ ...formData, tags: data });
  };

  async function submitDiscussion(
    discussionData: z.infer<typeof discussionSchema> & { tags: string[] }
  ) {
    setSubmitting(true);

    const formData = new FormData();
    formData.set("title", discussionData.title);
    formData.set("description", discussionData.description);

    if (
      discussionData.attachment ||
      discussionData.attachment !== null ||
      undefined
    ) {
      formData.set("attachment", discussionData.attachment[0]);
    }

    formData.set("tags", JSON.stringify(discussionData.tags));

    if (imageSrc) {
      formData.set("imageSrc", imageSrc);
    } else {
      formData.set("imageSrc", "null");
    }

    try {
      const response = await axios.patch(
        `/api/discussion/${discussionId}`,
        formData
      );

      if (response.data.success) {
        toast.success("Discussion updated successfully", {
          duration: 3000,
          position: "top-center",
        });
        queryClient.invalidateQueries({
          queryKey: ["user-discussions"],
        });
        queryClient.invalidateQueries({
          queryKey: ["discussions"],
        });
        router.replace("/u/profile");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message, {
          duration: 3000,
          position: "top-center",
        });
      } else {
        toast.error(SERVER_ERROR_MESSAGE, {
          duration: 3000,
          position: "top-center",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  const removeAttachment = () => {
    reset({
      attachment: null,
    });
    setImageSrc(null);
  };

  if (isLoading)
    return (
      <div className="flex-1 px-4 md:px-6 md:pl-28 py-8 w-full flex flex-col items-center justify-center bg-base-200">
        <div className="loading loading-spinner loading-sm text-primary"></div>
      </div>
    );

  return (
    <div className="flex-1 px-4 md:px-6 md:pl-28 py-8 w-full flex flex-col bg-base-200">
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="mx-auto w-full max-w-4xl">
        <div className="card dark:bg-neutral/85 bg-base-100 w-full shadow-xl">
          <div className="card-body p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl text-base-content mb-4">
              Update Discussion
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm sm:text-base text-base-content/85"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  {...register("title")}
                  placeholder="Type here"
                  className="text-sm sm:text-base text-base-content input input-bordered w-full"
                />
                <p className="text-sm text-error font-medium">
                  {errors.title?.message}
                </p>
              </div>

              <TagInput
                deleteTag={deleteTag}
                inputValue={inputValue}
                setInputValue={setInputValue}
                setTagError={setTagError}
                setTags={setTags}
                tagError={tagError}
                tags={tags}
              />

              <div className="flex flex-col gap-2">
                <label
                  className="text-sm sm:text-base text-base-content/85"
                  htmlFor="description"
                >
                  Describe your question
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="text-sm sm:text-base text-base-content textarea textarea-bordered w-full h-80 resize-none"
                  placeholder="Type here..."
                ></textarea>
                <p className="text-sm text-error font-medium">
                  {errors.description?.message}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-sm sm:text-base text-base-content/85"
                  htmlFor="attachment"
                >
                  Attachment
                </label>
                <input
                  id="attachment"
                  {...register("attachment")}
                  type="file"
                  className="text-base-content file-input-sm md:file-input-md file-input file-input-bordered file-input-primary w-full max-w-xs"
                />
                <p className="text-sm text-error font-medium">
                  {errors.attachment?.message &&
                    String(errors.attachment?.message)}
                </p>
              </div>
              {imageSrc && (
                <div>
                  <div className="relative max-w-xs rounded-md overflow-hidden shadow-md dark:shadow-xl">
                    <CldImage
                      width={240}
                      height={240}
                      alt="Attachment"
                      src={imageSrc}
                      className="w-full"
                    />
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-black/35 to-transparent">
                      <X
                        onClick={removeAttachment}
                        className="cursor-pointer hover:scale-110 transition duration-150 ease-in-out absolute top-2 right-2 w-4 h-4 md:w-5 md:h-5 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary">
                {submitting ? (
                  <div className="loading loading-spinner loading-sm text-primary-content"></div>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDiscussion;
