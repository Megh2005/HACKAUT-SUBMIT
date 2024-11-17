"use client";

import { signinSchema } from "@/schemas/signin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const SigninForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (formData: z.infer<typeof signinSchema>) => {
    setSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setSubmitting(false);

    if (result?.error) {
      toast.error(result.error.toString());
    }

    if (result?.url) {
      toast.success("Sign in successful");
      router.replace("/u/notebooks");
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="card bg-base-100 w-full shadow-xl">
        <div className="card-body p-6 md:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base text-base-content/85 text-start"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                type="email"
                className="text-sm sm:text-base text-base-content input input-bordered w-full"
                placeholder="Enter your email"
              ></input>
              <p className="text-sm text-error font-medium text-start">
                {errors.email?.message}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base text-base-content/85 text-start"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                {...register("password")}
                placeholder="Enter your password"
                type="password"
                className="text-sm sm:text-base text-base-content input input-bordered w-full"
              />
              <p className="text-sm text-error font-medium text-start">
                {errors.password?.message}
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
  );
};

export default SigninForm;
