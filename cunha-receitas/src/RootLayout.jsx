import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

export const RootLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};
