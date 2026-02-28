const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-5 space-y-4">
            <div className="skeleton h-40 w-full" />
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="card">
        <div className="p-4 border-b border-gray-100">
          <div className="skeleton h-8 w-48" />
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-gray-50">
            <div className="skeleton h-5 w-12" />
            <div className="skeleton h-5 w-40" />
            <div className="skeleton h-5 w-32" />
            <div className="skeleton h-5 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div className="bg-gray-200 animate-pulse h-32 w-full" />
    );
  }

  return null;
};

export default LoadingSkeleton;
