"use client";

import { useState } from "react";
import { apiLogin } from "@/service/authService";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/authContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [errorLogin, setErrorLogin] = useState<string>("");
  const { setUser } = useUser();
  const router = useRouter();

  // Hàm validate
  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      newErrors.username = "Tài khoản không được để trống.";
    } else if (username.trim().length < 3) {
      newErrors.username = "Tài khoản phải có ít nhất 3 ký tự.";
    }

    if (!password.trim()) {
      newErrors.password = "Mật khẩu không được để trống.";
    } else if (password.trim().length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm đăng nhập
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const loginData = {
      username: username.trimStart(),
      password: password.trimStart(),
    };
    const res = await apiLogin(loginData);
    if (res.success) {
      setUser(res.data.userdata);
      setErrorLogin("");
      router.push("/");
    }
    if (!res.success) {
      const error = res.error as { message: string };
      setErrorLogin(error.message || "Đăng nhập thất bại.");
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-2 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-4 text-center">
        Tài khoản
      </h2>

      <form onSubmit={handleSubmit} className="w-[90%] m-auto text-black">
        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Tài khoản
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="username"
            name="username"
            className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập tài khoản của bạn"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Mật khẩu
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            name="password"
            className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập mật khẩu của bạn"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Login Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-main-color text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Đăng nhập
          </button>
        </div>
        {errorLogin !== "" && (
          <p className="text-red-600 text-center mt-2">{errorLogin}</p>
        )}
      </form>
    </div>
  );
};

export default Login;
