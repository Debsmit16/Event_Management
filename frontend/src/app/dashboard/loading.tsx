import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-7 w-32" />
          </div>
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-xl p-6">
                <Skeleton className="h-6 w-1/2 mb-4" />
                <div className="flex gap-4 mb-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white rounded-xl border shadow-sm h-[400px]">
            <div className="p-6 border-b bg-gray-50/50 rounded-t-xl">
              <Skeleton className="h-7 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
