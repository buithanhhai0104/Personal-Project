import { INews } from "@/types/news";
import axios from "axios";

export const getNewsById = async (url: string) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.log("Lỗi lấy dữ liệu bài báo theo id", err);
  }
};
export const getNewsAll = async () => {
  try {
    const res = await axios.get(
      "server-personal-project-git-e4d4fd-thanh-hais-projects-0e39a8d1.vercel.app/news"
    );
    return res.data;
  } catch (err) {
    console.log("Lỗi lấy dữ liệu bài báo theo id", err);
  }
};
export const createNews = async (newsData: INews) => {
  try {
    const res = await axios.post(
      "server-personal-project-git-e4d4fd-thanh-hais-projects-0e39a8d1.vercel.app/news",
      newsData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.log("Lỗi thêm bài báo", err);
  }
};
