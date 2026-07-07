import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import API from "../api/axios";
import Card from '../components/Card'

export default function Hero() {
  const [bestSellingBooks, setBestSellingBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBestSellingBooks = async () => {
      try {
        const res = await API.get('/analytics/top-selling')
        setBestSellingBooks(res.data.data)
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    };
    fetchBestSellingBooks();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#faf7f2] text-[#1a1208] font-sans overflow-hidden relative flex flex-col">
        {/* Hero */}
        <section className="flex-1 grid grid-cols-2 items-start px-30 py-6 gap-8 relative z-10">

          {/* Left */}
          <div className="max-w-[560px]">
            <div className="inline-flex items-center gap-3 text-[#b87333] text-[11px] font-semibold tracking-[0.22em] uppercase mb-5 animate-[fadeUp_0.6s_ease_0.1s_forwards] ">
              <span className="block w-8 h-px bg-[#b87333]" />
              New Arrivals · Spring 2026
            </div>

            <h1 className="font-serif text-[clamp(2.8rem,5.5vw,5rem)] font-black leading-[1.02] tracking-tight text-[#1a1208] mb-5 animate-[fadeUp_0.7s_ease_0.2s_forwards] ">
              Find Your Next{" "}
              <em className="italic text-[#b87333] relative">
                Great
                <span className="absolute left-0 right-0 -bottom-1.5 h-[3px] bg-[repeating-linear-gradient(90deg,#b87333_0,#b87333_6px,transparent_6px,transparent_10px)] rounded" />
              </em>{" "}
              Read.
            </h1>

            <p className="text-base leading-relaxed text-[#5a4a30] max-w-[420px] mb-9 animate-[fadeUp_0.7s_ease_0.35s_forwards] ">
              Curated collections across every genre — from timeless classics to
              this week's debut novels. Free shipping on orders over $35.
            </p>

            <div className="flex items-center gap-5 animate-[fadeUp_0.7s_ease_0.5s_forwards] ">
              <Link
                to="/shop"
                className="bg-[#1a1208] text-[#faf7f2] px-8 py-3.5 text-[11px] font-semibold tracking-widest uppercase hover:bg-[#3a2a10] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[4px_6px_0px_#b87333] hover:shadow-[6px_8px_0px_#b87333] no-underline"
              >
                Shop Now
              </Link>
              <Link
                to="/genres"
                className="border border-[#c4a870] text-[#5a4a30] px-7 py-3.5 text-[11px] font-semibold tracking-widest uppercase hover:border-[#1a1208] hover:text-[#1a1208] transition-all hover:-translate-y-0.5 no-underline"
              >
                Browse Genres
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-12 pt-7 border-t-2 border-[rgba(180,140,80,0.2)] animate-[fadeUp_0.7s_ease_0.65s_forwards]">
              {[
                { num: "50K+", label: "Titles" },
                { num: "4.9★", label: "Avg Rating" },
                { num: "200K", label: "Readers" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className="font-serif text-3xl font-bold text-[#1a1208]">{num}</div>
                  <div className="text-[10px] tracking-[0.14em] uppercase text-[#9a8060] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Book Stack */}
          <div className="relative h-[460px] flex items-center justify-center animate-[fadeIn_1s_ease_0.4s_forwards] ">
            {/* Shelf card */}
            <div className="absolute w-80 h-[360px] bg-[#fff8ee] border border-[rgba(180,140,80,0.2)] rounded-lg shadow-[12px_16px_0px_#e8d5b0]" />

            {/* Books */}
            <div className="absolute w-32 h-[190px] rounded-sm bg-gradient-to-br from-[#e8c99a] to-[#c47a35] top-20 left-[calc(50%-120px)] -rotate-[5deg] shadow-xl animate-[float1_5s_ease-in-out_infinite] z-10">
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/10 rounded-l-sm" />
              <div className="absolute top-5 left-5 right-3 space-y-1.5">
                <div className="h-0.5 w-3/4 bg-white/35 rounded" />
                <div className="h-0.5 w-1/2 bg-white/25 rounded" />
              </div>
            </div>

            <div className="absolute w-28 h-[175px] rounded-sm bg-gradient-to-br from-[#aed1b5] to-[#4a8c5c] top-24 left-[calc(50%-55px)] rotate-[2deg] shadow-xl animate-[float2_6.5s_ease-in-out_infinite] z-20">
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/10 rounded-l-sm" />
              {/* Spinning badge */}
              <span className="absolute -top-2.5 -right-2.5 w-11 h-11 rounded-full bg-[#1a1208] text-[#faf7f2] text-[8px] font-bold border-2 border-[#b87333] flex items-center justify-center text-center leading-tight ">
                New<br />Drop
              </span>
            </div>

            <div className="absolute w-[105px] h-[160px] rounded-sm bg-gradient-to-br from-[#b5c9e8] to-[#4a6a9c] top-28 left-[calc(50%+15px)] rotate-[8deg] shadow-xl animate-[float3_4.5s_ease-in-out_infinite] z-10">
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/10 rounded-l-sm" />
            </div>

            {/* Shelf plank */}
            <div className="absolute h-2 w-[270px] bg-linear-to-r from-[#d4a86a] to-[#c49050] rounded shadow-[0_4px_8px_rgba(180,120,50,0.25)] top-[286px] z-30" />

            {/* Genre tags */}
            {[
              { label: "Fiction", cls: "top-7 right-5 animate-[float1_7s_ease-in-out_infinite]" },
              { label: "Mystery", cls: "bottom-16 left-2 animate-[float2_5.5s_ease-in-out_infinite]" },
              { label: "Non-fiction", cls: "top-12 left-3 animate-[float3_6.5s_ease-in-out_infinite]" },
            ].map(({ label, cls }) => (
              <span
                key={label}
                className={`absolute ${cls} bg-[#fff8ee] border border-[#e0c890] text-[#7a5a20] text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-sm shadow-[2px_3px_0_#e0c890] z-10`}
              >
                {label}
              </span>
            ))}

            {/* Rating card */}
            <div className="absolute bottom-8 right-2 bg-white border border-[rgba(180,140,80,0.25)] rounded-lg p-3 shadow-[4px_6px_0_#e8d5b0] z-20 animate-[float2_5s_ease-in-out_infinite] min-w-[120px]">
              <div className="text-[#f0a020] text-sm tracking-wide">★★★★★</div>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-[#5a4a30] mt-0.5">Top Rated Shop</div>
            </div>
          </div>
        </section>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-12 flex items-center gap-3 text-[10px] tracking-[0.18em] uppercase text-[#9a8060] z-20 animate-[fadeIn_1s_ease_1s_forwards]">
          <span className="w-9 h-px bg-[#e0c890] relative overflow-hidden block">
            <span className="absolute inset-y-0 w-full bg-[#b87333] animate-[slide_2s_ease-in-out_infinite]" />
          </span>
          Scroll to explore
        </div>
      </div>

      <section className="mx-5 sm:mx-10 lg:mx-20 my-4 rounded-lg overflow-hidden relative bg-[#1a1208] text-[#faf7f2] px-8 sm:px-14 py-12 flex flex-col sm:flex-row items-center justify-between gap-8">
        {/* Decorative lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #b87333 0, #b87333 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px"
        }} />
        <div className="relative z-10">
          <div className="text-[#b87333] text-[10px] tracking-[0.22em] uppercase font-semibold mb-2">Limited Time Offer</div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mb-2">
            Get 20% off your <br className="hidden sm:block" />
            <em className="italic text-[#e8c070]">first order</em>
          </h3>
          <p className="text-[#c4a870] text-sm max-w-xs">
            Sign up for our newsletter and receive an exclusive discount code instantly.
          </p>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="bg-white/10 border border-[#b87333]/40 text-[#faf7f2] placeholder-[#9a8060] px-4 py-3 text-sm focus:outline-none focus:border-[#b87333] rounded-sm w-full sm:w-56"
          />
          <button className="bg-[#b87333] hover:bg-[#d4944a] text-[#1a1208] px-6 py-3 text-[11px] font-bold tracking-widest uppercase transition-colors whitespace-nowrap rounded-sm">
            Claim Offer
          </button>
        </div>
      </section>

      {/* <section>
        <h1>Best Sellers</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellingBooks.map((book) => (
                
                <Card
                  key={book._id}
                  id={book._id}
                  title={book.title}
                  author={book.author}
                  genre={book.category.name}
                  price={book.price}
                  originalPrice={book.price + book.price * (10 / 100)}
                  badge="Sale"
                  image={book.image.url}
                  onAddToCart={(book) => console.log(book)}
                />
              ))}
            </div>
      </section> */}
    </>



  );
}