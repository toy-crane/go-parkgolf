import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/settings/", "/register/", "/login/", "/auth/"],
    },
    sitemap: "https://www.goparkgolf.app/sitemap.xml",
  };
}
