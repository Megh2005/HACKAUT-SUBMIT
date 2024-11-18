"use client";

import { recommendationSchema } from "@/schemas/recommendation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Recommendation = () => {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof recommendationSchema>>({
    resolver: zodResolver(recommendationSchema),
  });

  const onSubmit = async (data: z.infer<typeof recommendationSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex-1 px-4 md:px-6 md:pl-28 py-8 w-full flex flex-col bg-base-200">
      <h1 className="text-xl md:text-2xl text-base-content font-bold tracking-tight">
        Get Recommendations
      </h1>
      <div className="w-full max-w-3xl mx-auto mt-6 md:mt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <label className="text-base-content font-medium" htmlFor="skills">
              Skills
            </label>
            <input
              {...register("skills")}
              id="skills"
              type="text"
              placeholder="eg. JavaScript, React, Python, etc."
              className="text-sm sm:text-base text-base-content input input-bordered w-full"
            />
            <p className="text-sm text-red-600">{errors.skills?.message}</p>
          </div>
          <div className="space-y-1">
            <label
              className="text-base-content font-medium"
              htmlFor="level-of-exp"
            >
              Level of Experience
            </label>
            <select
              {...register("levelOfExperience")}
              id="level-of-exp"
              defaultValue="Beginner"
              className="select select-bordered w-full text-base-content"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <p className="text-sm text-red-600">
              {errors.levelOfExperience?.message}
            </p>
          </div>
          <div className="space-y-1">
            <label
              className="text-base-content font-medium"
              htmlFor="commitment"
            >
              Select your time of commitment
            </label>
            <select
              {...register("commitmentTime")}
              id="commitment"
              defaultValue="1-2-hours/day"
              className="select select-bordered w-full text-base-content"
            >
              <option value="1-2-hours/day">1-2 hours/day</option>
              <option value="3-6-hours/day">4-6 hours/day</option>
              <option value="6-hours/day">6+ hours/day</option>
            </select>
            <p className="text-sm text-red-600">
              {errors.commitmentTime?.message}
            </p>
          </div>
          <button type="submit" className="btn btn-primary">
            {submitting ? (
              <div className="loading loading-spinner loading-sm text-primary-content"></div>
            ) : (
              "Get Recommendations"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Recommendation;
