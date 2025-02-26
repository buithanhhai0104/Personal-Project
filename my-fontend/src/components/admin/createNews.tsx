import React, { useState, useRef, useEffect } from "react";
import { EditorState } from "draft-js";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiCreateNews } from "@/service/newsService";
import Image from "next/image";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
interface INews {
  id?: string;
  title: string;
  content: string;
  created_at: string;
  image: string | File;
}

const CreateNews: React.FC = () => {
  const [formData, setFormData] = useState<INews>({
    title: "",
    content: "",
    created_at: "",
    image: "",
  });

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (state: EditorState) => {
    if (!isMounted.current) return;
    setEditorState(state);
    setFormData((prev) => ({
      ...prev,
      content: state.getCurrentContent().getPlainText(),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("created_at", formData.created_at);

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    setLoading(true);
    try {
      const response = await apiCreateNews(data);
      if (response.success) {
        alert("Bài báo đã tạo thành công");
        toast.success("Bài báo đã được tạo thành công!");
      } else {
        toast.error(response.error || "Lỗi khi tạo bài báo!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md text-black">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        Tạo bài báo mới
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-gray-600 font-medium mb-2"
          >
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tiêu đề bài báo"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-2">
            Nội dung
          </label>
          <div className="border rounded-md p-4 text-black">
            <Editor
              editorState={editorState}
              onEditorStateChange={handleEditorChange}
              placeholder="Nhập nội dung bài báo"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="created_at"
            className="block text-gray-600 font-medium mb-2"
          >
            Ngày tạo
          </label>
          <input
            type="date"
            id="created_at"
            name="created_at"
            value={formData.created_at}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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

        {formData.image && typeof formData.image === "string" && (
          <Image
            src={formData.image}
            alt={formData.title || "Ảnh tin tức"}
            width={500}
            height={300}
            unoptimized
          />
        )}

        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo bài báo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNews;
