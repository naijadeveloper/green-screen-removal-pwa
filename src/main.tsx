import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import About from "./About.tsx";
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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="max-w-screen-2xl mx-auto w-full h-screen flex flex-col items-center justify-center gap-y-4 bg-gray-900 overflow-hidden py-4 pt-6">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
