'use client'

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";
import { NextUIProvider } from "@nextui-org/system";

export function Providers({ children }: { children: React.ReactNode }) {

  const [isClient, setIsClient] = React.useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <NextUIProvider >
      {isClient ? (<NextThemesProvider attribute="class">{children}</NextThemesProvider>
      ) : (
        <></>
      )}
    </NextUIProvider>
  );
}