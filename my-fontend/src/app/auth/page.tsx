"use client";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import { useState } from "react";

const Auth: React.FC = () => {
  const [form, setform] = useState<string>("Register");
  const handleSetForm = () => {
    if (form === "Login") {
      setform("Register");
    } else {
      setform("Login");
    }
  };
  return (
    <div className=" w-[90%] m-auto flex justify-center items-center bg-login-background h-[100vh]">
      <div className=" w-96 flex flex-col justify-center items-center shadow-custom bg-white rounded-lg">
        {form === "Register" ? <Login /> : <Register />}
        <button
          className="text-blue-400 underline text-xl p-2 "
          onClick={handleSetForm}
        >
          {form}
        </button>
      </div>
    </div>
  );
};

export default Auth;
