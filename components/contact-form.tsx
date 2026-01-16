'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconSend, IconCheck, IconX } from '@tabler/icons-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const t = useTranslations('Contact.form');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');

      // Reset error message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-2"
        >
          {t('name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder={t('namePlaceholder')}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent transition-all placeholder:text-muted-foreground"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-2"
        >
          {t('email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder={t('emailPlaceholder')}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent transition-all placeholder:text-muted-foreground"
        />
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium mb-2"
        >
          {t('subject')}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder={t('subjectPlaceholder')}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent transition-all placeholder:text-muted-foreground"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium mb-2"
        >
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder={t('messagePlaceholder')}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full flex items-center justify-center gap-2 bg-brand text-brand-foreground px-6 py-4 rounded-full font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? (
          <>
            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {t('submitting')}
          </>
        ) : (
          <>
            <IconSend className="h-5 w-5" />
            {t('submit')}
          </>
        )}
      </button>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="flex items-center gap-2 p-4 bg-green-500/10 text-green-500 rounded-lg">
          <IconCheck className="h-5 w-5" />
          <p>{t('success')}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 text-red-500 rounded-lg">
          <IconX className="h-5 w-5" />
          <p>{t('error')}</p>
        </div>
      )}
    </form>
  );
}

