import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quincy",
    short_name: "Quincy",
    description: "Escrow-backed micro-task bounties on Celo.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFBFF",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
