"use client";

import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import { INews } from "@/types/news";
import { useRouter } from "next/navigation";
interface INewsProps {
  newsData: INews[];
}
const Allnews: React.FC<INewsProps> = ({ newsData }) => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
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

  const startIndex = currentPage * itemsPerPage;
  const paginatedItems = newsData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4  ">
        {paginatedItems.map((news, index) => (
          <div
            key={index}
            onClick={() => {
              if (news.id !== undefined) {
                handleGetNewsById(news.id, news.title);
              }
            }}
            className="border p-3 rounded-lg shadow cursor-pointer "
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
            <p className="mt-2 text-sm font-bold line-clamp-2">{news.title}</p>
          </div>
        ))}
      </div>

      {/* Component phân trang */}
      <ReactPaginate
        previousLabel={"← Trước"}
        nextLabel={"Sau →"}
        breakLabel={"..."}
        pageCount={Math.ceil(newsData.length / itemsPerPage)}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={"flex justify-center mt-4 space-x-2"}
        pageClassName={"px-3 py-2 bg-gray-200 rounded cursor-pointer"}
        activeClassName={"bg-blue-500 text-white"}
        previousClassName={"px-3 py-2 bg-gray-300 rounded cursor-pointer"}
        nextClassName={"px-3 py-2 bg-gray-300 rounded cursor-pointer"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
      />
    </div>
  );
};

export default Allnews;
