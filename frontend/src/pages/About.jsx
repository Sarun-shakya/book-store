import React from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaTags,
  FaShippingFast,
  FaLock,
  FaSearch,
  FaHandsHelping,
} from "react-icons/fa";
import { useEffect } from "react";

const features = [
  {
    icon: FaBookOpen,
    title: "Wide Collection",
    desc: "Over 10,000 titles spanning fiction, non-fiction, academic, and rare finds — something for every reader.",
  },
  {
    icon: FaTags,
    title: "Affordable Pricing",
    desc: "Honest prices and regular discounts, because great stories shouldn't come with a steep price tag.",
  },
  {
    icon: FaShippingFast,
    title: "Fast Delivery",
    desc: "Most orders ship within 24 hours and arrive carefully packaged, right to your doorstep.",
  },
  {
    icon: FaLock,
    title: "Secure Payment",
    desc: "Encrypted checkout and trusted payment partners keep every transaction safe and simple.",
  },
  {
    icon: FaSearch,
    title: "Easy Search & Categories",
    desc: "Find your next read in seconds with smart filters, genres, and curated collections.",
  },
  {
    icon: FaHandsHelping,
    title: "Reader-First Support",
    desc: "Our team of fellow book-lovers is on hand to help with orders, recommendations, or questions.",
  },
];

const team = [
  {
    name: "Eleanor Wright",
    role: "Founder & Curator",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Started the store from a single shelf of secondhand novels and a love of good stories.",
  },
  {
    name: "Marcus Chen",
    role: "Store Manager",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Keeps every order running smoothly, from warehouse shelf to your front door.",
  },
  {
    name: "Priya Nair",
    role: "Lead Developer",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    bio: "Builds and maintains the online shelves so browsing feels as good as it looks.",
  },
  {
    name: "Daniel Ostrowski",
    role: "Customer Experience Lead",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Makes sure every reader's question gets a warm, quick, and helpful answer.",
  },
];

const stats = [
  { value: "10,000+", label: "Books" },
  { value: "5,000+", label: "Happy Readers" },
  { value: "50+", label: "Authors" },
  { value: "24/7", label: "Support" },
];

export default function About() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-white text-[#1a1208] font-sans">

      {/* Hero Section */}
      <section className="relative px-6 sm:px-10 lg:px-24 pt-20 pb-24 bg-[#faf7f2] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1a1208 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-[#b87333]" />
              <span className="text-[#b87333] text-[11px] tracking-[0.22em] uppercase font-bold">
                Our Story
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mb-6 tracking-tight">
              About Our
              <br />
              Book Store
            </h1>
            <p className="text-[#5a4a30] text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              Your gateway to knowledge, stories, and imagination our bookstore is dedicated to bringing you carefully curated
              collections that inspire, educate, and entertain. Every book is chosen with care and delivered with love.
            </p>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 bg-[#1a1208] text-[#faf7f2] px-8 py-4 text-[11px] font-bold tracking-widest uppercase hover:bg-[#3a2a10] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all shadow-[4px_6px_0px_#b87333] rounded-md"
            >
              Browse Books
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 border-2 border-[#e0c890] rounded-2xl rotate-2" />
            <img
              // src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80"
              src="https://images.unsplash.com/photo-1741708011528-e4874c6d869e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8"
              alt="Rows of warmly lit bookshelves filled with books"
              className="relative w-full h-[320px] sm:h-[420px] object-cover rounded-2xl shadow-[10px_14px_0px_#e8d5b0]"
            />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="px-6 sm:px-10 lg:px-24 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1000&q=80"
              alt="Open book resting on a wooden table with soft natural light"
              className="w-full h-[360px] sm:h-[440px] object-cover rounded-2xl shadow-[10px_14px_0px_#e8d5b0]"
            />
          </div>

          <div className="order-1 lg:order-2 max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-[#b87333]" />
              <span className="text-[#b87333] text-[11px] tracking-[0.22em] uppercase font-bold">
                Who We Are
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black mb-6 leading-tight">
              A Passion Built on Pages
            </h2>
            <div className="space-y-5 text-[#5a4a30] text-base leading-relaxed">
              <p>
                What began as a small corner shop stacked floor to ceiling
                with secondhand novels has grown into a home for readers
                everywhere. Every title on our shelves is chosen with the
                same care we gave that very first stack — because we believe
                books deserve to be handled, not just sold.
              </p>
              <p>
                Our mission is simple:{" "}
                <span className="font-semibold text-[#1a1208]">
                  deliver knowledge, stories, and imagination to anyone who
                  seeks them
                </span>
                . From timeless classics to the latest releases, we work to
                make sure every reader finds something that feels like it was
                picked just for them.
              </p>
              <p>
                Today, that same shop lives online, reaching readers across
                the world without ever losing its bookshop heart. Wherever
                you're reading from, we're glad to have you on our shelves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-6 sm:px-10 lg:px-24 py-20 lg:py-28 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-8 bg-[#b87333]" />
              <span className="text-[#b87333] text-[11px] tracking-[0.22em] uppercase font-bold">
                Why Choose Us
              </span>
              <span className="h-px w-8 bg-[#b87333]" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-black leading-tight">
              Reading Made Simple
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;

              return (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl border border-[rgba(180,140,80,0.2)] shadow-[6px_8px_0px_#e8d5b0] p-8 hover:-translate-y-1 transition-transform"
                >
                  <div className="w-14 h-14 rounded-full bg-[#1a1208] flex items-center justify-center mb-5">
                    <Icon className="text-2xl text-[#f5e6c8]" />
                  </div>

                  <h3 className="font-serif text-lg font-bold mb-2">
                    {f.title}
                  </h3>

                  <p className="text-sm text-[#5a4a30] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 sm:px-10 lg:px-24 py-20 bg-[#1a1208]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center py-8 px-4 rounded-2xl border border-[rgba(180,140,80,0.3)]"
            >
              <div className="font-serif text-3xl sm:text-4xl font-black text-[#e0c890] mb-2">
                {s.value}
              </div>
              <div className="text-[11px] uppercase tracking-widest text-[#faf7f2]/70 font-semibold">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="px-6 sm:px-10 lg:px-24 py-20 lg:py-28 bg-[#faf7f2] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-black mb-5 leading-tight">
            Ready for Your Next Great Read?
          </h2>
          <p className="text-[#5a4a30] text-base leading-relaxed mb-9 max-w-md mx-auto">
            Explore thousands of titles waiting to be discovered, from
            timeless classics to your next favorite story.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 bg-[#b87333] hover:bg-[#a3621f] text-white px-9 py-4 text-[11px] font-bold tracking-widest uppercase transition-all active:translate-y-0.5 active:translate-x-0.5 active:shadow-none rounded-md shadow-[4px_6px_0px_#1a1208]"
          >
            Explore Collection
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}