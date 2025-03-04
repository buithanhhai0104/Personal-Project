"use client";
import { INews } from "@/types/news";
import React, { useState, useEffect } from "react";
import { getAllNews } from "@/service/newsService";
import Image from "next/image";
import { GrNext } from "react-icons/gr";
import { useRouter } from "next/navigation";
const RelatedNews: React.FC = () => {
  const [newsAll, setNewsAll] = useState<INews[] | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchNewsAll = async () => {
      try {
        const res = await getAllNews();
        setNewsAll(res.data);
      } catch (err) {
        console.log("Lỗi khi lấy dữ liệu của tất cả news", err);
      }
    };
    fetchNewsAll();
  }, []);
  const handleAllNews = () => {
    router.push("/news");
  };
  const handleGetNewsById = (newsId: number, newsTitle: string) => {
    const unsignedTitle = newsTitle
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const formattedTitle = unsignedTitle
      .replace(/\s+/g, "-")
      .toLocaleLowerCase();
    const slug = `${formattedTitle}-${newsId}`;
    router.push(`/news/${slug}`);
  };
  return (
    <div className="flex flex-col">
      <div className="flex my-4 justify-center items-center gap-5">
        <h2 className="text-3xl text-[#00613d]">Tin tức liên quan</h2>
        <div className="h-[2px] mt-1 w-full flex-1 bg-[#00613d]"></div>
        <button
          onClick={handleAllNews}
          className="text-[#ef5222] flex justify-center items-center gap-1"
        >
          Xem tất cả <GrNext />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  p-2">
        {newsAll?.slice(0, 4).map((news) => {
          const formattedDate = news.created_at
            ? new Date(news.created_at).toLocaleDateString("vi-VN")
            : "";
          return (
            <div
              className="flex flex-col gap-3 sm:flex-row cursor-pointer shadow-custom p-2 rounded-xl"
              onClick={() => {
                if (news.id !== undefined) {
                  handleGetNewsById(news.id, news.title);
                }
              }}
              key={news.id}
            >
              <div className=" relative w-full h-[190px]">
                <Image
                  className="rounded-xl shadow-custom"
                  src={
                    typeof news.image === "string"
                      ? news.image
                      : "/images/logo.png"
                  }
                  layout="fill"
                  objectFit="cover"
                  alt={news.title}
                />
              </div>
              <div className="flex flex-col w-[100%] sm:w-[70%] text-sm leading-loose">
                <h3 className="line-clamp-2 overflow-hidden text-ellipsis font-semibold">
                  {news.title}
                </h3>
                <p className="line-clamp-3 overflow-hidden text-ellipsis text-[#637280]">
                  {news.content}
                </p>
                <p className="text-sm text-[#637280]">
                  Ngày đăng: {formattedDate}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedNews;
