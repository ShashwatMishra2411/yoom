import React from "react";
import { StreamClientProvider } from "@Providers/StreamClientProvider";
import { TooltipProvider } from "@components/ui/tooltip";
export const metadata = {
  title: "Yoom",
  description: "Real Time Video Meeting Application",
  icons:{
    icon:"/icons/logo.svg"
  }
};
export default function RootLayout({ children }) {
  return (
    <main>
      <StreamClientProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </StreamClientProvider>
    </main>
  );
}
