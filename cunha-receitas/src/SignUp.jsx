import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [wrongSignUp, setWrongSignUp] = useState(false);

  const navigate = useNavigate();

  const resetStates = () => {
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserConfirmPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userPassword === userConfirmPassword) {
      console.log(userName, userEmail, userPassword, userConfirmPassword);
      setWrongPassword(false);
      signup();
    } else {
      setWrongPassword(true);
    }
  };

  async function signup() {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        password: userPassword,
        confirmPassword: userConfirmPassword,
      }),
    });
    const data = await res.json();
    if (res.status === 400) {
      setWrongSignUp(true);
    } else {
      resetStates();
      setWrongSignUp(false);
      navigate("/login");
      return data;
    }
  }

  return (
    <div className="pt-[10vh] flex justify-center">
      <form
        className="flex flex-col mt-10 gap-3 border-2 p-3 min-w-[20rem] max-w-[20rem] items-center"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Name</label>
        <input
          required={true}
          value={userName}
          id="name"
          type="text"
          className="border-2 border-black w-[12rem] p-1"
          placeholder="Name..."
          onChange={(e) => setUserName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          required={true}
          value={userEmail}
          id="email"
          type="email"
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
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="bg-red-500 w-[12rem]">
          <input
            required={true}
            value={userConfirmPassword}
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className="border-2 border-black relative p-1"
            placeholder="Confirm Password..."
            onChange={(e) => setUserConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute border-2 border-black p-1"
            onClick={() => setShowConfirmPassword((prv) => !prv)}
          >
            {showConfirmPassword ? "🔓" : "🔒"}
          </button>
        </div>
        {wrongPassword && (
          <label className="text-red-500">Wrong password</label>
        )}
        {wrongSignUp && (
          <div className="p-1 border-b-2 text-red-500 border-red-500">
            User Exists
          </div>
        )}
        <button className="border-2 border-gray-300 w-[12rem] p-3 hover:bg-gray-300 transition duration-300  font-bold">
          Submit
        </button>
      </form>
    </div>
  );
};
