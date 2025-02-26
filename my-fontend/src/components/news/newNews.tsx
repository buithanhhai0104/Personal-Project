"use client";

import { INews } from "@/types/news";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { GrNext } from "react-icons/gr";
import { useRouter } from "next/navigation";

interface INewNewsProps {
  newsData: INews[];
}

const NewNews: React.FC<INewNewsProps> = ({ newsData }) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (window.innerWidth > 768) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 3) % newsData.length;
          return nextIndex;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [newsData.length]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.offsetWidth * currentIndex,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

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
    <div className=" w-full mb-10 ">
      <h1 className="text-3xl text-center text-[#00613D] font-bold">
        TIN TỨC MỚI
      </h1>
      <p className="text-center text-[#00613D]">
        Cập nhật các thông tin về khuyến mãi
      </p>
      <div
        ref={sliderRef}
        className=" w-[95%] m-auto overflow-auto overflow-x sm:overflow-hidden sm:w-[78%] flex gap-8 text-black mt-4"
      >
        {newsData.map((news, index) => {
          const date = new Date(news.created_at);
          const formattedDate = date.toLocaleDateString("vi-VN");

          return (
            <div className="h-[278px] " key={index}>
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
              <p className=" font-bold w-[367px] overflow-hidden whitespace-nowrap truncate my-3 ">
                {news.title}
              </p>
              <div className="flex justify-between">
                {formattedDate}
                <button
                  onClick={() => {
                    if (news.id !== undefined) {
                      handleGetNewsById(news.id, news.title);
                    }
                  }}
                  className="flex items-center text-orange-600 cursor-pointer"
                >
                  Chi tiết <GrNext />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewNews;
