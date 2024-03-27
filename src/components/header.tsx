import { Link } from "react-router-dom";

import { cn } from "../lib/utils";

export default function Header({ pathname }: { pathname: string }) {
  return (
    <header className="text-neutral-100">
      <nav className="bg-neutral-800 flex justify-center items-center w-[200px] h-[50px] rounded-full divide-x-4 divide-primary/70 shadow-xl border-b-4 border-neutral-700">
        <Link
          className={cn(
            "grow-[1] h-full flex items-center justify-center font-semibold text-xl rounded-s-full",
            pathname == "home" ? "bg-primary/40" : "hover:bg-primary/40"
          )}
          to={`/`}
        >
          Home
        </Link>
        <Link
          className={cn(
            "grow-[1] h-full flex items-center justify-center font-semibold text-xl rounded-e-full",
            pathname == "about" ? "bg-primary/40" : "hover:bg-primary/40"
          )}
          to={`/about`}
        >
          About
        </Link>
      </nav>
    </header>
  );
}
