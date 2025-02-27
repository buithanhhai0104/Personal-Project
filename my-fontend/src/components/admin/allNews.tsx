"use client";

import {
  getAllNews,
  deleteNewsById,
  updateNewsById,
} from "@/service/newsService";
import { INews } from "@/types/news";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
const AllNews = () => {
  const [newsData, setNewsData] = useState<INews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentNews, setCurrentNews] = useState<INews | null>(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [changeImage, setChangeImage] = useState<boolean>(false);
  // Lấy danh sách tất cả bài báo
  const fetchNews = async () => {
    try {
      const res = await getAllNews();
      if (res && res.data) {
        setNewsData(res.data);
      } else {
        throw new Error("Không có dữ liệu bài báo.");
      }
    } catch (err) {
      setError("Lỗi lấy dữ liệu tất cả bài báo.");
      console.error("Lỗi lấy dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // để hiển thị chỉnh sửa content theo kiểu editor text
  useEffect(() => {
    if (currentNews?.content) {
      import("html-to-draftjs").then(({ default: htmlToDraft }) => {
        const blocksFromHtml = htmlToDraft(currentNews.content || "<p></p>");
        const contentState = ContentState.createFromBlockArray(
          blocksFromHtml.contentBlocks
        );
        setEditorState(EditorState.createWithContent(contentState));
      });
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [currentNews?.content]);

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    const rawContent = convertToRaw(newEditorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContent).trim();

    setCurrentNews((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        content:
          htmlContent === "<p></p>" || htmlContent === "" ? "" : htmlContent,
      };
    });

    if (htmlContent === "<p></p>" || htmlContent === "") {
      setEditorState(EditorState.createEmpty());
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentNews({ ...currentNews!, image: file });
    }
  };

  // xóa bài báo
  const handleDelete = async (id: number) => {
    try {
      await deleteNewsById(id);
      setNewsData(newsData.filter((news) => news.id !== id));
    } catch (err) {
      console.error("Lỗi xóa bài báo:", err);
    }
  };

  // Mở chế độ chỉnh sửa
  const handleEdit = async (id: number, news: INews) => {
    setEditingId(id);
    if (news) {
      setCurrentNews(news);
    }
    console.log(currentNews);
  };

  // Lưu chỉnh sửa
  const handleSave = async (id: number) => {
    try {
      if (currentNews) {
        const res = await updateNewsById(currentNews, id);
        if (res) {
          setEditingId(null);
          fetchNews();
        }
      }
    } catch (err) {
      console.error("Lỗi cập nhật bài báo:", err);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-semibold text-blue-800 p-5">
        Danh sách bài báo
      </h2>
      {newsData.length === 0 ? (
        <p>Không có bài báo nào.</p>
      ) : (
        <ul className="space-y-4">
          {newsData.map((news) => (
            <li
              key={news.id}
              className="border p-4 rounded-lg shadow flex flex-col text-black"
            >
              <div className=" flex items-center justify-start text-black gap-4">
                <Image
                  className="rounded-xl shadow-custom h-[120px]"
                  src={
                    typeof news.image === "string"
                      ? news.image
                      : "/images/logo.png"
                  }
                  alt={news.title || "Ảnh bài báo"}
                  width={200}
                  height={100}
                />
                <p className=" flex-1 text-sm line-clamp-2">{news.title}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (news.id) {
                        handleEdit(news.id, news);
                      }
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => {
                      if (news.id) {
                        handleDelete(news.id);
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              {/* {form chỉnh sửa bài báo} */}
              {editingId === news.id && (
                <div className="w-[90%] m-auto p-3 text-black flex flex-col gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">
                      Tiêu đề bài báo:
                    </label>
                    <input
                      type="text"
                      value={currentNews?.title || ""}
                      onChange={(e) =>
                        setCurrentNews({
                          ...currentNews!,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700">
                      Nội dung:
                    </label>
                    <div className="border rounded-md p-4 text-black">
                      <Editor
                        editorState={editorState}
                        onEditorStateChange={handleEditorChange}
                        placeholder="Nhập nội dung bài báo"
                      />
                    </div>
                  </div>
                  <button onClick={() => setChangeImage((prev) => !prev)}>
                    {" "}
                    Chỉnh sửa ảnh{" "}
                  </button>
                  {changeImage ? (
                    <div>
                      <label className="block text-gray-600 font-medium mb-2">
                        Tải ảnh lên
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        if (news.id) {
                          handleSave(news.id);
                        }
                      }}
                      className="w-full px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setCurrentNews(null);
                      }}
                      className="w-full px-4 py-2 rounded-full text-white bg-gray-500 hover:bg-gray-600 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllNews;
