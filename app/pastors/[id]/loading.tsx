import { Skeleton } from "@/components/ui/skeleton"
import MainLayout from "@/components/main-layout"

export default function PastorDetailLoading() {
  return (
    <MainLayout>
      {/* Back Button Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Pastor Profile Header Skeleton */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Pastor Image Skeleton */}
            <div className="lg:col-span-1">
              <Skeleton className="h-96 lg:h-[500px] rounded-2xl" />
            </div>

            {/* Pastor Info Skeleton */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-12 w-3/4 mb-4" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>

                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
