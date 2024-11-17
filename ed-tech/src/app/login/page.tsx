import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-base-100 ">
      <div className="p-4 md:p-6">
        <h1 className="my-4 text-primary text-center text-2xl lg:text-3xl font-bold">
          Login to आत्मनिर्भर ++
        </h1>
        <LoginForm />
        <p className="text-center text-base-content my-4 font-medium">
          Don&apos;t have an account?{" "}
          <Link className="text-primary" href={"/signup"}>
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
