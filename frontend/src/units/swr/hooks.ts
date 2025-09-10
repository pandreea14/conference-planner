import useSWR, { type Key, type SWRConfiguration, type SWRResponse } from "swr";
import useSWRMutation, { type MutationFetcher, type SWRMutationConfiguration, type SWRMutationResponse } from "swr/mutation";
import { fetcher, mutationFetcher } from "./fetchers";
import { ErrorService } from "./errorService";
import { ApiError } from "./errorTypes";
import { useMemo } from "react";

export interface ErrorHandlingOptions {
  silent?: boolean;
}

/**
 * Enhanced useSWR with unified error handling
 */
export function useApiSWR<Data = unknown, TError = ApiError>(
  key: string | null,
  swrOptions: SWRConfiguration<Data, TError> = {},
  errorOptions: ErrorHandlingOptions = {}
): SWRResponse<Data, TError> {
  const { silent = false } = errorOptions;

  const enhancedOptions: SWRConfiguration<Data, TError> = useMemo(
    () => ({
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...swrOptions,
      onError: (error, key, config) => {
        if (swrOptions.onError) {
          swrOptions.onError(error, key, config);
          return;
        }

        if (silent || ErrorService.shouldHandleSilently(error)) {
          ErrorService.handleSilentError(error);
          return;
        }

        ErrorService.handleError(error);
      }
    }),
    [swrOptions, silent]
  );

  return useSWR(key, key ? fetcher : null, enhancedOptions);
}

/**
 * Enhanced useSWRMutation with unified error handling
 */
export function useApiSWRMutation<Data = unknown, Error = ApiError, SWRMutationKey extends Key = Key, ExtraArg = unknown, SWRData = Data>(
  key: SWRMutationKey,
  fetcher: MutationFetcher<Data, SWRMutationKey, ExtraArg>,
  swrOptions: SWRMutationConfiguration<Data, Error, SWRMutationKey, ExtraArg, SWRData> = {},
  errorOptions: ErrorHandlingOptions = {}
): SWRMutationResponse<Data, Error, SWRMutationKey, ExtraArg> {
  const { silent = false } = errorOptions;

  const enhancedOptions: SWRMutationConfiguration<Data, Error, SWRMutationKey, ExtraArg, SWRData> = useMemo(
    () => ({
      ...swrOptions,
      onError: (error, key, config) => {
        if (swrOptions.onError) {
          swrOptions.onError(error, key, config);
          return;
        }

        if (silent || ErrorService.shouldHandleSilently(error)) {
          ErrorService.handleSilentError(error);
          return;
        }

        ErrorService.handleError(error);
      }
    }),
    [swrOptions, silent]
  );

  return useSWRMutation<Data, Error, SWRMutationKey, ExtraArg, SWRData>(key, fetcher, enhancedOptions);
}

export function useApiMutation<Data = unknown, Error = ApiError, SWRMutationKey extends Key = Key, ExtraArg = unknown, SWRData = Data>(
  key: SWRMutationKey,
  swrOptions: SWRMutationConfiguration<Data, Error, SWRMutationKey, ExtraArg, SWRData> = {},
  errorOptions: ErrorHandlingOptions = {}
): SWRMutationResponse<Data, Error, SWRMutationKey, ExtraArg> {
  return useApiSWRMutation<Data, Error, SWRMutationKey, ExtraArg, SWRData>(
    key,
    mutationFetcher<ExtraArg> as MutationFetcher<Data, SWRMutationKey, ExtraArg>,
    swrOptions,
    errorOptions
  );
}
