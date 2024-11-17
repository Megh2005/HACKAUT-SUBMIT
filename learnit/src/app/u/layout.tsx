"use client";

import AppWrapper from "@/components/AppWrapper";
import StoreProvider from "@/components/StoreProvider";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <StoreProvider>
        <QueryClientProvider client={queryClient}>
          <AppWrapper>{children}</AppWrapper>
        </QueryClientProvider>
      </StoreProvider>
    </SessionProvider>
  );
}
