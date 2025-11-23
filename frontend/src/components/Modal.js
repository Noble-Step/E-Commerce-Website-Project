import React, { useEffect, useCallback, useRef } from "react";

// Helper function to get all focusable elements within a container
const getFocusableElements = (container) => {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (el) => {
      const style = window.getComputedStyle(el);
      return style.display !== "none" && style.visibility !== "hidden";
    }
  );
};

// Modal
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const hasFocusedRef = useRef(false); // Track if we've already focused on open

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap: handle Tab key
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = getFocusableElements(modalRef.current);

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If Shift+Tab on first element, go to last
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // If Tab on last element, go to first
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element when modal opens
      if (!hasFocusedRef.current) {
        previousFocusRef.current = document.activeElement;
      }

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Add event listeners
      document.addEventListener("keydown", handleKeyDown);

      // Focus the first focusable element on each open
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = getFocusableElements(modalRef.current);
          if (
            focusableElements.length > 0 &&
            document.activeElement !== focusableElements[0]
          ) {
            // Only focus if not already focused on an input
            const activeElement = document.activeElement;
            const isInputFocused =
              activeElement &&
              (activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA");
            if (!isInputFocused) {
              focusableElements[0].focus();
            }
          }
        }
        // Mark as focused after attempting to focus
        hasFocusedRef.current = true;
      }, 100);
    } else {
      // Reset when modal closes
      hasFocusedRef.current = false;
    }

    return () => {
      // Cleanup always runs when effect is cleaning up (when isOpen changes or component unmounts)
      // Restore body scroll
      document.body.style.overflow = "unset";

      // Remove event listeners
      document.removeEventListener("keydown", handleKeyDown);

      // Return focus to the previously focused element only if no other modal is open
      // Delay the focus restoration to allow any newly opened modal to establish its focus first
      setTimeout(() => {
        // Check if there's any modal dialog currently in the DOM
        const hasOpenModal =
          document.querySelector('[role="dialog"][aria-modal="true"]') !== null;

        // Check if the active element is within a modal dialog
        const activeElement = document.activeElement;
        const isActiveElementInModal =
          activeElement &&
          (activeElement.closest('[role="dialog"]') !== null ||
            activeElement.closest('[aria-modal="true"]') !== null);

        // Only restore focus if:
        // 1. We have a previous focus element
        // 2. No modal dialog is currently open in the DOM
        // 3. The active element is NOT within a modal (double-check)
        // 4. The active element is not the body (meaning focus hasn't been lost)
        if (
          previousFocusRef.current &&
          previousFocusRef.current.focus &&
          !hasOpenModal &&
          !isActiveElementInModal &&
          activeElement !== document.body
        ) {
          previousFocusRef.current.focus();
        }
      }, 0);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className="fixed inset-0 z-[70] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <div
            ref={modalRef}
            className="relative w-full max-w-md sm:max-w-lg md:max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
