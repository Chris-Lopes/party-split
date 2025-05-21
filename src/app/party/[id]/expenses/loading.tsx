import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Skeleton className="h-8 w-36 mb-2" />
          </div>
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>

        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    </main>
  );
}
