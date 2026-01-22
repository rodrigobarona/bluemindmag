"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconCoffee, IconCalendar, IconX } from "@tabler/icons-react";

interface CalcomDialogProps {
  calcomUrl: string;
  triggerLabel: string;
  triggerSubLabel?: string;
  className?: string;
}

export function CalcomDialog({
  calcomUrl,
  triggerLabel,
  triggerSubLabel,
  className,
}: CalcomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Add embed parameter to Cal.com URL
  const embedUrl = calcomUrl.includes("?")
    ? `${calcomUrl}&embed=true`
    : `${calcomUrl}?embed=true`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Custom trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group flex items-center gap-4 p-5 bg-muted/50 rounded-xl hover:bg-brand/10 border border-transparent hover:border-brand/20 transition-all w-full text-left !cursor-pointer ${className}`}
      >
        <div className="p-3 bg-brand/10 rounded-full group-hover:bg-brand/20 transition-colors">
          <IconCoffee className="h-6 w-6 text-brand" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-lg group-hover:text-brand transition-colors">
            {triggerLabel}
          </p>
          {triggerSubLabel && (
            <p className="text-sm text-muted-foreground">{triggerSubLabel}</p>
          )}
        </div>
        <IconCalendar className="h-5 w-5 text-muted-foreground group-hover:text-brand transition-colors" />
      </button>

      {/* Dialog with Cal.com embed */}
      <DialogPortal>
        {/* Custom backdrop with blur */}
        <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
        
        <DialogContent
          className="
            p-0 overflow-hidden rounded-2xl shadow-2xl
            bg-[#EEEFF2] dark:bg-[#0F0F0F]
            /* Mobile: full screen */
            w-[calc(100%-2rem)] h-[90vh] max-w-none
            /* Desktop: wider with proper height */
            lg:w-[1100px] lg:h-[680px] lg:max-w-[90vw] lg:max-h-[85vh]
          "
          showCloseButton={false}
        >
          {/* Accessible title (visually hidden) */}
          <DialogTitle className="sr-only">Schedule a meeting</DialogTitle>

          {/* Custom close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black transition-colors shadow-md"
            aria-label="Close dialog"
          >
            <IconX className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Cal.com iframe */}
          <iframe
            src={embedUrl}
            className="w-full h-full min-h-[90vh] lg:min-h-[680px] border-0"
            title="Schedule a meeting with Pedro Seixas"
            allow="camera; microphone; payment"
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
