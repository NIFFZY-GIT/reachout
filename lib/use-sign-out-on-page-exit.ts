"use client";

import { useEffect } from "react";

export function useSignOutOnPageExit() {
  useEffect(() => {
    const signOut = () => {
      void fetch("/api/auth/logout", {
        method: "POST",
        keepalive: true,
      }).catch((error) => {
        console.error("Could not sign out when leaving the app", error);
      });
    };

    window.addEventListener("pagehide", signOut);
    return () => window.removeEventListener("pagehide", signOut);
  }, []);
}
