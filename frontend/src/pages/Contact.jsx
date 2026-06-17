import React, { useState } from "react";
import { useEffect } from "react";

/* ---------- Hero Section ---------- */
function ContactHero() {
  return (
    <section className="relative px-6 sm:px-10 lg:px-24 py-28 sm:py-36 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80"
        alt="Warmly lit library shelves stacked with books"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#1a1208]/70" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #faf7f2 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="h-px w-8 bg-[#e0c890]" />
          <span className="text-[#e0c890] text-[11px] tracking-[0.22em] uppercase font-bold">
            We're Listening
          </span>
          <span className="h-px w-8 bg-[#e0c890]" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mb-5 tracking-tight text-[#faf7f2]">
          Get in Touch
        </h1>
        <p className="text-[#faf7f2]/80 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
          We're here to help you with books, orders, and support.
        </p>
      </div>
    </section>
  );
}

/* ---------- Map Embed (left side of form) ---------- */
function MapEmbed() {
  return (
    <div className="relative h-full">
      <div className="relative rounded-2xl overflow-hidden shadow-[10px_14px_0px_#e8d5b0] border border-[rgba(180,140,80,0.3)] h-72 lg:h-full min-h-[420px]">
        <iframe
          title="Map showing our location in Lalitpur"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53745.271276589156!2d85.28195217030014!3d27.65746270977327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19d3cf18ca51%3A0xd10ec3d53656e18f!2sLalitpur!5e1!3m2!1sen!2snp!4v1781687361207!5m2!1sen!2snp"
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-[4px_6px_0px_#e8d5b0] text-xs font-semibold text-[#1a1208]">
        Lalitpur, Nepal
      </div>
    </div>
  );
}

/* ---------- Contact Form Section ---------- */
function ContactForm() {
  const handleSubmit = (e) => {
    e.preventDefault(); // static form, no backend action
  };

  return (
    <section className="px-6 sm:px-10 lg:px-24 py-20 lg:py-28 bg-[#faf7f2]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#b87333]" />
            <span className="text-[#b87333] text-[11px] tracking-[0.22em] uppercase font-bold">
              Send a Message
            </span>
            <span className="h-px w-8 bg-[#b87333]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-black leading-tight">
            Let's Talk Books
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
          <MapEmbed />

          <div className="relative">

            <div className="bg-white border border-[rgba(180,140,80,0.3)] rounded-2xl shadow-[10px_14px_0px_#e8d5b0] p-7 sm:p-10 h-full">
              <form onSubmit={handleSubmit} className="grid gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[11px] uppercase tracking-widest text-[#5a4a30] font-semibold mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 bg-[#faf7f2] border-2 border-[#e0c890] focus:border-[#b87333] focus:bg-white focus:ring-4 focus:ring-[#b87333]/10 outline-none text-sm rounded-md transition-all placeholder:text-[#b0a585]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] uppercase tracking-widest text-[#5a4a30] font-semibold mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    className="w-full px-4 py-3.5 bg-[#faf7f2] border-2 border-[#e0c890] focus:border-[#b87333] focus:bg-white focus:ring-4 focus:ring-[#b87333]/10 outline-none text-sm rounded-md transition-all placeholder:text-[#b0a585]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-[11px] uppercase tracking-widest text-[#5a4a30] font-semibold mb-2"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3.5 bg-[#faf7f2] border-2 border-[#e0c890] focus:border-[#b87333] focus:bg-white focus:ring-4 focus:ring-[#b87333]/10 outline-none text-sm rounded-md transition-all placeholder:text-[#b0a585]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[11px] uppercase tracking-widest text-[#5a4a30] font-semibold mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    placeholder="Write your message..."
                    className="w-full px-4 py-3.5 bg-[#faf7f2] border-2 border-[#e0c890] focus:border-[#b87333] focus:bg-white focus:ring-4 focus:ring-[#b87333]/10 outline-none text-sm resize-none rounded-md transition-all placeholder:text-[#b0a585]"
                  />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                  <p className="text-xs text-[#9a8060]">
                    We never share your information.
                  </p>
                  <button
                    type="submit"
                    className="bg-[#b87333] hover:bg-[#a3621f] text-white px-8 py-3.5 text-[11px] font-bold tracking-widest uppercase transition-all active:translate-y-0.5 active:translate-x-0.5 active:shadow-none rounded-md shadow-[4px_6px_0px_#1a1208]"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact Information Section ---------- */
function ContactInfo() {
  const items = [
    { icon: "✉", label: "Email", value: "hello@bookstore.com" },
    { icon: "☎", label: "Phone", value: "(555) 012-3456" },
    { icon: "◷", label: "Support Hours", value: "Mon–Fri, 9am–5pm" },
    { icon: "◉", label: "Location", value: "Lalitpur, Nepal" },
  ];

  return (
    <section className="px-6 sm:px-10 lg:px-24 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#b87333]" />
            <span className="text-[#b87333] text-[11px] tracking-[0.22em] uppercase font-bold">
              Reach Us
            </span>
            <span className="h-px w-8 bg-[#b87333]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-black leading-tight">
            Other Ways to Connect
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl border border-[rgba(180,140,80,0.2)] shadow-[6px_8px_0px_#e8d5b0] p-7 text-center hover:-translate-y-1 transition-transform"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-[#1a1208] text-[#e0c890] text-xl flex items-center justify-center mb-5">
                <span aria-hidden="true">{item.icon}</span>
              </div>
              <div className="text-[11px] uppercase tracking-widest text-[#9a8060] font-semibold mb-2">
                {item.label}
              </div>
              <div className="text-sm font-medium text-[#1a1208]">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ Section ---------- */
function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-[rgba(180,140,80,0.25)] rounded-xl bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[#faf7f2] transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-serif text-base font-bold text-[#1a1208]">
          {question}
        </span>
        <span
          className={`shrink-0 w-7 h-7 rounded-full border border-[#b87333] text-[#b87333] flex items-center justify-center text-sm font-bold transition-transform ${isOpen ? "rotate-45" : ""
            }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        className={`px-6 text-sm text-[#5a4a30] leading-relaxed transition-all duration-300 ${isOpen ? "max-h-40 pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
          } overflow-hidden`}
      >
        {answer}
      </div>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "Once your order is confirmed and shipped, you will receive a tracking link via email and SMS (if enabled). This link allows you to monitor your package in real time, including dispatch status, transit updates, and estimated delivery date. You can also check your order status anytime from your account dashboard under the 'My Orders' section.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a hassle-free refund policy for eligible returns. If the book is unread, undamaged, and in its original packaging, you may request a return within 30 days of delivery. Once we receive and inspect the item, your refund will be processed to the original payment method within 5–7 business days.",
    },
    {
      question: "How long is delivery?",
      answer:
        "Delivery times typically range between 3–5 business days for domestic orders. However, delivery may vary depending on your location, courier availability, and external factors such as holidays or weather conditions. International deliveries may take 7–15 business days depending on the destination country and customs clearance.",
    },
    {
      question: "Can I change my order after placing it?",
      answer:
        "Yes, you can request modifications to your order, such as changing the delivery address or updating items, within 1 hour of placing it. After this window, your order may already be processed or shipped, in which case changes may no longer be possible. Please contact our support team as soon as possible for assistance.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Absolutely! We ship to many countries worldwide. International shipping times and costs vary depending on the destination and local courier partners. During checkout, you will see available shipping options along with estimated delivery times and fees specific to your region.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="px-6 sm:px-10 lg:px-24 py-20 lg:py-28 bg-[#faf7f2]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#b87333]" />
            <span className="text-[#b87333] text-[11px] tracking-[0.22em] uppercase font-bold">
              FAQ
            </span>
            <span className="h-px w-8 bg-[#b87333]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-black leading-tight">
            Common Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function Contact() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-white text-[#1a1208] font-sans">
      <ContactHero />
      <ContactForm />
      <ContactInfo />
      <FAQSection />
    </div>
  );
}