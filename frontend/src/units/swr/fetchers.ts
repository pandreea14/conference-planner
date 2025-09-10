import { fit } from "../../utils/api";
import { ErrorService } from "./errorService";

const headers: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

type FetcherArgs = {
  arg?: Record<string, string | number | undefined>;
};

/**
 * Enhanced fetcher with ProblemDetails error handling
 */
const fetcher = async (url: string, args?: FetcherArgs) => {
  const fullUrl = args?.arg ? fit(url, args.arg) : url;

  const response = await fetch(fullUrl, {
    method: "GET",
    headers
  });

  if (!response.ok) {
    const apiError = await ErrorService.parseErrorResponse(response);
    throw apiError;
  }

  return response.json();
};

/**
 * Enhanced mutation fetcher with ProblemDetails error handling
 */
async function mutationFetcher<Command>(url: string, { arg }: { arg: Command }) {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(arg)
  });

  if (!response.ok) {
    const apiError = await ErrorService.parseErrorResponse(response);
    throw apiError;
  }

  return response.json();
}

export { fetcher, mutationFetcher };
