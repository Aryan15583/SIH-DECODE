import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/privacy", "/terms"],
      disallow: [
        "/dashboard",
        "/agents",
        "/attack-graph",
        "/incidents",
        "/threats",
        "/prediction",
        "/network",
        "/risk",
        "/settings",
        "/reports",
        "/login",
      ],
    },
    sitemap: "https://aegissocai.vercel.app/sitemap.xml",
  };
}
