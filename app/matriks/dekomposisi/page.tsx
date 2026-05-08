"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  RotateCcw,
  Play,
  ArrowRight,
  Layers,
  ChevronRight,
} from "lucide-react";

const DekomposisiLUPage = () => {
  // State default sesuai contoh soal gambar (x1 + x2 - x3 = 1, dst)
  const [matrixA, setMatrixA] = useState([
    [1, 1, -1],
    [2, 2, 1],
    [-1, 1, 1],
  ]);
  const [vectorB, setVectorB] = useState([1, 5, 1]);

  const handleAChange = (row: number, col: number, value: string) => {
    const newMatrix = [...matrixA];
    newMatrix[row][col] = value === "" ? 0 : parseFloat(value);
    setMatrixA(newMatrix);
  };

  const handleBChange = (row: number, value: string) => {
    const newVector = [...vectorB];
    newVector[row] = value === "" ? 0 : parseFloat(value);
    setVectorB(newVector);
  };

  return (
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* HERO SECTION */}
          <section className="bg-white rounded-[40px] md:rounded-[50px] p-8 md:p-16 border border-gray-100 shadow-2xl mb-8 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="max-w-xl flex-1">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-[0.2em] rounded-full uppercase mb-6 inline-block"
                >
                  metode dekomposisi lu
                </motion.span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black leading-tight mb-6 lowercase">
                  faktorisasi <span className="text-gray-300">matriks</span>{" "}
                  <br /> metode lu gauss.
                </h1>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed lowercase">
                  pecah matriks A menjadi matriks segitiga bawah (L) dan
                  segitiga atas (U). metode ini sangat efisien untuk
                  menyelesaikan sistem spl dengan vektor b yang bervariasi.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full md:w-[350px] flex justify-center items-center"
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src="/images/Mathematics-pana.svg"
                    alt="LU Decomposition Illustration"
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* INPUT & ANALISIS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* INPUT MATRIKS */}
            <Card className="lg:col-span-2 p-8 md:p-12 rounded-[40px] border-none shadow-xl bg-white flex flex-col gap-10">
              <div className="flex justify-between items-center lowercase">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    susun matriks A.
                  </h2>
                  <p className="text-xs text-gray-400">
                    tentukan nilai x, y, z melalui pemfaktoran.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400" />
                </Button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Matriks A Area */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-[30px] border border-gray-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-gray-300 uppercase">
                    koefisien [A]
                  </span>
                  {matrixA.map((row, rowIndex) =>
                    row.map((col, colIndex) => (
                      <Input
                        key={`a-${rowIndex}-${colIndex}`}
                        type="number"
                        value={matrixA[rowIndex][colIndex]}
                        onChange={(e) =>
                          handleAChange(rowIndex, colIndex, e.target.value)
                        }
                        className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white focus-visible:ring-emerald-500"
                      />
                    )),
                  )}
                </div>

                <ArrowRight className="text-gray-200 w-8 h-8 hidden md:block" />

                {/* Vektor B Area */}
                <div className="grid grid-cols-1 gap-3 p-4 bg-emerald-50/50 rounded-[30px] border border-emerald-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-emerald-300 uppercase">
                    hasil [b]
                  </span>
                  {vectorB.map((val, rowIndex) => (
                    <Input
                      key={`b-${rowIndex}`}
                      type="number"
                      value={vectorB[rowIndex]}
                      onChange={(e) => handleBChange(rowIndex, e.target.value)}
                      className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white text-emerald-600 focus-visible:ring-emerald-500"
                    />
                  ))}
                </div>
              </div>

              <Button className="w-full py-8 bg-black text-white rounded-[25px] text-xs font-bold uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all flex gap-3 group">
                jalankan dekomposisi
                <Layers className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </Button>
            </Card>

            {/* INFO PANEL (L & U VISUAL) */}
            <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-xl bg-[#111] text-white flex flex-col justify-between overflow-hidden relative lowercase">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4">
                  struktur pemfaktoran.
                </h3>
                <div className="space-y-6">
                  {/* Visual L */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center font-bold text-emerald-400">
                      L
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                      matriks segitiga bawah dengan elemen diagonal bernilai 1.
                    </p>
                  </div>
                  {/* Visual U */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center font-bold text-blue-400">
                      U
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                      matriks segitiga atas hasil eliminasi gauss pada matriks
                      A.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-white/5 relative z-10">
                <p className="text-[10px] text-gray-500 mb-4">
                  alur penyelesaian:
                </p>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                  <span>A = LU</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>Ly = b</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>Ux = y</span>
                </div>
              </div>

              {/* Decorative Blur */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
            </Card>
          </div>

          {/* PLACEHOLDER HASIL */}
          <div className="mt-12 opacity-50 grayscale cursor-not-allowed lowercase">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-bold tracking-tighter">
                tahapan eliminasi & penyulihan.
              </h2>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>
            <div className="bg-white/50 border border-dashed border-gray-300 rounded-[40px] h-60 flex items-center justify-center text-gray-400 italic text-sm text-center px-10">
              hasil dekomposisi L dan U, proses penyulihan maju (forward
              substitution), <br />
              serta penyulihan mundur (backward substitution) akan ditampilkan
              secara detail di sini.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DekomposisiLUPage;
