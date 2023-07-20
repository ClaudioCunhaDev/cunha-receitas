import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const userEmailRef = useRef();
  const userPasswordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [wrongLogin, setWrongLogin] = useState(false);

  const navigate = useNavigate();

  const resetStates = () => {
    userEmailRef.current.value = "";
    userPasswordRef.current.value = "";
  };

  async function login() {
    const res = await fetch("/api/receitas/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmailRef.current.value,
        password: userPasswordRef.current.value,
      }),
    });
    const data = await res.json();
    if (res.status === 400) {
      setWrongLogin(true);
    } else {
      console.log(data);
      localStorage.setItem("Receitas - UserToken", data.token);
      setWrongLogin(false);
      navigate("/");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    resetStates();
    login();
  };

  return (
    <div className="pt-[10vh] flex justify-center">
      <form
        className="flex flex-col gap-3 border-2 p-3 mt-10 min-w-[20rem] max-w-[20rem] items-center"
        onSubmit={handleSubmit}
      >
        <label htmlFor="email">Email</label>
        <input
          required={true}
          ref={userEmailRef}
          id="email"
          type="text"
          className="border-2 border-black w-[12rem] p-1"
          placeholder="Email..."
        />
        <label htmlFor="password">Password</label>
        <div className="bg-red-500 w-[12rem]">
          <input
            ref={userPasswordRef}
            required={true}
            id="password"
            type={showPassword ? "text" : "password"}
            className="border-2 border-black relative p-1"
            placeholder="Password..."
          />
          <button
            type="button"
            className="absolute border-2 border-black p-1"
            onClick={() => setShowPassword((prv) => !prv)}
          >
            {showPassword ? "🔓" : "🔒"}
          </button>
        </div>
        <button className="border-2 border-gray-300 w-[12rem] p-3 hover:bg-gray-300 transition duration-300  font-bold">
          Submit
        </button>
      </form>
    </div>
  );
};
