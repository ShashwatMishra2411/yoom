"use client";

import { sidebarLinks } from "@constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import cn from "classnames";
import Image from "next/image";

export default function Sidebar() {
  const pathName = usePathname();
  return (
    <section className="sticky left-0 top-0 flex min-h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((link) => {
          const isActive =
            pathName === link.route || pathName.startsWith(`${link.route}/`);
          return (
            <Link
              key={link.label}
              href={link.route}
              // cn is used for dynamic classnames
              className={cn(
                "flex gap-4 itmes-center p-4 rounded-lg justify-start",
                {
                  "bg-blue-1": isActive,
                }
              )}
            >
              <Image width={30} height={30} alt="Icon" src={link.imgUrl}/>
              <p className="text-lig font-semibold max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
