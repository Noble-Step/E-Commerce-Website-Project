import { useEffect } from "react";

/**
 * Custom hook to set page title dynamically
 * @param {string} title - The page title to set
 */
export const usePageTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | Noble Step` : "Noble Step";

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};
