import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import {
  BriefcaseBusiness,
  GraduationCap,
  Heart,
  HomeIcon,
  MessageCircleHeart,
  PenBox,
  UserRoundCheck,
} from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dlf6jkg3d/image/upload/v1725363398/job-mitra_ofeq8o.png"
            className="h-20"
            alt="Logo"
          />
        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button variant="destructive" onClick={() => setShowSignIn(true)}>
              Sign In
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2" />
                  Post an Internship
                </Button>
              </Link>
            )}
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link target="_blank" to="https://hr-at-tjp.streamlit.app/">
                <Button variant="destructive" className="rounded-full">
                  <UserRoundCheck size={20} className="mr-2" />
                  AI HR
                </Button>
              </Link>
            )}
            {/* {user?.unsafeMetadata?.role === "candidate" && (
              <Link
                to="http://localhost:3000/analyze-resume"
                target="_blank"
              >
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2" />
                  Analyze Resume
                </Button>
              </Link>
            )} */}
            {/* {user?.unsafeMetadata?.role === "candidate" && (
              <Link to="https://sanlap.vercel.app">
                <Button variant="destructive" className="rounded-full">
                  <MessageCircleHeart size={20} className="mr-2" /> Chat With
                  Expert
                </Button>
              </Link>
            )} */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
                <UserButton.Link
                  label="Home"
                  href="/"
                  labelIcon={<HomeIcon size={15} />}
                />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
