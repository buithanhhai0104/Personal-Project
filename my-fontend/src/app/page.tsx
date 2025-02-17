import InfoSection from "@/components/infoSection";
import NewNews from "@/components/news/newNews";
import Popular from "@/components/popular";
import SearchBox from "@/components/searchBox";
import { INews } from "@/types/news";
import { ITrips } from "@/types/trips";

import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "Trang chủ",
  };
}

export default async function Home() {
  let tripsData: ITrips[] = [];
  let newsData: INews[] = [];

  try {
    const getTrips = await fetch(
      "https://server-personal-project-67d0v7vmx-thanh-hais-projects-0e39a8d1.vercel.app/api/trips"
    );
    if (!getTrips.ok) {
      throw new Error("Failed to fetch trips data");
    }
    tripsData = await getTrips.json();

    const getNews = await fetch(
      "https://server-personal-project-67d0v7vmx-thanh-hais-projects-0e39a8d1.vercel.app/news"
    );
    if (!getNews.ok) {
      throw new Error("Failed to fetch news data");
    }
    newsData = await getNews.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    // Bạn có thể trả về giá trị mặc định hoặc thông báo lỗi cho người dùng
  }

  return (
    <>
      <div className="">
        <div className="w-full bg-home-image h-[400px] sm:h-[500px] bg-cover"></div>
        <div className="mt-[-100px] w-[95%] m-auto sm:w-[80%] ">
          <SearchBox />
        </div>
        <div className="flex pt-14 justify-center ">
          <Popular tripsData={tripsData} />
        </div>
        <div className="flex pt-14 justify-center ">
          <InfoSection />
        </div>
        <div className="flex pt-14 justify-center ">
          <NewNews newsData={newsData} />
        </div>
      </div>
    </>
  );
}
