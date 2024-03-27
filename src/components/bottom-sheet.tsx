import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { useEffect, useState, memo } from "react";
import { cn } from "../lib/utils";

const BottomSheet = memo(
  ({
    bgFile,
    selection,
    handleBgSelection,
  }: {
    bgFile: FileList;
    selection: number;
    handleBgSelection: (index: number) => void;
  }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      let allVids = document.querySelectorAll(
        ".bottom-sheet-vid"
      ) as NodeListOf<HTMLVideoElement>;
      if (Array.from(allVids).length > 0) {
        Array.from(allVids).forEach((vid) => {
          setTimeout(() => {
            vid.pause();
          }, 5000);
        });
      }

      setTimeout(() => setLoading(false), 3000);
    }, []);
    return (
      <Sheet>
        <SheetTrigger className="relative bg-primary text-primary-foreground px-2 py-1 rounded-md border-b-4 border-neutral-700 hover:border-neutral-800 hover:bg-primary/90">
          Choose Background
        </SheetTrigger>
        <SheetContent className="overflow-auto select-none [&::-webkit-scrollbar-track]:bg-neutral-800">
          {loading && (
            <SheetHeader>
              <SheetTitle className="text-center my-2">
                Loading Please wait...
              </SheetTitle>
            </SheetHeader>
          )}
          <div className="flex flex-col gap-y-2">
            {Array.from(bgFile!).map((file, index) => {
              let url = URL.createObjectURL(file);
              if (file.type.toLowerCase().includes("video")) {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (selection != index) {
                        handleBgSelection(index);
                      }
                    }}
                    className={cn(
                      "relative border-0 border-primary rounded-lg",
                      {
                        "border-4": selection == index,
                      }
                    )}
                  >
                    <video
                      src={url}
                      aria-label={file.name}
                      muted
                      className="bottom-sheet-vid w-full rounded"
                    />
                    <div className="absolute top-0 left-0 w-full h-full z-20 flex flex-col items-center justify-center gap-2 px-2 bg-neutral-800/50">
                      <span className="text-xs">{file.name}</span>
                    </div>
                  </button>
                );
              } else {
                return (
                  <button
                    onClick={() => {
                      if (selection != index) {
                        handleBgSelection(index);
                      }
                    }}
                    key={index}
                    className={cn(
                      "relative border-0 border-primary rounded-lg",
                      {
                        "border-4": selection == index,
                      }
                    )}
                  >
                    <img
                      key={index}
                      src={url}
                      alt={file.name}
                      className="w-full rounded"
                    />
                    <div className="absolute top-0 left-0 w-full h-full z-20 flex flex-col items-center justify-center gap-2 px-2 bg-neutral-800/50">
                      <span className="text-xs">{file.name}</span>
                    </div>
                  </button>
                );
              }
            })}
          </div>
        </SheetContent>
      </Sheet>
    );
  }
);

export default BottomSheet;
