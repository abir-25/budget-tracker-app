import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";

const SkeletonWrapper = ({
  children,
  isLoading,
  fullWidth = true,
}: {
  children?: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
}): JSX.Element | null => {
  if (!isLoading) return <>{children}</>;
  return (
    <Skeleton className={cn(fullWidth && "w-full")}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
};

export default SkeletonWrapper;
