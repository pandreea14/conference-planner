import type { CreateStyled } from "@emotion/styled";
import { shouldForwardProp as baseShouldForwardProp } from "@mui/system";

/**
 * Universal helper for styled components prop filtering.
 * Filters out transient props (prefixed with $) that shouldn't be forwarded to DOM.
 */
export const withTransientProps: Parameters<CreateStyled>[1] = {
  shouldForwardProp: (propName: string) => {
    if (propName.startsWith("$")) return false;

    return baseShouldForwardProp(propName);
  }
};
