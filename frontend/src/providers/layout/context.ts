import { createContext } from "react";
import type { LayoutContextPayload } from "./types";
import { initialContext } from "./constants";

const LayoutContext = createContext<LayoutContextPayload>(initialContext);

export { LayoutContext };
