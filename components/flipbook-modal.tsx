'use client';

import { useEffect, useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FlipbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  flipbookUrl: string;
  issueTitle: string;
}

export function FlipbookModal({
  isOpen,
  onClose,
  flipbookUrl,
  issueTitle,
}: FlipbookModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setIsLoaded(false);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="flipbook-title"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-fast"
              aria-label="Close flipbook"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Issue title (screen reader) */}
            <span id="flipbook-title" className="sr-only">
              Reading {issueTitle}
            </span>

            {/* Flipbook container */}
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] rounded-lg overflow-hidden">
              {/* Loading state */}
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-white/80 text-sm">Loading flipbook...</span>
                  </div>
                </div>
              )}

              {/* Flipbook iframe */}
              <iframe
                src={flipbookUrl}
                title={`${issueTitle} Flipbook`}
                className="w-full h-full"
                allowFullScreen
                onLoad={() => setIsLoaded(true)}
              />
            </div>

            {/* Keyboard hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">
              Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">ESC</kbd> to close
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to manage flipbook modal state
export function useFlipbookModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

