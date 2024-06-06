import React from "react";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
export default function HomeLayout({ children }) {
  return (
    <main className="relative">
      <Navbar></Navbar>
      <div className="flex">
        <Sidebar></Sidebar>
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
}
