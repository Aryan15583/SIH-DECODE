import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AegisSOC AI",
    short_name: "AegisSOC",
    description: "AegisSOC AI is an autonomous, multi-agent Security Operations Center platform for real-time threat detection, investigation and response.",
    start_url: "/",
    display: "standalone",
    background_color: "#050507",
    theme_color: "#7657C8",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
