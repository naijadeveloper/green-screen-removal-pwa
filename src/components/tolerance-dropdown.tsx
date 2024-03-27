import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown";
import { Slider } from "./slider";

import { memo } from "react";

const Tolerance = memo(
  ({
    tolerance,
    setTolerance,
  }: {
    tolerance: number;
    setTolerance: React.Dispatch<React.SetStateAction<number>>;
  }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="relative bg-primary text-primary-foreground px-2 py-1 rounded-md border-b-4 border-neutral-700 hover:border-neutral-800 hover:bg-primary/90">
          Adjust Tolerance
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px]">
          <DropdownMenuItem>
            <div className="w-full pt-3">
              <Slider
                value={[tolerance]}
                onValueChange={(value) => setTolerance(value[0])}
                max={100}
                min={-100}
                step={1}
              />
              <p className="flex items-center justify-end mt-2">
                <span>{tolerance}%</span>
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

export default Tolerance;
