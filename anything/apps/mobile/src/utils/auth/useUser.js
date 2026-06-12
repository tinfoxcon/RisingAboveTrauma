import { useCallback } from "react";
import { useAuthStore } from "./store";
import { fetchWithAuth } from "../fetchWithAuth";

export const useUser = () => {
  const { auth, isReady, setAuth } = useAuthStore();
  const user = auth?.user || null;

  const refetch = useCallback(async () => {
    try {
      const res = await fetchWithAuth("/api/user/me");
      if (!res.ok) {
        console.error("useUser refetch failed:", res.status);
        return null;
      }
      const data = await res.json();
      const freshUser = data?.user;
      if (freshUser && auth) {
        // Merge fresh user fields into the existing auth object
        // so the JWT and other auth fields are preserved
        setAuth({ ...auth, user: freshUser });
      }
      return freshUser;
    } catch (err) {
      console.error("useUser refetch error:", err);
      return null;
    }
  }, [auth, setAuth]);

  return { user, data: user, loading: !isReady, refetch };
};

export default useUser;
