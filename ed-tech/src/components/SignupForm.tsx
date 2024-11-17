"use client";

import { signup } from "@/actions/signup";
import { signupSchema } from "@/schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setSubmitting(true);

    const res = await signup(data);

    if (res?.status === "SUCCESS") {
      toast.success(res.message);
      router.replace("/login");
    } else {
      toast.error(res?.message || "An error occurred");
    }

    setSubmitting(false);
  };

  return (
    <div className="mx-auto w-full max-w-xl text-base-content">
      <div className="card bg-neutral w-full shadow-xl">
        <div className="card-body p-4 sm:p-6 md:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base text-base-content/85 text-start"
                htmlFor="first-name"
              >
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                {...register("firstName")}
                placeholder="Your first name"
                className="text-sm sm:text-base bg-neutral border border-neutral-content text-base-content input input-bordered w-full"
              />
              <p className="text-sm text-error font-medium text-start">
                {errors.firstName?.message}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base text-base-content/85 text-start"
                htmlFor="last-name"
              >
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                {...register("lastName")}
                placeholder="Your last name"
                className="text-sm sm:text-base bg-neutral border border-neutral-content text-base-content input input-bordered w-full"
              />
              <p className="text-sm text-error font-medium text-start">
                {errors.lastName?.message}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base text-base-content/85 text-start"
                htmlFor="join-as"
              >
                Joining as a
              </label>
              <select
                {...register("role")}
                id="join-as"
                defaultValue="learner"
                className="select select-bordered w-full max-w-xs bg-neutral border border-neutral-content"
              >
                <option value="creator">Creator</option>
                <option value="learner">Learner</option>
              </select>
              <p className="text-sm text-error font-medium text-start">
                {errors.role?.message}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base text-base-content/85 text-start"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="text-sm sm:text-base text-base-content input input-bordered w-full bg-neutral border border-neutral-content"
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
                className="text-sm sm:text-base text-base-content input input-bordered w-full bg-neutral border border-neutral-content"
              />
              <p className="text-sm text-error font-medium text-start">
                {errors.password?.message}
              </p>
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="btn btn-secondary"
            >
              {submitting ? (
                <LoaderCircle className="animate-spin text-primary w-6 h-6 mr-2" />
              ) : null}
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
