import axios from "axios";

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

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-personal-project.vercel.app";

export const apiLogin = async (loginData: ILoginData) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, loginData, {
      withCredentials: true,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data || "Lỗi từ server",
      };
    }

    return {
      success: false,
      error: "Đã xảy ra lỗi không xác định",
    };
  }
};

export const apiRegister = async (registerData: IRegisterData) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/register`, registerData, {
      withCredentials: true,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data || "Lỗi từ server",
      };
    }

    return {
      success: false,
      error: "Đã xảy ra lỗi không xác định",
    };
  }
};

export const apiLogout = async () => {
  try {
    const response = await axios.post(
      `${apiUrl}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);

    return {
      success: false,
      error: "Đăng xuất thất bại",
    };
  }
};

export const getUser = async () => {
  try {
    const response = await axios.get(`${apiUrl}/userinfo`, {
      withCredentials: true,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Xác thực không thành công:", error);

    return {
      success: false,
      error: "Không thể lấy thông tin người dùng",
    };
  }
};
