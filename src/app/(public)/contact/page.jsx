'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Mail, Phone, Sparkles } from "lucide-react";

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
      Swal.fire({
        title: 'Message Sent!',
        text: 'Thanks — your message has been successfully received.',
        icon: 'success',
        confirmButtonColor: '#10b981', // matching emerald-500
        background: '#0f172a', // matching slate-900
        color: '#fff',
        customClass: {
          popup: 'rounded-3xl border border-white/10 shadow-2xl'
        }
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Submission Failed',
        text: err.message || 'Something went wrong while sending your message.',
        icon: 'error',
        confirmButtonColor: '#ef4444', // matching red-500
        background: '#0f172a',
        color: '#fff',
        customClass: {
          popup: 'rounded-3xl border border-white/10 shadow-2xl'
        }
      });
    } finally {
      setStatus('idle');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-emerald-400 selection:text-slate-950 pt-28 pb-20">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
          <div className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md animate-luxury-float">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              Get In Touch
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-none mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl font-serif italic font-bold">
              Contact Us
            </span>
          </h1>
          <p className="text-sm sm:text-base text-white/50 font-light max-w-xl leading-relaxed font-sans">
            Have questions, feedback, or want to contribute to the archive? We'd love to hear from you.
          </p>
        </div>

        {/* Contact info badges */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full max-w-xl justify-center">
          <a
            href="mailto:silotiarchivercc@gmail.com"
            className="flex-1 bg-white/[0.02] border border-white/10 hover:border-emerald-400/30 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:bg-white/[0.04]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold font-sans">Email Us</span>
              <span className="text-xs font-semibold text-white/80 font-mono">silotiarchivercc@gmail.com</span>
            </div>
          </a>

          <a
            href="tel:+919957116126"
            className="flex-1 bg-white/[0.02] border border-white/10 hover:border-emerald-400/30 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:bg-white/[0.04]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold font-sans">Call Us</span>
              <span className="text-xs font-semibold text-white/80 font-mono">+91 99571 16126</span>
            </div>
          </a>
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-xl bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2 font-semibold font-sans">Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 transition-colors font-sans"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2 font-semibold font-sans">Your Email</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 transition-colors font-sans"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2 font-semibold font-sans">Your Message</label>
              <textarea
                name="message"
                placeholder="Write your message here..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 transition-colors resize-none font-sans"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-6 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              disabled={status === 'loading'}
            >
              <span>{status === 'loading' ? 'Sending Message...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
