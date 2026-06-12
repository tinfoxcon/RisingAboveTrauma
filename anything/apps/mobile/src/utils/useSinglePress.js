import { useRef, useCallback } from "react";

/**
 * useSinglePress — prevents double-tap / rapid multiple press issues app-wide.
 *
 * Returns a `guard(handler)` wrapper. Wrapping any onPress handler with it
 * ensures the handler cannot fire again until either:
 *  - the async handler resolves/rejects, OR
 *  - `lockDurationMs` has elapsed (for sync/navigation-only handlers)
 *
 * Usage:
 *   const guard = useSinglePress();
 *   <TouchableOpacity onPress={guard(handleAction)} />
 *   <TouchableOpacity onPress={guard(() => router.push("/somewhere"))} />
 *
 * The lock is shared across all guarded handlers on the same component,
 * which prevents hammering ANY button while any action is in-flight.
 */
export default function useSinglePress(lockDurationMs = 700) {
  const locked = useRef(false);

  const guard = useCallback(
    (handler) =>
      (...args) => {
        if (locked.current) return;
        locked.current = true;

        let result;
        try {
          result = handler(...args);
        } catch (e) {
          locked.current = false;
          throw e;
        }

        // If the handler returns a Promise (async), release when it settles
        if (result && typeof result.then === "function") {
          result.finally(() => {
            locked.current = false;
          });
        } else {
          // Sync / navigation handlers: release after a short delay
          setTimeout(() => {
            locked.current = false;
          }, lockDurationMs);
        }
      },
    [lockDurationMs],
  );

  return guard;
}
