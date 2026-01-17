'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconMaximize, IconX } from '@tabler/icons-react';

interface FlipbookViewerProps {
  src: string;
  title: string;
  accentColor?: string;
}

export function FlipbookViewer({
  src,
  title,
  accentColor = '#0097B2',
}: FlipbookViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      {/* Regular embedded view */}
      <div className="relative group">
        <div className="flipbook-container rounded-lg overflow-hidden shadow-2xl">
          <iframe
            src={src}
            title={title}
            className="w-full h-full"
            allow="clipboard-write; autoplay; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Fullscreen button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="cursor-pointer absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
          aria-label="View fullscreen"
          style={{
            '--tw-ring-color': accentColor,
          } as React.CSSProperties}
        >
          <IconMaximize className="h-5 w-5" />
        </button>
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            {/* Close button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="cursor-pointer absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Close fullscreen"
            >
              <IconX className="h-6 w-6" />
            </button>

            {/* Fullscreen iframe */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full h-full"
            >
              <iframe
                src={src}
                title={`${title} - Fullscreen`}
                className="w-full h-full"
                allow="clipboard-write; autoplay; fullscreen"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Compact preview version
export function FlipbookPreview({
  src,
  title,
  accentColor = '#0097B2',
}: FlipbookViewerProps) {
  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl"
      style={{
        boxShadow: `0 0 0 1px ${accentColor}20`,
      }}
    >
      <div className="aspect-video relative">
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="clipboard-write; autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}

