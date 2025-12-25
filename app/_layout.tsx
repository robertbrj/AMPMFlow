import { useAppStore } from "@/src/core/state/appStore";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const hydrate = useAppStore(s => s.hydrate);
  const hydrated = useAppStore(s => s.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return null; // TO DO: splash/loading
  }

  return <Stack />;
}
