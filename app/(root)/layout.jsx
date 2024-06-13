import React from "react";
import { StreamClientProvider } from "@Providers/StreamClientProvider";

export default function RootLayout({ children }) {
  return (
    <main>
      <StreamClientProvider> {children}</StreamClientProvider>
    </main>
  );
}
