import { Link } from "react-router-dom";

export default function Header({ pathname }: { pathname: string }) {
  return (
    <header className="text-neutral-100">
      <nav className="bg-neutral-800 flex justify-center items-center w-[200px] h-[50px] rounded-full divide-x-4 divide-[#9F8C76]/70 shadow-xl border-b-4 border-neutral-700">
        <Link
          className={`grow-[1] h-full flex items-center justify-center font-semibold text-xl rounded-s-full ${
            pathname == "home" ? "bg-[#9F8C76]/40" : "hover:bg-[#9F8C76]/40"
          }`}
          to={`/`}
        >
          Home
        </Link>
        <Link
          className={`grow-[1] h-full flex items-center justify-center font-semibold text-xl rounded-e-full ${
            pathname == "about" ? "bg-[#9F8C76]/40" : "hover:bg-[#9F8C76]/40"
          }`}
          to={`/about`}
        >
          About
        </Link>
      </nav>
    </header>
  );
}
