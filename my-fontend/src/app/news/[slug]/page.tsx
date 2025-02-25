import { INews } from "@/types/news";
import Image from "next/image";
import RelatedNews from "@/components/news/relatedNews";
import { Metadata } from "next";
type Props = {
  params: Promise<{ slug: string }>;
};
// hàm dung để lấy id từ slug
const extractId = (slug: string): string => {
  const match = slug.match(/(\d+)$/);
  return match ? match[0] : "";
};

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-personal-project.vercel.app";

// hàm để dùng id gọi api
const fetchNewsData = async (id: string): Promise<INews | null> => {
  try {
    const response = await fetch(`${apiUrl}/news/${id}`);

    if (!response.ok) {
      console.error("Failed to fetch news data");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching news data:", error);
    return null;
  }
};

//  SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const id = extractId(slug);
  const newsContent = await fetchNewsData(id);
  if (!newsContent) {
    return {
      title: "Tin tức không tìm thấy",
      description: "Không có nội dung tin tức.",
    };
  }

  return {
    title: newsContent.title,
    description: newsContent.content.substring(0, 150),
  };
}

export default async function NewsContent({ params }: Props) {
  const slug = (await params).slug;
  const id = extractId(slug);
  const newsContent = await fetchNewsData(id);

  if (!newsContent) {
    return (
      <div className="mt-20 w-[90%] sm:w-[70%] m-auto text-black pb-6">
        Không thể tải dữ liệu tin tức
      </div>
    );
  }

  const formattedContent = newsContent.content.replace(/\n/g, "<br />");
  const formattedDate = newsContent.created_at
    ? new Date(newsContent.created_at).toLocaleDateString("vi-VN")
    : "";

  return (
    <div className="mt-20 w-[90%] sm:w-[70%] m-auto text-black pb-6">
      <div>
        <h1 className="text-xl font-bold py-5">{newsContent.title}</h1>
        <p className="text-sm">Ngày đăng: {formattedDate}</p>
        <div className="w-[100%] m-auto my-5">
          <Image
            src={
              typeof newsContent.image === "string"
                ? newsContent.image
                : "/images/logo.png"
            }
            alt={newsContent.title || "ảnh mặc định"}
            width={500}
            height={500}
            unoptimized
          />
        </div>
        <div dangerouslySetInnerHTML={{ __html: formattedContent || "" }} />
      </div>
      <div>
        <RelatedNews />
      </div>
    </div>
  );
}
