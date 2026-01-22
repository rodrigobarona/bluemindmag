"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { IconSend, IconCheck, IconX } from "@tabler/icons-react";
import { useReducedMotion, ANIMATION_CONFIG } from "@/lib/use-reduced-motion";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("Contact.form");
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");

      // Reset error message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  // Animation variants for staggered form fields
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : ANIMATION_CONFIG.stagger.base,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : ANIMATION_CONFIG.distance.small 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : ANIMATION_CONFIG.duration.base,
        ease: ANIMATION_CONFIG.ease.out,
      },
    },
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      {/* Name & Email Row */}
      <motion.div className="grid sm:grid-cols-2 gap-6" variants={itemVariants}>
        {/* Name */}
        <div className="group">
          <label
            htmlFor="name"
            className="block font-ui text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 group-focus-within:text-foreground transition-colors"
          >
            {t("name")}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={t("namePlaceholder")}
            className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border focus:border-brand focus:ring-0 transition-colors placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Email */}
        <div className="group">
          <label
            htmlFor="email"
            className="block font-ui text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 group-focus-within:text-foreground transition-colors"
          >
            {t("email")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder={t("emailPlaceholder")}
            className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border focus:border-brand focus:ring-0 transition-colors placeholder:text-muted-foreground/50"
          />
        </div>
      </motion.div>

      {/* Subject */}
      <motion.div className="group" variants={itemVariants}>
        <label
          htmlFor="subject"
          className="block font-ui text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 group-focus-within:text-foreground transition-colors"
        >
          {t("subject")}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder={t("subjectPlaceholder")}
          className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border focus:border-brand focus:ring-0 transition-colors placeholder:text-muted-foreground/50"
        />
      </motion.div>

      {/* Message */}
      <motion.div className="group" variants={itemVariants}>
        <label
          htmlFor="message"
          className="block font-ui text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 group-focus-within:text-foreground transition-colors"
        >
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder={t("messagePlaceholder")}
          className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border focus:border-brand focus:ring-0 transition-colors resize-none placeholder:text-muted-foreground/50"
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div className="pt-4" variants={itemVariants}>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-ui text-sm font-medium transition-all hover:bg-brand cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? (
            <>
              <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              <IconSend className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              {t("submit")}
            </>
          )}
        </button>
      </motion.div>

      {/* Status Messages with AnimatePresence */}
      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.div 
            className="flex items-center gap-3 p-5 bg-green-500/10 border border-green-500/20"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : ANIMATION_CONFIG.duration.base }}
          >
            <IconCheck className="h-5 w-5 text-green-600 shrink-0" />
            <p className="text-green-600">{t("success")}</p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div 
            className="flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/20"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : ANIMATION_CONFIG.duration.base }}
          >
            <IconX className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-red-600">{t("error")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
