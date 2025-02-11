"use client";
import { apiRegister } from "@/service/authService";

import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Email không hợp lệ.";
    }
    if (!fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống.";
    }
    if (!username.trim()) {
      newErrors.username = "Tài khoản không được để trống.";
    } else if (username.length < 4) {
      newErrors.username = "Tài khoản phải có ít nhất 4 ký tự.";
    }
    if (!password || !passwordRegex.test(password)) {
      newErrors.password =
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const registerData = {
      name: fullName,
      email: email,
      username: username,
      password: password,
    };

    try {
      const register = await apiRegister(registerData);
      console.log("Đăng ký thành công:", register);
    } catch (err) {
      console.log("Lỗi đăng ký:", err);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-2 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800  mb-4 mt-4 text-center">
        Đăng ký
      </h2>

      <form onSubmit={handleRegister} className="w-[90%] m-auto text-black">
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập email của bạn"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="full-name"
            className="block text-sm font-medium text-gray-700"
          >
            Họ và tên
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            id="full-name"
            name="full-name"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="account"
            className="block text-sm font-medium text-gray-700"
          >
            Tài khoản
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="account"
            name="account"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập tài khoản của bạn"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập mật khẩu của bạn"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-main-color text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
