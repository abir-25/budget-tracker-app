"use client";

import { ThemeProvider } from "next-themes";
import React, { ReactNode } from "react";

interface RootProvidersProps {
  children: ReactNode;
}

const RootProviders: React.FC<RootProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default RootProviders;
