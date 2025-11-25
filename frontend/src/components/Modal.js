import React, { useEffect, useCallback, useRef } from "react";

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
  const hasFocusedRef = useRef(false);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = getFocusableElements(modalRef.current);

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
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
      if (!hasFocusedRef.current) {
        previousFocusRef.current = document.activeElement;
      }

      document.body.style.overflow = "hidden";

      document.addEventListener("keydown", handleKeyDown);

      setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = getFocusableElements(modalRef.current);
          if (
            focusableElements.length > 0 &&
            document.activeElement !== focusableElements[0]
          ) {
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
        hasFocusedRef.current = true;
      }, 100);
    } else {
      hasFocusedRef.current = false;
    }

    return () => {
      document.body.style.overflow = "unset";

      document.removeEventListener("keydown", handleKeyDown);

      setTimeout(() => {
        const hasOpenModal =
          document.querySelector('[role="dialog"][aria-modal="true"]') !== null;

        const activeElement = document.activeElement;
        const isActiveElementInModal =
          activeElement &&
          (activeElement.closest('[role="dialog"]') !== null ||
            activeElement.closest('[aria-modal="true"]') !== null);

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
      <div
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />

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
