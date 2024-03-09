import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import About from "./About.tsx";
import Camera from "./camera.tsx";
import ViewNewVideo from "./view_new_vid.tsx";
import DownloadUpdate from "./components/download_update.tsx";
import Error from "./Error.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
  },

  {
    path: "/about",
    element: <About />,
    errorElement: <Error />,
  },

  {
    path: "/camera",
    element: <Camera />,
    errorElement: <Error />,
  },

  {
    path: "/view-new-vid",
    element: <ViewNewVideo />,
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="relative max-w-screen-2xl mx-auto w-full h-screen flex flex-col items-center justify-center gap-y-4 bg-neutral-900 overflow-hidden py-4 pt-6">
      <DownloadUpdate />
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
