"use client";

import Navbar from "@/components/Navbar";
import NavbarMobileBottom from "@/components/NavbarMobileBottom";
import { setUserDetails } from "@/lib/store/features/user.slice";
import { useAppDispatch } from "@/lib/store/hooks";
import { getCurrentUser } from "@/queries/user.queries";
import { useQuery } from "react-query";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useQuery({
    queryKey: ["user-details"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    onSuccess(data) {
      dispatch(setUserDetails(data?.data));
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Navbar />
      <div className="bg-base-200 flex-1 md:flex-0 flex flex-col pb-10 md:pb-0">
        {children}
      </div>
      <NavbarMobileBottom />
    </div>
  );
};

export default AppWrapper;
