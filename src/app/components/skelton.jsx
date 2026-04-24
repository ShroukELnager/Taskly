export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
      {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>

      {/* Description */}
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-4/6"></div>

     
    </div>
    
    
  )
}