"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import {
  getAllNews,
  deleteNewsById,
  updateNewsById,
} from "@/service/newsService";
import { INews } from "@/types/news";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-toastify/dist/ReactToastify.css";

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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getAllNews();
        if (res?.data) {
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
    fetchNews();
  }, []);

  console.log(newsData);
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

    setCurrentNews((prev) =>
      prev ? { ...prev, content: htmlContent || "" } : null
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentNews((prev) => (prev ? { ...prev, image: file } : null));
      setChangeImage(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNewsById(id);
      setNewsData((prev) => prev.filter((news) => news.id !== id));
    } catch (err) {
      console.error("Lỗi xóa bài báo:", err);
    }
  };

  const handleEdit = (id: number, news: INews) => {
    setEditingId(id);
    setCurrentNews(news);
  };

  const handleSave = async (id: number) => {
    if (!currentNews) return;
    try {
      const updatedNews = {
        ...currentNews,
        image: changeImage
          ? currentNews.image
          : newsData.find((n) => n.id === id)?.image,
      };
      await updateNewsById(updatedNews, id);
      setEditingId(null);
      setChangeImage(false);
      setCurrentNews(null);
      setLoading(true);
      await getAllNews().then((res) => res?.data && setNewsData(res.data));
    } catch (err) {
      console.error("Lỗi cập nhật bài báo:", err);
    } finally {
      setLoading(false);
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
              className="border p-4 rounded-lg shadow text-black"
            >
              <div className="flex items-center justify-between gap-4">
                <Image
                  className="rounded-xl shadow h-[120px]"
                  src={
                    typeof news.image === "string"
                      ? news.image
                      : "/images/logo.png"
                  }
                  alt={news.title || "Ảnh bài báo"}
                  width={200}
                  height={100}
                />
                <p className="flex-1 text-sm line-clamp-2">{news.title}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (news.id) handleEdit(news.id, news);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      if (news.id) handleDelete(news.id);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              {editingId === news.id && (
                <div className="p-3 flex flex-col gap-4">
                  <input
                    type="text"
                    value={currentNews?.title || ""}
                    onChange={(e) =>
                      setCurrentNews((prev) =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  />
                  <div className="border p-4">
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={handleEditorChange}
                      placeholder="Nhập nội dung bài báo"
                    />
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 border rounded-md"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        if (news.id) handleSave(news.id);
                      }}
                      className="w-full p-2 rounded bg-blue-500 text-white"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setCurrentNews(null);
                      }}
                      className="w-full p-2 rounded bg-gray-500 text-white"
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
