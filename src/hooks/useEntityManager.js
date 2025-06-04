import { useEffect } from "react";

/**
 * Generic pattern: keeps an entity list in context fresh
 *   – `ctx.refresh()` called on mount
 *   – bubble loading / error from any op with the same hook you already use
 */
const useEntityManager = (ctx, deps = []) => {
  const { refresh } = ctx;
  useEffect(() => {
    refresh(); // initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ctx;
};

export default useEntityManager;
