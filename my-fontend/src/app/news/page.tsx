"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Allnews from "@/components/news/allnews";
import { useRouter } from "next/navigation";
import { INews } from "@/types/news";
import LoadingSpinner from "@/components/loadingSpinner";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-personal-project.vercel.app";

export default function NewsPage() {
  const router = useRouter();
  const [newsData, setNewsData] = useState<INews[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setIsLoading(true);
      try {
        const getNews = await fetch(`${apiUrl}/news`);
        const data: INews[] = await getNews.json();
        setNewsData(data);
      } catch (error) {
        console.error("Lỗi khi tải tin tức:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, []);

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
    <div className="mt-20 mb-10 w-[90%] sm:w-[70%] m-auto text-black">
      <div className="flex justify-center items-center gap-5">
        <h2 className="text-3xl text-[#00613d] p-5">Tin tức nổi bật</h2>
        <div className="h-[2px] mt-1 w-full flex-1 bg-[#00613d]"></div>
      </div>

      {/* Hiển thị spinner khi đang tải */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-5">
            <div className="flex cursor-pointer flex-col col-span-4 row-span-2 sm:col-span-2">
              <div className="flex w-full flex-col shadow-custom p-5 rounded-xl">
                {newsData.length > 0 && (
                  <Image
                    className="rounded-xl shadow-custom"
                    src={
                      typeof newsData[0].image === "string"
                        ? newsData[0].image
                        : "/images/logo.png"
                    }
                    alt={newsData[0]?.title || "News Image"}
                    width={100}
                    height={100}
                    layout="responsive"
                  />
                )}
                <h2 className="line_clamp font-medium text-[#111111] hover:opacity-90 mt-5 text-xl leading-6">
                  {newsData[0]?.title || "News Title"}
                </h2>
              </div>
            </div>

            {newsData.slice(1, 5).map((news, index) => {
              const date = new Date(news.created_at);
              const formattedDate = date.toLocaleDateString("vi-VN");
              return (
                <div
                  onClick={() => {
                    if (news.id !== undefined) {
                      handleGetNewsById(news.id, news.title);
                    }
                  }}
                  key={index}
                  className="flex cursor-pointer flex-col col-span-2 sm:col-span-1 shadow-custom p-2 rounded-xl"
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
                  <div className="flex flex-col">
                    <p className="text-sm font-bold overflow-hidden line-clamp-2 my-3">
                      {news.title}
                    </p>
                    {formattedDate}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center items-center gap-5">
            <h2 className="text-3xl text-[#00613d] p-5">Tất cả tin tức</h2>
            <div className="h-[2px] mt-1 w-full flex-1 bg-[#00613d]"></div>
          </div>
          <Allnews newsData={newsData} />
        </>
      )}
    </div>
  );
}
