import React from "react";

// Product Card Skeleton
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-black border border-yellow-600 rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-800"></div>
      
      <div className="p-5 space-y-4">
        <div className="h-6 bg-gray-800 rounded w-3/4"></div>
        
        <div className="space-y-2">
          <div className="h-4 bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-800 rounded w-5/6"></div>
        </div>
        
        <div className="h-4 bg-gray-800 rounded w-1/3"></div>
        
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-800 rounded w-24"></div>
          <div className="h-10 bg-gray-800 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailsSkeleton = () => {
  return (
    <div className="bg-black text-white min-h-screen px-4 md:px-10 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="flex lg:flex-row flex-col gap-4">
          <div className="flex lg:flex-col flex-row gap-3 lg:w-24">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-800 rounded-xl"></div>
            ))}
          </div>
          <div className="flex-1 bg-gray-800 rounded-2xl h-96"></div>
        </div>

        <div className="space-y-6">
          <div className="h-10 bg-gray-800 rounded w-3/4"></div>
          <div className="h-6 bg-gray-800 rounded w-1/4"></div>
          <div className="h-8 bg-gray-800 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
          </div>
          <div className="h-12 bg-gray-800 rounded w-1/2"></div>
          <div className="h-12 bg-gray-800 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export const CartItemSkeleton = () => {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 flex gap-6 animate-pulse">
      <div className="w-32 h-32 bg-gray-800 rounded-xl"></div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-800 rounded w-24"></div>
          <div className="h-6 bg-gray-800 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export const Skeleton = ({ className = "", width = "w-full", height = "h-4" }) => {
  return (
    <div className={`bg-gray-800 rounded animate-pulse ${width} ${height} ${className}`}></div>
  );
};

export default ProductCardSkeleton;

