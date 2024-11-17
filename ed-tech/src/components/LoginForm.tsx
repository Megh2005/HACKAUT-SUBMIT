"use client";

import { loginSchema } from "@/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    setSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
    }

    if (result?.ok) {
      toast.success("Logged in successfully");
      router.replace("/u/home");
    }
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
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
