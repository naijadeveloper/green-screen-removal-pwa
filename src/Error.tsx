import { useRouteError } from "react-router-dom";

import Header from "./components/header";

import { FaSadTear } from "react-icons/fa";

export default function Error({ errorStr }: { errorStr?: string }) {
  const error = useRouteError() as { statusText: string; message: string };

  const err = (() => {
    if (!error) return "";

    let value = error.statusText ? error.statusText : error.message;
    if (value.toLowerCase().includes("not found")) {
      return "Page not found";
    } else {
      return value;
    }
  })();

  return (
    <>
      <Header pathname="" />
      <main className="relative h-0 grow-[1] w-[98%] sm:w-[95%] mx-auto bg-neutral-700 rounded-lg text-neutral-200 overflow-auto flex flex-col gap-y-5 items-center justify-center px-4">
        <h1 className="text-6xl flex items-center justify-center gap-x-2">
          <span>Oops!</span>
          <span className="text-red-300">
            <FaSadTear />
          </span>
        </h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="font-extrabold text-center">{errorStr || err}</p>
      </main>
    </>
  );
}
