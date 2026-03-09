import { router } from "expo-router";
import { useState } from "react";

import { useAuth } from "@/providers/auth-provider";

export function useLogout() {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await logout();
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  return { loggingOut, handleLogout };
}
