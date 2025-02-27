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
import htmlToDraft from "html-to-draftjs";
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

  useEffect(() => {
    if (currentNews?.content) {
      const blocksFromHtml = htmlToDraft(currentNews?.content || "<p></p>");

      if (blocksFromHtml?.contentBlocks.length > 0) {
        const contentState = ContentState.createFromBlockArray(
          blocksFromHtml.contentBlocks
        );
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        setEditorState(EditorState.createEmpty());
      }
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [currentNews]);

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    const rawContent = convertToRaw(newEditorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContent).trim();

    setCurrentNews((prev) => {
      if (!prev) return null; // Tránh lỗi khi `prev` là null
      return {
        ...prev,
        content:
          htmlContent === "<p></p>" || htmlContent === "" ? "" : htmlContent,
      };
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNewsById(id);
      setNewsData(newsData.filter((news) => news.id !== id));
    } catch (err) {
      console.error("Lỗi xóa bài báo:", err);
    }
  };

  const handleEdit = async (id: number, news: INews) => {
    setEditingId(id);
    if (news) {
      setCurrentNews(news);
    }
    console.log(currentNews);
  };

  const handleSave = async (id: number) => {
    try {
      if (currentNews) {
        await updateNewsById(currentNews, id);
      }
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi cập nhật bài báo:", err);
    }
  };
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách bài báo</h2>
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

              {editingId === news.id && (
                // Form chỉnh sửa bài báo
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
