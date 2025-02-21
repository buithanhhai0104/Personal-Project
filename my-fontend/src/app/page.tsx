import InfoSection from "@/components/infoSection";
import NewNews from "@/components/news/newNews";
import Popular from "@/components/popular";
import SearchBox from "@/components/searchBox";
import { INews } from "@/types/news";
import { ITrips } from "@/types/trips";

import type { Metadata } from "next";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-personal-project.vercel.app";

export function generateMetadata(): Metadata {
  return {
    title: "Trang chủ",
  };
}

export default async function Home() {
  let tripsData: ITrips[] = [];
  let newsData: INews[] = [];

  try {
    const getTrips = await fetch(`${apiUrl}/api/trips`);
    if (!getTrips.ok) {
      throw new Error("Failed to fetch trips data");
    }
    tripsData = await getTrips.json();

    const getNews = await fetch(`${apiUrl}/news`);
    if (!getNews.ok) {
      throw new Error("Failed to fetch news data");
    }
    newsData = await getNews.json();
  } catch (error) {
    console.error("Error fetching data:", error);
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
