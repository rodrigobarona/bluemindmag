'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  variant?: 'default' | 'minimal' | 'hero' | 'footer' | 'inline';
  className?: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterForm({
  variant = 'default',
  className,
}: NewsletterFormProps) {
  const t = useTranslations('Newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage(t('errors.invalidEmail'));
      return;
    }

    startTransition(async () => {
      setStatus('loading');
      setErrorMessage('');

      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to subscribe');
        }

        setStatus('success');
        setEmail('');
      } catch (error) {
        setStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : t('errors.generic')
        );
      }
    });
  };

  // Success state
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'flex items-center justify-center gap-3 py-4',
          className
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
          <Check className="h-5 w-5 text-brand" />
        </div>
        <div className="text-left">
          <p className="font-medium text-foreground">{t('success.title')}</p>
          <p className="text-sm text-muted-foreground">
            {t('success.description')}
          </p>
        </div>
      </motion.div>
    );
  }

  // Hero variant - larger, more prominent
  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className={cn('w-full max-w-md', className)}>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            disabled={isPending}
            className={cn(
              'w-full rounded-full border bg-background px-6 py-4 pr-14 text-base',
              'placeholder:text-muted-foreground/60',
              'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
              'transition-all duration-200',
              'disabled:cursor-not-allowed disabled:opacity-50',
              status === 'error'
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border hover:border-foreground/20'
            )}
            aria-label={t('placeholder')}
            aria-invalid={status === 'error'}
          />
          <button
            type="submit"
            disabled={isPending || !email}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer',
              'flex h-10 w-10 items-center justify-center rounded-full',
              'bg-brand text-brand-foreground',
              'transition-all duration-200',
              'hover:scale-105 hover:opacity-90',
              'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            aria-label={t('submit')}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {status === 'error' && errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center gap-1.5 text-sm text-red-500"
            >
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    );
  }

  // Footer variant - for dark backgrounds with image overlay
  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit} className={cn('w-full', className)}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('placeholder')}
              disabled={isPending}
              className={cn(
                'w-full border-0 bg-white/10 backdrop-blur-sm px-5 py-4 text-base text-white',
                'placeholder:text-white/50',
                'focus:outline-none focus:ring-2 focus:ring-white/30',
                'transition-all duration-200',
                'disabled:cursor-not-allowed disabled:opacity-50',
                status === 'error' && 'ring-2 ring-red-400'
              )}
              aria-label={t('placeholder')}
              aria-invalid={status === 'error'}
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !email}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-8 py-4 cursor-pointer',
              'bg-white text-black font-ui text-sm font-medium',
              'transition-all duration-200',
              'hover:bg-brand hover:text-white',
              'focus:outline-none focus:ring-2 focus:ring-white/50',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                {t('submit')}
              </>
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {status === 'error' && errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center gap-1.5 text-sm text-red-300"
            >
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    );
  }

  // Inline variant - for CTAs with form next to text
  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={cn('w-full max-w-md', className)}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('placeholder')}
              disabled={isPending}
              className={cn(
                'w-full border bg-background px-4 py-3 text-base',
                'placeholder:text-muted-foreground/60',
                'focus:outline-none focus:ring-2 focus:ring-brand',
                'transition-all duration-200',
                'disabled:cursor-not-allowed disabled:opacity-50',
                status === 'error'
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-border hover:border-foreground/20'
              )}
              aria-label={t('placeholder')}
              aria-invalid={status === 'error'}
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !email}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3 cursor-pointer',
              'bg-foreground text-background font-ui text-sm font-medium',
              'transition-all duration-200',
              'hover:bg-brand',
              'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t('submit')
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {status === 'error' && errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center gap-1.5 text-sm text-red-500"
            >
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    );
  }

  // Minimal variant - inline, compact
  if (variant === 'minimal') {
    return (
      <form
        onSubmit={handleSubmit}
        className={cn('flex items-center gap-2', className)}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          disabled={isPending}
          className={cn(
            'flex-1 rounded-full border bg-background px-4 py-2 text-sm',
            'placeholder:text-muted-foreground/60',
            'focus:outline-none focus:ring-2 focus:ring-brand',
            'transition-all duration-200',
            'disabled:cursor-not-allowed disabled:opacity-50',
            status === 'error' ? 'border-red-500' : 'border-border'
          )}
          aria-label={t('placeholder')}
        />
        <button
          type="submit"
          disabled={isPending || !email}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full cursor-pointer',
            'bg-brand text-brand-foreground',
            'transition-all duration-200',
            'hover:opacity-90',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          aria-label={t('submit')}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </form>
    );
  }

  // Default variant - balanced
  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            disabled={isPending}
            className={cn(
              'w-full rounded-lg border bg-background px-4 py-3 text-base',
              'placeholder:text-muted-foreground/60',
              'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
              'transition-all duration-200',
              'disabled:cursor-not-allowed disabled:opacity-50',
              status === 'error'
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border hover:border-foreground/20'
            )}
            aria-label={t('placeholder')}
            aria-invalid={status === 'error'}
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !email}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 cursor-pointer',
            'bg-brand text-brand-foreground font-medium',
            'transition-all duration-200',
            'hover:opacity-90',
            'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            <>
              {t('submit')}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {status === 'error' && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 flex items-center gap-1.5 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

