import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination Component
 * Provides pagination controls for product lists
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 12,
  totalItems = 0,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center gap-4 mt-8"
    >
      <div className="text-sm text-gray-400" aria-live="polite">
        Showing {startItem} to {endItem} of {totalItems} products
      </div>
      
      <ol className="flex items-center gap-2" role="list">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1}
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        </li>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis") {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="px-2 text-gray-600" aria-hidden="true">
                  ...
                </span>
              </li>
            );
          }

          return (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={`min-w-[44px] min-h-[44px] px-4 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-yellow-400 text-black font-semibold"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Next Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </li>
      </ol>
    </nav>
  );
};

export default Pagination;

