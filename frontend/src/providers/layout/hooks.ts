import { useContext } from "react";
import { LayoutContext } from "./context";
import type { LayoutContextPayload } from "./types";

const useApplicationLayout = (): LayoutContextPayload => {
  const context = useContext(LayoutContext);
  return context;
};

export { useApplicationLayout };
