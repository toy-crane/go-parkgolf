import Link from "next/link";
import { env } from "@/env.mjs";

interface NaverBlogSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverBlogSearchItem[];
}

interface NaverBlogSearchItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}

function removeBTags(str: string): string {
  return str.replace(/<\/?b>/g, "");
}

async function fetchReviews(query: string) {
  const apiUrl = `https://openapi.naver.com/v1/search/blog?sort=sim&query=${encodeURI(
    query,
  )}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "X-Naver-Client-Id": env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching reviews: ${response.statusText}`);
  }
  const data = (await response.json()) as NaverBlogSearchResponse;
  return data.items.slice(0, 5);
}

const NaverReviews = async ({ courseName }: { courseName: string }) => {
  const reviews = await fetchReviews(courseName);
  return (
    <section className="mb-24 flex flex-col space-y-2">
      <h2 className="text-foreground text-xl font-bold">네이버 블로그 리뷰</h2>
      <div className="flex flex-col">
        {reviews.map((review) => {
          if (!review.title || !review.description) return null;
          return (
            <Link
              key={review.link}
              href={review.link}
              className="flex cursor-pointer flex-col space-y-1 rounded-lg px-1 py-4 hover:bg-stone-50"
            >
              <h3 className="text-base">{removeBTags(review.title)}</h3>
              <div className="text-muted-foreground text-sm">
                {removeBTags(review.description)}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default NaverReviews;
