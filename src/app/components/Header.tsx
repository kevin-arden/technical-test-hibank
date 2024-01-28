"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Header() {
  const [stickyMenu, setStickyMenu] = useState<boolean>(false);
  let token = localStorage ? localStorage.getItem("userData") : null;
  let auth = token ? JSON.parse(token) : null;
  const router = useRouter();
  const handleLogout = () => {
    auth = null;
    localStorage.removeItem("userData");
    router.push("/login");
  };
  return (
    <div className="p-8 flex justify-between border border-b-3">
      <Image src="/logo.svg" alt="main-logo" width={40} height={40} />
      <div className="relative">
        <button onClick={() => setStickyMenu((prev) => !prev)}>
          <Image src={auth.image} alt="avatar-logo" width={40} height={40} />
        </button>
        {stickyMenu ? (
          <div className="absolute border p-4 -left-10 bg-white mt-2">
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
