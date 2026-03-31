export default function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header skeleton */}
      <div className="glass p-6 space-y-3">
        <div className="skeleton h-10 w-72" />
        <div className="skeleton h-5 w-48" />
        <div className="flex gap-3 mt-2">
          <div className="skeleton h-8 w-32" />
          <div className="skeleton h-8 w-40" />
          <div className="skeleton h-8 w-28" />
        </div>
      </div>

      {/* Team cards skeleton */}
      <div>
        <div className="skeleton h-6 w-48 mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass p-6 space-y-3">
              <div className="skeleton h-5 w-20" />
              <div className="skeleton h-10 w-16" />
              <div className="skeleton h-4 w-24" />
            </div>
          ))}
        </div>
        <div className="glass mt-4 p-4">
          <div className="skeleton h-48 w-full" />
        </div>
      </div>

      {/* Activity cards skeleton */}
      <div>
        <div className="skeleton h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="glass p-5 space-y-3">
              <div className="skeleton h-5 w-32" />
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="skeleton h-4 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard skeleton */}
      <div>
        <div className="skeleton h-6 w-48 mb-4" />
        <div className="glass p-4 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton h-7 w-7 rounded-full" />
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-5 w-20" />
              <div className="skeleton h-4 w-12 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
