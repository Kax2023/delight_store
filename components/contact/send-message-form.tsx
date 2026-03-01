"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { toast } from "react-hot-toast";

const inputBase =
  "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-400/20";
const inputNormal = "border-slate-200/70 focus:border-emerald-400/60";
const inputError = "border-red-400 focus:border-red-500";

type FieldErrors = {
  name?: boolean;
  email?: boolean;
  subject?: boolean;
  message?: boolean;
  consent?: boolean;
};

export function SendMessageForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const n = name.trim();
    const e = email.trim();
    const s = subject.trim();
    const m = message.trim();
    const newErrors: FieldErrors = {};
    if (!n) newErrors.name = true;
    if (!e) newErrors.email = true;
    if (!s) newErrors.subject = true;
    if (!m) newErrors.message = true;
    if (!consent) newErrors.consent = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e)) {
      setErrors((prev) => ({ ...prev, email: true }));
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject: subject.trim(),
          message: message.trim(),
          consent: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Failed to send message.");
        return;
      }
      toast.success("Message sent! We'll get back to you soon.");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setConsent(false);
      setErrors({});
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
            }}
            className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: false }));
            }}
            className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`${inputBase} ${inputNormal}`}
            placeholder="+255 XXX XXX XXX"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (errors.subject) setErrors((prev) => ({ ...prev, subject: false }));
            }}
            className={`${inputBase} ${errors.subject ? inputError : inputNormal}`}
            placeholder="What is this regarding?"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: false }));
          }}
          rows={6}
          className={`resize-none ${inputBase} ${errors.message ? inputError : inputNormal}`}
          placeholder="Tell us how we can help you..."
        />
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="consent"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (errors.consent) setErrors((prev) => ({ ...prev, consent: false }));
          }}
          className={`mt-1 mr-2 accent-emerald-600 ${errors.consent ? "ring-2 ring-red-400 ring-offset-1 rounded" : ""}`}
        />
        <label htmlFor="consent" className="text-sm text-slate-600">
          I agree to be contacted by DelightStore regarding my inquiry.
        </label>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto px-8 py-3 text-base font-semibold rounded-full"
        >
          {submitting ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Send className="h-5 w-5 mr-2 inline" />
              Send Message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
