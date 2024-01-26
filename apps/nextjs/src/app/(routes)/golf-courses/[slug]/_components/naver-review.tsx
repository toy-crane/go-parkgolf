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
  return data.items;
}

const NaverReviews = async ({ courseName }: { courseName: string }) => {
  const reviews = await fetchReviews(courseName);
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <div key={review.link}>
          <div dangerouslySetInnerHTML={{ __html: review.title }} />
          <div dangerouslySetInnerHTML={{ __html: review.description }} />
        </div>
      ))}
    </div>
  );
};

export default NaverReviews;
