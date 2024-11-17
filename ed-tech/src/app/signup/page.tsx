import SignupForm from "@/components/SignupForm";
import Link from "next/link";
import React from "react";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-base-100">
      <div className="p-4 md:p-6">
        <h1 className="my-4 text-primary text-center text-2xl lg:text-3xl font-bold">
          Signup for आत्मनिर्भर ++
        </h1>
        <SignupForm />
        <p className="text-center text-base-content my-4 font-medium">
          Already a user?{" "}
          <Link className="text-primary" href={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
