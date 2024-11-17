"use client";

import { signupSchema } from "@/schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      photo: null,
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.photo) {
        setProfilePhotoFile(value.photo[0]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const [submitting, setSubmitting] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const router = useRouter();

  const onSubmit = async (formData: z.infer<typeof signupSchema>) => {
    setSubmitting(true);

    if (formData.photo) {
      formData.photo = formData.photo[0];
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });

    try {
      const res = await axios.post("/api/user", data);
      if (res.data.success) {
        toast.success("User created successfully");
        router.replace("/signin");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message ||
            "Somthing went wrong. Please check your internet connection"
        );
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="card bg-base-100 w-full shadow-xl">
        <div className="card-body p-6 md:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base text-base-content/85 text-start">
                Profile Picture{" "}
                <span className="text-xs sm:text-sm text-base-content/75">
                  (Optional)
                </span>
              </label>
              <div className="flex justify-center">
                <label className="cursor-pointer" htmlFor="pofile-photo">
                  <div className="flex justify-center">
                    {profilePhotoFile ? (
                      <div className="avatar">
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full">
                          <Image
                            alt="profile-photo"
                            width={100}
                            height={100}
                            src={URL.createObjectURL(profilePhotoFile)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-neutral/90 text-neutral-content w-20 h-20 md:w-24 md:h-24 rounded-full">
                          <Camera />
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              <input
                className="hidden"
                id="pofile-photo"
                {...register("photo")}
                type="file"
                accept="image/jpeg, image/jpg, image/png"
              />

              <p className="text-sm text-error font-medium text-start">
                {errors.photo?.message && String(errors.photo?.message)}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base text-base-content/85 text-start"
                htmlFor="displayName"
              >
                Name
              </label>
              <input
                id="displayName"
                type="text"
                {...register("displayName")}
                placeholder="Your name"
                className="text-sm sm:text-base text-base-content input input-bordered w-full"
              />
              <p className="text-sm text-error font-medium text-start">
                {errors.displayName?.message}
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

export default SignupForm;
