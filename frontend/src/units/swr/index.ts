import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export * from "./fetchers";
export * from "./hooks";
export * from "./errorTypes";
export * from "./errorService";

export { useSWR, useSWRMutation };

export type { Key } from "swr";
