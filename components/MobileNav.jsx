"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import cn from "classnames";
import { sidebarLinks } from "@constants";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function MobileNav() {
  const pathName = usePathname();
  return (
    <section className="w-full max-w-[264px] text-white">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            width={36}
            height={36}
            alt="hamburr icon"
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-dark-1">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/icons/logo.svg"
              width={32}
              height={32}
              alt="Yoom logo"
              className="max-sm:size-10"
            ></Image>
            <p className="text-[26px] font-extrabold text-white">
              Yoom
            </p>
          </Link>
          <div className="flex flex-col justify-between overflow-y-auto h-[calc(100vh-72px)]">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((link) => {
                  const isActive =
                    pathName === link.route ||
                    pathName.startsWith(`${link.route}/`);
                  return (
                    <SheetClose asChild key={link.route}>
                      <Link
                        key={link.label}
                        href={link.route}
                        // cn is used for dynamic classnames
                        className={cn(
                          "flex gap-4 itmes-center p-4 rounded-lg max-w-60",
                          {
                            "bg-blue-1": isActive,
                          }
                        )}
                      >
                        <Image
                          width={20}
                          height={20}
                          alt="Icon"
                          src={link.imgUrl}
                        />
                        <p className="font-semibold">{link.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
