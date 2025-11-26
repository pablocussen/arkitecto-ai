import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
}

const Skeleton = ({ className = '' }: SkeletonProps) => (
  <motion.div
    className={`bg-white/5 rounded animate-pulse ${className}`}
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
)

export const BudgetItemSkeleton = () => (
  <div className="glass rounded-2xl p-6 border border-white/5">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-72 mb-2" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-8 w-32" />
    </div>
    <div className="flex items-center space-x-6 border-t border-white/5 pt-3 mt-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
)

export const BudgetListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <Skeleton className="h-8 w-48" />
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-14 w-48" />
      </div>
    </div>
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <BudgetItemSkeleton key={i} />
      ))}
    </div>
    <div className="glass-strong rounded-2xl p-6 border-2 border-neon-cyan/10 mt-8">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const ProjectCardSkeleton = () => (
  <div className="glass-strong p-6 rounded-2xl border border-transparent">
    <div className="flex items-start justify-between mb-3">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    <Skeleton className="h-4 w-32" />
  </div>
)

export const DashboardSkeleton = () => (
  <div className="p-4 md:p-8">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>

    {/* Projects Grid */}
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-8" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
)

export default Skeleton
