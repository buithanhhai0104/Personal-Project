import axios from "axios";

export const getUsers = async () => {
  try {
    const response = await axios.get("http://localhost:4000/users", {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log("Lỗi lấy tất cả người dùng", err);
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(`http://localhost:4000/users/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log("Lỗi xóa người dùng", err);
  }
};
