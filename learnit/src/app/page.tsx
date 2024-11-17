import Image from "next/image";
import Link from "next/link";
import homeDemo from "../../public/home-demo.png";
import { MoveRight } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen px-5 py-8 bg-base-200">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-gray-300 pb-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold text-primary">
            LearnIt
          </h1>
          <div className="flex gap-4">
            <Link href={"/signin"}>
              <button className="btn btn-md btn-primary">Sign In</button>
            </Link>
            <Link className="hidden md:block" href={"/signup"}>
              <button className="btn bg-neutral/10">Sign Up</button>
            </Link>
          </div>
        </header>
        <main>
          <p className="relative text-balance text-center md:text-6xl text-3xl mt-10 bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent font-bold ">
            Organize Notes.
            <br />
            Generate AI Powered Summaries And Quizzes.
            <br />
            Discuss With Others.
          </p>
          <div className="flex justify-center mt-10">
            <Link href={"/signup"}>
              <div className="px-4 py-2 w-max flex gap-2 items-center rounded-full bg-primary bg-opacity-10 hover:bg-opacity-20 transform active:scale-95 transition duration-150">
                <p className="text-primary text-base font-medium">
                  Create Your First Notebook
                </p>
                <MoveRight className="w-5 h-5 text-primary" />
                <i className="shine-btn"></i>
              </div>
            </Link>
          </div>
          <div className="mockup-browser bg-base-content border my-10">
            <div className="mockup-browser-toolbar">
              <div className="input text-base-content">https://learnit.com</div>
            </div>
            <div className="bg-base-300 flex justify-center">
              <Image className="w-full" src={homeDemo} alt="LearnIt Homepage" />
            </div>
          </div>
        </main>
        <footer className="border-t border-gray-300 pt-4 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-xl md:text-3xl font-bold text-primary">
            LearnIt
          </h1>
          <p className="text-base-content mt-2 text-sm md:text-base">
            Copyright &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
