export const SkeletonFilters: React.FC = () => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>

      {/* Basic Search Skeleton */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>

      {/* Advanced Filters Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index}>
            <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
