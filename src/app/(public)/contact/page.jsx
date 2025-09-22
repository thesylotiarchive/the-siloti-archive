'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || 'Server error');

      setFormData({ name: '', email: '', message: '' });
      toast.success('Thanks — your message was sent!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-20">
      <h1 className="relative text-3xl sm:text-4xl font-bold text-[#1276AB] text-center mb-10 after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-[3px] after:bg-[#D4A574]">
        Contact Us
      </h1>

      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
        Have questions, feedback, or want to contribute to the archive?
        We'd love to hear from you.
      </p>

      <ul className="space-y-4 text-sm text-muted-foreground mb-12">
        <li className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-brand-blue" />
          <a
            href="mailto:silotiarchivercc@gmail.com"
            className="text-brand-blue hover:underline"
          >
            silotiarchivercc@gmail.com
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-brand-blue" />
          <a
            href="tel:+919957116126"
            className="text-brand-blue hover:underline"
          >
            +91&nbsp;99571&nbsp;16126
          </a>
        </li>
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2 bg-background text-foreground placeholder:text-muted-foreground"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2 bg-background text-foreground placeholder:text-muted-foreground"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2 bg-background text-foreground placeholder:text-muted-foreground"
          required
        />
        <button
          type="submit"
          className="bg-[#74C043] hover:bg-[#0A65A8] text-white font-medium px-6 py-2 rounded transition"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </main>
  );
}
