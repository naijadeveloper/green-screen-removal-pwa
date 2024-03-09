import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Green Screen Removal",
        short_name: "GSR",
        description:
          "Transform your videos effortlessly with our advanced green screen removal web app. Whether you're editing a live stream or pre-recorded footage, our tool offers two powerful methods: real-time chroma keying with live camera input or seamless removal and replacement of green screen backgrounds in uploaded videos. Try it now!",
        theme_color: "#171717",
        background_color: "#171717",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/ss1.png",
            sizes: "750x1334",
            type: "image/png",
            label: "Use the camera for real-time",
          },
          {
            src: "/ss2.png",
            sizes: "750x1334",
            type: "image/png",
            label: "Upload green screen video for removal",
          },
        ],
      },
    }),
  ],
});
