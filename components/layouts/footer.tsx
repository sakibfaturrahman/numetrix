// components/layout/footer.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  // Update data pengembang sesuai konteks proyek kamu
  const developers = [
    { name: "sakib faturrahman", role: "lead developer", initial: "sf" },
    { name: "azhar", role: "unknown", initial: "az" },
    { name: "riziq", role: "unknown", initial: "rq" },
  ];

  return (
    <footer className="bg-white mt-20 border-t border-gray-100 pt-20 pb-12 selection:bg-black selection:text-white">
      {/* Container Utama: max-w-6xl dengan mx-auto memastikan konten di tengah */}
      <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16">
        {/* Top Section: Grid 4 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold italic">n.</span>
              </div>
              <span className="text-sm font-bold tracking-tighter text-black">
                numetrix <span className="text-gray-300 font-normal">v1.0</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs lowercase">
              platform eksperimen metode numerik untuk mempermudah kalkulasi
              persamaan linier dan non-linier dengan pendekatan iterasi yang
              presisi. dikembangkan khusus untuk keperluan akademik.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col items-start">
            <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-6">
              eksplorasi
            </h4>
            <ul className="space-y-4">
              {["beranda", "metode", "about"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-xs text-gray-400 hover:text-black hover:pl-2 transition-all duration-300 lowercase"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section: Developer Profiles & Copyright */}
        <div className="flex flex-col lg:flex-row justify-between items-center pt-10 border-t border-gray-100 gap-10">
          {/* Copyright & Links */}
          <div className="flex flex-col items-center lg:items-end gap-4">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] text-center lg:text-right">
              © 2026 perjuangan university <br className="md:hidden" /> of
              tasikmalaya
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
