import { INews } from "@/types/news";
import React from "react";
import Image from "next/image";
import Allnews from "@/components/news/allnews";

export default async function NewsPage() {
  const getNews = await fetch(
    "https://my-server-3exfcj6u4-thanh-hais-projects-0e39a8d1.vercel.app/news"
  );
  const newsData: INews[] = await getNews.json();
  console.log(newsData);

  // const handleGetNewsById = (newsId: number, newsTitle: string) => {
  //   const unsignedTitle = newsTitle
  //     .normalize("NFD")
  //     .replace(/[\u0300-\u036f]/g, "");
  //   const formattedTitle = unsignedTitle
  //     .replace(/\s+/g, "-")
  //     .toLocaleLowerCase();
  //   const slug = `${formattedTitle}-${newsId}`;
  //   router.push(`/news/${slug}`);
  // };

  return (
    <div className="mt-16 mb-10  w-[90%] sm:w-[70%] m-auto text-black">
      <div className="flex  justify-center items-center gap-5">
        <h2 className="text-3xl text-[#00613d]">Tin tức nổi bật</h2>
        <div className="h-[2px] mt-1 w-full flex-1 bg-[#00613d]"></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="flex cursor-pointer flex-col col-span-4 row-span-2 sm:col-span-2">
          <div className=" flex w-full flex-col">
            <Image
              className="rounded-xl"
              src={newsData[0].image || ""}
              alt={newsData[0].title}
              width={100}
              height={100}
              layout="responsive"
            />
            <h2 className="line_clamp font-medium text-[#111111] hover:opacity-90 mt-5 text-xl leading-6">
              {newsData[0].title}
            </h2>
          </div>
        </div>
        {newsData.slice(1, 4).map((news) => {
          const date = new Date(news.created_at);
          const formattedDate = date.toLocaleDateString("vi-VN");
          return (
            <div
              key={news.id}
              className="flex cursor-pointer flex-col col-span-2 sm:col-span-1"
            >
              <div className="w-full flex flex-1">
                <Image
                  className="rounded-xl"
                  src={news.image || ""}
                  alt={news.title}
                  width={500}
                  height={500}
                  layout="responsive"
                />
              </div>
              <div className="flex flex-col">
                {" "}
                <p className="text-sm font-bold  overflow-hidden line-clamp-2 my-3">
                  {news.title}
                </p>
                {formattedDate}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex  justify-center items-center gap-5">
        <h2 className="text-3xl text-[#00613d]">Tất cả tin tức</h2>
        <div className="h-[2px] mt-1 w-full flex-1 bg-[#00613d]"></div>
      </div>
      <Allnews newsData={newsData} />
    </div>
  );
}
