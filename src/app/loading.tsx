import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>

        <div className="grid gap-4">
          {/* Use fewer skeletons to improve performance */}
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </main>
  );
}
