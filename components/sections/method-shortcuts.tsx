// components/sections/method-shortcuts.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const methods = [
  {
    title: "matriks balikan",
    desc: "solusi spl dengan mencari invers matriks koefisien.",
    path: "/matriks/balikan",
    color: "bg-blue-500",
  },
  {
    title: "dekomposisi lu",
    desc: "faktorisasi matriks menjadi segitiga bawah (l) dan atas (u).",
    path: "/matriks/dekomposisi",
    color: "bg-purple-500",
  },
  {
    title: "reduksi crout",
    desc: "variasi dekomposisi lu dengan optimasi pada elemen diagonal.",
    path: "/matriks/reduksi",
    color: "bg-pink-500",
  },
  {
    title: "lelaran jacobi",
    desc: "metode iteratif untuk mencari solusi spl secara simultan.",
    path: "/spl/jacobi",
    color: "bg-orange-500",
  },
  {
    title: "gauss-seidel",
    desc: "iterasi lebih cepat dengan menggunakan nilai terbaru langsung.",
    path: "/spl/seidel",
    color: "bg-emerald-500",
  },
];

const MethodShortcuts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {methods.map((method, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
        >
          <div>
            <div
              className={`w-10 h-10 ${method.color} rounded-2xl mb-6 opacity-20 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold`}
            >
              {index + 1}
            </div>
            <h3 className="text-xl font-bold text-black mb-3">
              {method.title}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-8">
              {method.desc}
            </p>
          </div>

          <Link href={method.path}>
            <button className="w-full py-4 bg-[#f9f9f9] group-hover:bg-black group-hover:text-white rounded-[20px] text-[10px] font-bold uppercase tracking-widest transition-all">
              buka kalkulator →
            </button>
          </Link>
        </motion.div>
      ))}

      {/* Kartu Tambahan: Coming Soon / Teori */}
      <div className="bg-black p-8 rounded-[35px] flex flex-col justify-center items-center text-center">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-4">
          dokumentasi
        </span>
        <h3 className="text-white text-lg font-bold mb-4">
          pelajari teori numerik lebih dalam
        </h3>
        <button className="text-white/50 hover:text-white text-xs transition-colors">
          baca selengkapnya
        </button>
      </div>
    </div>
  );
};

export default MethodShortcuts;
