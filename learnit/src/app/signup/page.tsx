import SignupForm from "@/components/SignupForm";
import Link from "next/link";

const SignupPage = () => {
  return (
    <div className="min-h-screen px-5 md:px-10 lg:px-16 py-8 bg-base-200 w-full">
      <header className="mx-auto max-w-7xl">
        <Link href={"/"}>
          <h1 className="text-2xl md:text-4xl font-bold text-primary">
            LearnIt
          </h1>
        </Link>
      </header>
      <div className="mx-auto w-full max-w-lg">
        <main className="text-center mt-6">
          <SignupForm />
          <div>
            <p className="mt-4 text-base-content">
              Already have an account?{" "}
              <Link className="text-primary font-medium" href="/signin">
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignupPage;
