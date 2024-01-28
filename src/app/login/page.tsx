"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "../components/Button";

type LoginInput = {
  username: string;
  password: string;
};

export default function Login() {
  const [userPass, setUserPass] = useState<LoginInput>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userPass.username,
        password: userPass.password,
        // expiresInMins: 60, // optional
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          setError("Login Failed");
          return Promise.reject(res);
        }
      })
      .then((data) => localStorage.setItem("userData", JSON.stringify(data)))
      .then(() => router.push("/"));

    setLoading(false);
  };

  return (
    <main className="h-screen flex flex-row items-center justify-center">
      <div className="flex flex-col items-center justify-between h-[50%] border border-gray-400 p-16 rounded-3xl">
        <Image src="/logo.svg" alt="main-logo" width={40} height={40} />
        <div className="flex flex-col gap-y-2">
          <input
            id="username"
            type="text"
            value={userPass.username}
            onChange={(e) => {
              setUserPass({ ...userPass, username: e.target.value });
              setError("");
            }}
            placeholder="Username"
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />
          <input
            id="password"
            type="password"
            value={userPass.password}
            onChange={(e) => {
              setUserPass({ ...userPass, password: e.target.value });
              setError("");
            }}
            placeholder="Password"
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-y-2 items-center">
          <Button onClick={() => handleLogin()}>
            {loading ? "Loading" : "Login"}
          </Button>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    </main>
  );
}
