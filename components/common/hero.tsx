// components/common/hero.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Hero = () => {
  return (
    <header className="mb-12 md:mb-20 relative">
      {/* Label Kelompok & Bantuan */}
      <div className="flex justify-between items-start mb-8 md:mb-10">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-1 border border-black text-[10px] md:text-[11px] font-bold tracking-[0.2em] rounded-md uppercase"
        >
          kelompok 4
        </motion.span>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Side: Title Area */}
        <div className="flex-1 order-2 lg:order-1">
          <h1 className="text-4xl md:text-[70px] xl:text-[80px] font-bold text-[#d1d1d1] leading-[1.1] md:leading-[1.05] tracking-[-0.05em]">
            metode yang <br />
            lebih
            {/* Floating Icons Container */}
            <span className="inline-flex items-center gap-1 mx-1 md:mx-4 align-middle">
              <div className="flex -space-x-3 md:-space-x-4">
                {/* Icon f */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [-12, -8, -12] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-black/5 transform -rotate-12"
                >
                  <span className="text-pink-500 font-bold text-xs md:text-base">
                    f
                  </span>
                </motion.div>

                {/* Icon x */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-black/5 z-10"
                >
                  <span className="text-blue-500 font-bold text-xs md:text-base">
                    x
                  </span>
                </motion.div>

                {/* Icon Akar */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [12, 16, 12] }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                  className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-black/5 transform rotate-12"
                >
                  <span className="text-black font-bold text-xs md:text-base">
                    √
                  </span>
                </motion.div>
              </div>
            </span>
            <span className="text-black">presisi</span>
            <br />
            termasuk
            {/* Animated Toggle Section */}
            <span className="inline-flex items-center gap-2 md:gap-6 align-middle">
              <div className="relative inline-flex items-center cursor-pointer group px-1">
                <div className="w-[52px] h-[30px] md:w-[72px] md:h-[40px] bg-gradient-to-r from-[#818cf8] via-[#c084fc] to-[#f472b6] rounded-full p-1 md:p-1.5 shadow-inner">
                  <motion.div
                    animate={{ x: [0, 20, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="bg-white w-[22px] h-[22px] md:w-[28px] md:h-[28px] rounded-full shadow-lg"
                  />
                </div>
              </div>
              <span className="text-black">iteratif.</span>
            </span>
          </h1>
        </div>

        {/* Right Side: SVG Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[300px] md:max-w-[400px] xl:max-w-[500px] aspect-square">
            <Image
              src="/images/Mathematics-bro.svg"
              alt="Mathematics Illustration"
              fill
              priority
              className="object-contain"
            />
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;
