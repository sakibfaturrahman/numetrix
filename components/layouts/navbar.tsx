"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinks = [
    { name: "beranda", href: "/" },
    { name: "tentang", href: "/#about" },
  ];

  const metodeLinks = [
    { name: "matriks balikan", href: "/matriks/balikan", color: "bg-blue-500" },
    {
      name: "dekomposisi lu",
      href: "/matriks/dekomposisi",
      color: "bg-emerald-500",
    },
    { name: "reduksi crout", href: "/matriks/reduksi", color: "bg-pink-500" },
    { name: "lelaran jacobi", href: "/spl/jacobi", color: "bg-orange-500" },
    { name: "gauss-seidel", href: "/spl/seidel", color: "bg-emerald-500" },
  ];

  return (
    <>
      <nav className="fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md px-5 py-3 rounded-full border border-gray-100 shadow-lg flex justify-between md:justify-center items-center transition-all w-[90%] md:w-auto min-w-[320px]">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white text-[10px] font-black">n</span>
          </div>
          <span className="md:hidden text-[10px] font-bold tracking-widest text-black">
            numetrix.
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 px-8 items-center">
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all"
          >
            beranda
          </Link>

          {/* Dropdown Metode (Desktop) */}
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all flex items-center gap-1">
              metode{" "}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64"
                >
                  <div className="bg-white rounded-[25px] shadow-2xl border border-gray-100 p-4 flex flex-col gap-1">
                    {metodeLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-[10px] font-bold uppercase tracking-tight text-gray-400 group-hover:text-black">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/#about"
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all"
          >
            tentang
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col items-end gap-1.5 p-1 z-[60]"
        >
          <motion.span
            animate={
              isOpen
                ? { rotate: 45, y: 7, width: "20px" }
                : { rotate: 0, y: 0, width: "20px" }
            }
            className="h-0.5 bg-black rounded-full"
          />
          <motion.span
            animate={
              isOpen
                ? { opacity: 0, width: "0px" }
                : { opacity: 1, width: "12px" }
            }
            className="h-0.5 bg-black rounded-full"
          />
          <motion.span
            animate={
              isOpen
                ? { rotate: -45, y: -7, width: "20px" }
                : { rotate: 0, y: 0, width: "20px" }
            }
            className="h-0.5 bg-black rounded-full"
          />
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[51] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-4 top-4 bottom-4 w-[85%] max-w-[320px] bg-white z-[52] rounded-[35px] shadow-2xl p-8 flex flex-col md:hidden overflow-y-auto"
            >
              <div className="mt-16 flex flex-col gap-6">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold tracking-tighter text-black"
                >
                  beranda
                </Link>

                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
                    metode numerik
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {metodeLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl"
                      >
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-xs font-bold uppercase text-black">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/#about"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold tracking-tighter text-black"
                >
                  tentang
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
