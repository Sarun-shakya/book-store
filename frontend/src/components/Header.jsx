import React, { useRef, useState, useEffect } from "react";
import { Link, NavLink } from 'react-router-dom';
import Logo from "./Logo";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { IoBookmarksSharp } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";


export default function Header() {
    const { user, isLoggedIn, logout, isAdmin } = useAuth();
    const { cart } = useCart();
    const [open, setOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (

        <header className="shadow-md sticky z-50 top-0">
            <div className="bg-[#b87333] text-white text-center text-black text-sm py-2 font-medium tracking-wide">
                🚚 Free delivery on orders above Rs.1500 | 🎉 Flat 20% OFF on all books today!
            </div>

            <nav className="relative bg-white border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-7xl">
                    <Logo />
                    <div className="flex items-center gap-3 lg:order-2">
                        {isLoggedIn && !isAdmin ? (
                            <>
                                {/* Wishlist */}
                                <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-orange-700">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z"
                                        />
                                    </svg>
                                </Link>

                                {/* Cart Icon */}
                                <Link to="/cart" className="relative p-2 text-gray-700 hover:text-orange-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                                    </svg>

                                    {cart?.items?.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                            {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                                        </span>
                                    )}
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <div className="w-9 h-9 overflow-hidden rounded-full">
                                        <img
                                            src={user?.profile?.url}
                                            alt="profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <button
                                        onClick={() => setOpen(!open)}
                                        className="absolute -right-5 top-1/2 -translate-y-1/2 text-2xl"
                                    >
                                        <RiArrowDropDownLine />
                                    </button>

                                    {/* Dropdown */}
                                    <div ref={dropdownRef}>
                                        {open && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md">
                                                <Link
                                                    to="/profile"
                                                    className="block px-4 py-2 text-sm  hover:bg-gray-100"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    Profile
                                                </Link>

                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setOpen(false);
                                                    }}
                                                    className="w-full text-left  px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden lg:inline-block text-gray-800 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 py-2"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="hidden lg:inline-block text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-4 py-2"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}

                        {/* Hamburger toggle - mobile only */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-700 hover:text-orange-700"
                            aria-controls="mobile-menu-2"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <HiX className="w-6 h-6" />
                            ) : (
                                <HiMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                    <div
                        className={`${mobileMenuOpen ? "flex" : "hidden"} absolute top-full left-0 flex-col justify-between items-start w-full bg-white shadow-md z-50 lg:static lg:flex lg:flex-row lg:justify-between lg:items-center lg:w-auto lg:order-1 lg:bg-transparent lg:shadow-none lg:z-auto`}
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col font-medium lg:flex-row lg:space-x-8 lg:mt-0 w-full px-4 py-2 lg:px-0 lg:py-0">
                            <li>
                                <NavLink
                                    to="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `relative block py-2 pr-4 pl-3 lg:p-0 transition-colors duration-300 ${isActive ? "text-orange-700" : "text-gray-700"
                                        } hover:text-orange-700`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            Home
                                            <span
                                                className={`absolute left-0 -bottom-1 h-0.5 bg-orange-700 transition-all duration-300 ${isActive ? "w-full" : "w-0"}`}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/books"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `relative block py-2 pr-4 pl-3 lg:p-0 transition-colors duration-300 ${isActive ? "text-orange-700" : "text-gray-700"
                                        } hover:text-orange-700`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            Books
                                            <span
                                                className={`absolute left-0 -bottom-1 h-0.5 bg-orange-700 transition-all duration-300 ${isActive ? "w-full" : "w-0"}`}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `relative block py-2 pr-4 pl-3 lg:p-0 transition-colors duration-300 ${isActive ? "text-orange-700" : "text-gray-700"
                                        } hover:text-orange-700`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            Contact
                                            <span
                                                className={`absolute left-0 -bottom-1 h-0.5 bg-orange-700 transition-all duration-300 ${isActive ? "w-full" : "w-0"}`}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `relative block py-2 pr-4 pl-3 lg:p-0 transition-colors duration-300 ${isActive ? "text-orange-700" : "text-gray-700"
                                        } hover:text-orange-700`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            About
                                            <span
                                                className={`absolute left-0 -bottom-1 h-0.5 bg-orange-700 transition-all duration-300 ${isActive ? "w-full" : "w-0"}`}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            </li>

                            {/* Login/Signup inside mobile dropdown when logged out */}
                            {!isLoggedIn && (
                                <>
                                    <li className="lg:hidden">
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block py-2 pr-4 pl-3 duration-200 text-grey-700 border-b border-gray-100 hover:bg-gray-50 hover:text-orange-700"
                                        >
                                            Log in
                                        </Link>
                                    </li>
                                    <li className="lg:hidden">
                                        <Link
                                            to="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block py-2 pr-4 pl-3 duration-200 text-grey-700 hover:bg-gray-50 hover:text-orange-700"
                                        >
                                            Sign up
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}