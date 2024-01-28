"use client";
import React from "react";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";

export default function Menu3() {
  let token = localStorage ? localStorage.getItem("userData") : null;
  let auth = token ? JSON.parse(token) : null;

  return (
    <>
      {auth ? (
        <>
          <Header />
          <div className="flex">
            <SideMenu />
            <div className="">Menu 3</div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
