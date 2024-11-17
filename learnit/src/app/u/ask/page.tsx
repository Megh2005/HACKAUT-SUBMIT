"use client";

import BackButton from "@/components/BackButton";
import TagInput from "@/components/TagInput";
import useTagInput from "@/hooks/useTagInput";
import { discussionSchema, tagSchema } from "@/schemas/DiscussionSchema";
import { SERVER_ERROR_MESSAGE } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import { z } from "zod";

const AskPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof discussionSchema>>({
    resolver: zodResolver(discussionSchema),
    defaultValues: {
      title: "",
      description: "",
      attachment: null,
    },
  });

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

    if (discussionData.attachment) {
      formData.set("attachment", discussionData.attachment[0]);
    }

    formData.set("tags", JSON.stringify(discussionData.tags));

    try {
      const response = await axios.post("/api/discussion", formData);

      if (response.data.success) {
        toast.success("Discussion posted successfully", {
          duration: 3000,
          position: "top-center",
        });
        queryClient.invalidateQueries({
          queryKey: ["user-discussions"],
        });
        queryClient.invalidateQueries({
          queryKey: ["discussions"],
        });
        router.replace("/u/discussions");
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

  return (
    <div className="flex-1 px-4 md:px-6 md:pl-28 py-8 w-full flex flex-col bg-base-200">
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="mx-auto w-full max-w-4xl">
        <div className="card dark:bg-neutral/85 bg-base-100 w-full shadow-xl">
          <div className="card-body p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl text-base-content mb-4">
              Start a discussion
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

export default AskPage;
