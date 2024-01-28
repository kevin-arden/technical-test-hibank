"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

export default function SideMenu() {
  const [menu, setMenu] = useState<boolean>(false);
  const currentRoute = usePathname();

  return (
    <div className=" w-[20%] h-svh border-r items-center p-8">
      <h1 className="text-xl mb-4">Menu</h1>
      <div className="flex flex-col">
        <Link
          className={`${
            currentRoute === "/" ? "bg-blue-500 text-white " : ""
          } p-4`}
          href="/"
        >
          Users
        </Link>
        <Link
          className={`${
            currentRoute === "/menu-2" ? "bg-blue-500 text-white " : ""
          } p-4`}
          href="/menu-2"
        >
          Menu 2
        </Link>
        <button
          className="text-start p-4"
          onClick={() => setMenu((prev) => !prev)}
        >
          <p>Menu 3</p>
        </button>
        {menu ? (
          <Link
            className={`pl-8 p-4 ${
              currentRoute === "/menu-3" ? "bg-blue-500 text-white " : ""
            }`}
            href="/menu-3"
          >
            Sub Menu 3
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
