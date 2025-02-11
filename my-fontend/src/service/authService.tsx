import axios, { AxiosError } from "axios";
interface ILoginData {
  username: string;
  password: string;
}

interface IRegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
}

export const apiLogin = async (loginData: ILoginData) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/auth/login",
      loginData,
      {
        withCredentials: true, // Gửi cookie với request
      }
    );
    return {
      success: true,
      data: response.data, // Trả về dữ liệu từ API
    };
  } catch (error) {
    // Kiểm tra lỗi Axios
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.response?.data || "Lỗi không xác định từ server",
      };
    }

    // Xử lý các lỗi khác (không phải Axios)
    return {
      success: false,
      error: "Đã xảy ra lỗi không xác định",
    };
  }
};
export const apiRegister = async (registerData: IRegisterData) => {
  try {
    const respone = await axios.post(
      "http://localhost:4000/auth/register",
      registerData,
      {
        withCredentials: true,
      }
    );
    return respone.data;
  } catch (err) {
    console.log(err);
  }
};
export const apiLogout = async () => {
  try {
    const respone = await axios.post(
      "http://localhost:4000/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    return respone.data;
  } catch (err) {
    console.log("Lỗi đăng xuất", err);
  }
};

export const getUser = async () => {
  try {
    const response = await axios.get("http://localhost:4000/userinfo", {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log("Xác thực không thành công", err);
  }
};
