import React from "react";
import Image from "next/image";
export default function Loader() {
  return (
    <div className="flex flex-center min-h-screen w-full">
      <Image width={50} height={50} src="/icons/loading-circle.svg" alt="Loading..."></Image>
    </div>
  );
}
