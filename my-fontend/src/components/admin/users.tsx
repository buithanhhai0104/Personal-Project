"user client";

import { deleteUser, getUsers } from "@/service/userService";
import { IUser } from "@/types/user";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../loadingSpinner";

const Users: React.FC = () => {
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res);
    } catch (err) {
      console.log("Không lấy được thông tin người dùng", err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: IUser) => {
    setEditMode(true);
    setCurrentUser(user);
  };
  const handleDeleteUser = async (id: number) => {
    try {
      const res = await deleteUser(id);
      if (res) {
        alert("Xóa người dùng thành công");
        fetchUsers();
      }
    } catch (err) {
      console.log("xóa người dùng thất bại", err);
    }
  };

  if (!users) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
          <p className="text-gray-600 text-lg">
            <LoadingSpinner />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-10 px-5 py-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-semibold text-blue-800">
          Danh sách người dùng
        </h2>
        <button className="px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors">
          Thêm người dùng
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {users.map((user, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow transform overflow-hidden"
          >
            <div className="p-5 flex items-center justify-between gap-5">
              {/* Tên người dùng */}
              <div className="flex flex-1 flex-col text-black">
                <span className="text-lg font-semibold">{user.name}</span>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex flex-1 gap-1 items-start text-gray-600">
                <span>Tên tài khoản:</span>
                {user.username}
              </div>
              {/* Vai trò */}
              <div className="text-gray-700 ">
                Vai trò: <span className="font-medium">{user.role}</span>
              </div>

              {/* Ngày tham gia */}
              <div className="flex gap-1 items-start text-gray-600">
                <span>Ngày tham gia:</span>
                {new Date(user.ngay_tao).toLocaleDateString("vi-VN")}
              </div>

              {/* Nút hành động */}
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(user)}
                  className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-colors"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>

            {/* Chế độ chỉnh sửa */}
            {editMode && currentUser?.id === user.id && (
              <div className="w-[90%] m-auto p-3 text-black flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-gray-700">
                    Tên người dùng:
                  </label>
                  <input
                    type="text"
                    value={currentUser?.name}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser!, name: e.target.value })
                    }
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Email:</label>
                  <input
                    type="email"
                    value={currentUser?.email}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser!, email: e.target.value })
                    }
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Vai trò:
                  </label>
                  <input
                    type="text"
                    value={currentUser?.role}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser!, role: e.target.value })
                    }
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    // onClick={() => handleSave(user.id)}
                    className="w-full px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="w-full px-4 py-2 rounded-full text-white bg-gray-500 hover:bg-gray-600 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
