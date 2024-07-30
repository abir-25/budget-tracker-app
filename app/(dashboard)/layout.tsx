import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen w-full flex-col mt-9">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
}

export default layout;
