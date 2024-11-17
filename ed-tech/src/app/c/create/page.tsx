"use client";

import { uploadCourse } from "@/actions/uploadCourse";
import CourseSection from "@/components/CourseSection";
import { courseSchema } from "@/schemas/course.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const Create = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      sections: [{ title: "", video: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const createNewSection = () => {
    append({ title: "", video: undefined });
  };

  const deleteSection = (index: number) => {
    remove(index);
  };

  const onSubmit = async (data: z.infer<typeof courseSchema>) => {
    setSubmitting(true);
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("price", data.price.toString());
    formData.append("description", data.description);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail[0]);

    data.sections.forEach((section, index) => {
      formData.append(`sections[${index}][title]`, section.title);
      if (section.video)
        formData.append(`sections[${index}][video]`, section.video[0]);
    });

    try {
      const res = await axios.post("/api/course", formData);
      if (res.data.status === "SUCCESS") {
        toast.success(res.data.message);
        router.replace("/c/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl text-base-content py-10 px-4 md:px-6">
      <div className="card bg-base-100 w-full shadow-xl">
        <div className="card-body p-4 sm:p-6 md:p-8">
          <div className="container px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Create a New Course</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label htmlFor="title">Title</label>
                <input
                  {...register("title")}
                  className="input input-bordered w-full"
                  id="title"
                  type="text"
                  placeholder="Enter course title"
                />
                <p className="text-error">{errors.title?.message}</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="price">Price</label>
                <input
                  {...register("price")}
                  className="input input-bordered w-full"
                  id="price"
                  type="number"
                  placeholder="Enter course price"
                />
                <p className="text-error">{errors.price?.message}</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="thumbnail">Thumbnail</label>
                <input
                  {...register("thumbnail")}
                  className="file-input file-input-bordered w-full"
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                />
                <p className="text-error">
                  {errors.thumbnail?.message?.toString()}
                </p>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label htmlFor="description">Description</label>
                <textarea
                  {...register("description")}
                  id="description"
                  placeholder="Enter course description"
                  className="w-full min-h-[120px] textarea textarea-bordered"
                />
                <p className="text-error">{errors.description?.message}</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <h2 className="text-xl font-bold mb-4">Course Sections</h2>
                <div className="space-y-4">
                  <div className="flex flex-col gap-4">
                    {fields.map((section, index) => (
                      <CourseSection
                        key={section.id}
                        sectionLength={fields.length}
                        index={index}
                        onDelete={() => deleteSection(index)}
                        register={register}
                        errors={errors.sections?.[index]}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={createNewSection}
                  className="btn btn-primary"
                >
                  Add Section
                </button>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-end">
                <button
                  disabled={submitting}
                  type="submit"
                  className="btn btn-secondary"
                >
                  {submitting ? (
                    <LoaderCircle className="animate-spin text-primary w-6 h-6 mr-2" />
                  ) : null}
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
