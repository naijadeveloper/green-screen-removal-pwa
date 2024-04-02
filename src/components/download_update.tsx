import { useRegisterSW } from "virtual:pwa-register/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

export default function DownloadUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = () => {
    setNeedRefresh(false);
  };

  return (
    <Dialog open={needRefresh} onOpenChange={setNeedRefresh}>
      <DialogContent className="w-[90%] max-w-[400px] min-h-[100px] flex flex-col items-center p-0 select-none">
        <DialogHeader className="grow-[1] py-3">
          <DialogTitle className="text-xl">
            <span>
              A new update of{" "}
              <span className="underline decoration-4 underline-offset-4 decoration-primary/70">
                GSR
              </span>{" "}
              is available
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="grow-[1] w-full flex">
          <button
            onClick={() => updateServiceWorker(true)}
            className="grow-[1] w-full flex items-center justify-center bg-primary/90 hover:bg-primary/70 rounded-bl-md p-3 outline-none focus:ring-0 focus:outline-none"
          >
            Install
          </button>
          <button
            onClick={() => close()}
            className="grow-[1] w-full flex items-center justify-center bg-neutral-700 hover:bg-neutral-700/70 rounded-br-md p-3"
          >
            Not now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
