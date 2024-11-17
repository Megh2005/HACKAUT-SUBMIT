import Navbar from "@/components/Navbar";
import React from "react";

const PaymentStatusLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      {children}
    </div>
  );
};

export default PaymentStatusLayout;
