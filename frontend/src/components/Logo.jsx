import React from "react";
import { Link, NavLink } from 'react-router-dom';

export default function Logo() {
    return (
        <>
            <Link to="/" className="flex items-center gap-3 group">
                {/* Book icon */}
                <svg width="30" height="30" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="68" width="60" height="4" rx="2" fill="#D4A030" opacity="0.9" />
                    <path d="M38 62 C38 62 28 56 8 54 L8 10 C28 12 38 18 38 18 Z" fill="#C8922A" opacity="0.85" />
                    <path d="M42 62 C42 62 52 56 72 54 L72 10 C52 12 42 18 42 18 Z" fill="#E8B84B" opacity="0.95" />
                    <rect x="37" y="10" width="6" height="52" rx="2" fill="#C8922A" />
                </svg>

                {/* Wordmark */}
                <div className="flex items-baseline gap-1 leading-none">
                    <span
                        className="text-2xl font-bold italic text-[#b87333] tracking-tight"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        Golden
                    </span>
                    <span
                        className="text-2xl font-normal text-orange-900 tracking-wide"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        Shelf
                    </span>
                </div>
            </Link>
        </>
    )
}