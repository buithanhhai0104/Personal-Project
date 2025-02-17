import axios from "axios";

export const getUsers = async () => {
  try {
    const response = await axios.get(
      "https://server-personal-project-67d0v7vmx-thanh-hais-projects-0e39a8d1.vercel.app/users",
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    console.log("Lỗi lấy tất cả người dùng", err);
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(
      `https://server-personal-project-67d0v7vmx-thanh-hais-projects-0e39a8d1.vercel.app/users/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    console.log("Lỗi xóa người dùng", err);
  }
};
