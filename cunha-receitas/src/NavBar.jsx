import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const NavBar = () => {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("Receitas - UserToken"))
  );
  useEffect(() => {
    setInterval(() => {
      setLoggedIn(Boolean(localStorage.getItem("Receitas - UserToken")));
    }, 100);
  }, []);
  return (
    <header className="bg-black text-white w-full flex justify-center items-center h-[10vh] text-[1.2rem] fixed z-20">
      {!loggedIn ? (
        <nav className="flex gap-3">
          <Link to="/">
            <p>Home</p>
          </Link>
          <Link to="/login">
            <p>Login</p>
          </Link>
          <Link to="/signup">
            <p>Sign Up</p>
          </Link>
        </nav>
      ) : (
        <nav className="flex gap-3">
          <Link to="/">
            <p>Home</p>
          </Link>
          <Link to="/">
            <p onClick={() => localStorage.removeItem("Receitas - UserToken")}>
              Logout
            </p>
          </Link>
        </nav>
      )}
    </header>
  );
};
