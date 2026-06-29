// components/sections/about.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div id="about" className="mt-32">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-bold tracking-tighter">
          tentang numetix.
        </h2>
        <div className="h-[1px] flex-1 bg-gray-100"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu 1: Visi/Deskripsi */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="md:col-span-2 bg-[#fcfcfc] p-10 rounded-[40px] border border-gray-100 flex flex-col justify-between"
        >
          <div>
            <span className="px-3 py-1 bg-white border border-gray-100 text-[9px] font-bold tracking-widest uppercase rounded-full mb-6 inline-block">
              philosophy
            </span>
            <p className="text-2xl md:text-3xl font-medium tracking-tight text-black leading-tight">
              numetrix hadir untuk menjembatani kompleksitas{" "}
              <span className="text-gray-300">matematika numerik</span> dengan
              antarmuka yang modern dan intuitif.
            </p>
          </div>
          <p className="mt-8 text-sm text-gray-400 leading-relaxed max-w-md">
            proyek ini dikembangkan sebagai alat bantu belajar mahasiswa dalam
            memahami proses iterasi dan dekomposisi matriks secara visual dan
            presisi.
          </p>
        </motion.div>

        {/* Kartu 2: Tech Stack */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-black p-10 rounded-[40px] text-white flex flex-col justify-between"
        >
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              built with
            </span>
            <div className="flex flex-wrap gap-2">
              {["next.js", "tailwind", "framer", "typescript"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-medium border border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-12">
            <h4 className="text-lg font-bold mb-1">version 1.0</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              stable release 2026
            </p>
          </div>
        </motion.div>

        {/* Kartu 3: Team Brief (Horizontal di layar lebar) */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="md:col-span-3 bg-white p-10 rounded-[40px] border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              {["sf", "az", "rq"].map((initials) => (
                <div
                  key={initials}
                  className="w-12 h-12 rounded-full bg-[#f2f2f2] border-4 border-white flex items-center justify-center text-[10px] font-bold uppercase"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-bold text-black">
                dikembangkan oleh kelompok 4
              </h4>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                informatika • universitas perjuangan
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
