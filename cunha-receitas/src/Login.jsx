import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [wrongLogin, setWrongLogin] = useState(false);

  const navigate = useNavigate();

  const resetStates = () => {
    setUserEmail("");
    setUserPassword("");
  };

  async function login() {
    const res = await fetch("/api/receitas/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
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
    console.log(userEmail, userPassword);
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
          value={userEmail}
          id="email"
          type="text"
          className="border-2 border-black w-[12rem] p-1"
          placeholder="Email..."
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <div className="bg-red-500 w-[12rem]">
          <input
            required={true}
            value={userPassword}
            id="password"
            type={showPassword ? "text" : "password"}
            className="border-2 border-black relative p-1"
            placeholder="Password..."
            onChange={(e) => setUserPassword(e.target.value)}
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
