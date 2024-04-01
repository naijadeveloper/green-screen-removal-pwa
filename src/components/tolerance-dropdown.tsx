import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown";

import { memo, useState } from "react";

const Tolerance = memo(
  ({
    setTolerance,
  }: {
    setTolerance: React.Dispatch<React.SetStateAction<number>>;
  }) => {
    const [inputValue, setInputValue] = useState("0");
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="relative bg-primary text-primary-foreground px-2 py-1 rounded-md border-b-4 border-neutral-700 hover:border-neutral-800 hover:bg-primary/90">
          Tolerance
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px]">
          <DropdownMenuItem>
            <div
              className="w-full pt-3"
              onClick={(e) => {
                let elem = e.target as HTMLElement;
                if (elem.id != "tolerance-btn") {
                  e.stopPropagation();
                }
              }}
            >
              <div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full h-8 p-1 appearance-none bg-neutral-900 rounded-md"
                />
              </div>
              <p>range from -100 to 100</p>
              <div className="w-full flex items-center justify-end">
                <button
                  id="tolerance-btn"
                  onClick={() =>
                    setTolerance(() => {
                      if (!Number(inputValue)) {
                        setInputValue("0");
                        return 0;
                      }
                      if (Number(inputValue) > 100) {
                        setInputValue("100");
                        return 100;
                      } else if (Number(inputValue) < -100) {
                        setInputValue("-100");
                        return -100;
                      } else {
                        return Number(inputValue);
                      }
                    })
                  }
                  className="px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Apply
                </button>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

export default Tolerance;
