import Header from "./components/header";

export default function About() {
  return (
    <>
      <Header pathname="about" />
      <main className="h-0 grow-[1] w-[98%] sm:w-[95%] flex items-center justify-center mx-auto bg-neutral-700 rounded-lg text-neutral-200 overflow-auto">
        about page main
      </main>
    </>
  );
}
