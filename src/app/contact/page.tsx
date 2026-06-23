import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Contact — Makerspace @ Suncoast",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-indigo-50">
      <div className="mx-auto max-w-2xl px-4 py-12">

        {/* Header */}
        <ScrollReveal direction="up">
          <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500">Contact</span>
          <h1 className="text-4xl font-black text-gray-900 mt-1 mb-2">Get in Touch</h1>
          <p className="text-gray-500 text-sm mb-8">
            Questions about joining, sponsorships, or just want to know more? Reach out below.
          </p>
        </ScrollReveal>

        {/* Email card */}
        <ScrollReveal direction="up" delay={100}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-800 text-lg mb-1">Email Us</h2>
          <p className="text-sm text-gray-500 mb-3">
            For general inquiries, sponsorship opportunities, or membership questions.
          </p>
          <a
            href="mailto:suncoastmakerspace@gmail.com"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline text-sm"
          >
            suncoastmakerspace@gmail.com
          </a>
        </div>
        </ScrollReveal>

        {/* Google Form */}
        <ScrollReveal direction="up" delay={150}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-1">Contact Form</h2>
          <p className="text-sm text-gray-500 mb-4">
            Fill out this form and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfybisTpN7a_mE3jaZP5JwC3uNcbQeLQNSfhO941Sl_gQ_gzA/viewform?embedded=true"
              width="100%"
              height="600"
              title="Makerspace Contact Form"
              style={{ border: 0 }}
              loading="lazy"
            >
              Loading form…
            </iframe>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            If the form doesn&apos;t load,{" "}
            <a
              href="mailto:suncoastmakerspace@gmail.com"
              className="text-indigo-600 hover:underline"
            >
              email us directly
            </a>
            .
          </p>
        </div>
        </ScrollReveal>

        {/* Social Media */}
        <ScrollReveal direction="left" delay={100}>
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-1">Follow Us</h2>
          <p className="text-sm text-gray-500 mb-4">Stay up-to-date on builds, events, and announcements.</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Instagram</p>
                <span className="text-xs text-gray-400 italic">Link coming soon — fill in</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.084.12 18.11.143 18.127a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Discord</p>
                <span className="text-xs text-gray-400 italic">Link coming soon — fill in</span>
              </div>
            </div>
          </div>
        </div>

        </ScrollReveal>

        {/* Location */}
        <ScrollReveal direction="right" delay={100}>
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-1">Find Us</h2>
          <p className="text-sm text-gray-500">
            Suncoast Community High School<br />
            1717 Avenue S, Riviera Beach, FL 33404<br />
            <span className="text-indigo-600 font-medium">Meetings: Every Tuesday after school (2:40 PM)</span>
          </p>
        </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
