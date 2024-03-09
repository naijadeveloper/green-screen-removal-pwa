import { useRegisterSW } from "virtual:pwa-register/react";

export default function DownloadUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) {
    return <></>;
  }

  return (
    <div className="z-40 fixed top-0 left-0 w-full h-full bg-neutral-800/50 flex items-center justify-center">
      <div className="w-[90%] max-w-[400px] min-h-[100px] rounded-lg bg-neutral-700 flex flex-col items-center text-neutral-200 border-2 border-neutral-900 shadow-2xl">
        <p className="grow-[1] flex items-center justify-center text-center font-semibold text-lg">
          <span>
            A new update of{" "}
            <span className="group relative underline decoration-4 underline-offset-4 decoration-[#9F8C76]/70 cursor-pointer">
              <span className="hidden text-sm absolute w-[250px] -top-6 py-1 rounded-lg shadow-2xl bg-neutral-900 group-hover:block">
                Green Screen Removal App
              </span>
              <span>GSR</span>
            </span>{" "}
            is available
          </span>
        </p>
        <div className="w-full grow-[1] flex">
          <button
            onClick={() => updateServiceWorker(true)}
            className="grow-[1] flex items-center justify-center bg-[#9F8C76]/90 hover:bg-[#9F8C76]/70 rounded-bl-md"
          >
            Install
          </button>
          <button
            onClick={() => close()}
            className="grow-[1] flex items-center justify-center bg-neutral-800 hover:bg-neutral-800/70 rounded-br-md"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
