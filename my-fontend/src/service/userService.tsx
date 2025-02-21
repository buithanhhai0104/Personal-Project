import axios from "axios";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-personal-project.vercel.app";

export const getUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log("Lỗi lấy tất cả người dùng", err);
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(`${apiUrl}/users/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log("Lỗi xóa người dùng", err);
  }
};
