"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Play, ChevronRight, Binary } from "lucide-react";

const ReduksiCroutPage = () => {
  // State default sesuai contoh soal gambar (x1 + x2 - x3 = 1, dst)
  const [matrixA, setMatrixA] = useState([
    [1, 1, -1],
    [-1, 1, 1],
    [2, 2, 1],
  ]);
  const [vectorB, setVectorB] = useState([1, 1, 5]);

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
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans selection:bg-pink-100 selection:text-pink-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* HERO SECTION */}
          <section className="bg-white rounded-[40px] md:rounded-[50px] p-8 md:p-16 border border-gray-100 shadow-2xl mb-8 overflow-hidden lowercase">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="max-w-xl flex-1">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-1.5 bg-pink-50 text-pink-600 text-[10px] font-bold tracking-[0.2em] rounded-full uppercase mb-6 inline-block"
                >
                  metode reduksi crout
                </motion.span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black leading-tight mb-6">
                  optimasi <span className="text-gray-300">faktorisasi</span>{" "}
                  <br /> dengan metode crout.
                </h1>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  variasi dekomposisi LU di mana matriks segitiga atas (U)
                  memiliki elemen diagonal bernilai 1. sangat efektif untuk
                  perhitungan manual dan komputasi yang efisien.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full md:w-[350px] flex justify-center items-center"
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src="/images/Mathematics-rafiki.svg"
                    alt="Crout Method Illustration"
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* INPUT SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lowercase">
            {/* KARTU INPUT MATRIKS */}
            <Card className="lg:col-span-2 p-8 md:p-12 rounded-[40px] border-none shadow-xl bg-white flex flex-col gap-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    susun persamaan.
                  </h2>
                  <p className="text-xs text-gray-400">
                    masukkan angka koefisien untuk di-reduksi.
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
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    matriks [A]
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
                        className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white focus-visible:ring-pink-500"
                      />
                    )),
                  )}
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black text-gray-200">
                    X
                  </span>
                  <div className="h-20 w-[2px] bg-gray-100 hidden md:block"></div>
                </div>

                {/* Vektor B Area */}
                <div className="grid grid-cols-1 gap-3 p-4 bg-pink-50/50 rounded-[30px] border border-pink-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-pink-300 uppercase tracking-widest">
                    vektor [b]
                  </span>
                  {vectorB.map((val, rowIndex) => (
                    <Input
                      key={`b-${rowIndex}`}
                      type="number"
                      value={vectorB[rowIndex]}
                      onChange={(e) => handleBChange(rowIndex, e.target.value)}
                      className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white text-pink-600 focus-visible:ring-pink-500"
                    />
                  ))}
                </div>
              </div>

              <Button className="w-full py-8 bg-black text-white rounded-[25px] text-xs font-bold uppercase tracking-[0.2em] hover:bg-pink-700 transition-all flex gap-3 group">
                reduksi matriks
                <Binary className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </Button>
            </Card>

            {/* KARTU LOGIKA CROUT */}
            <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-xl bg-[#0a0a0a] text-white flex flex-col justify-between overflow-hidden relative lowercase">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6 text-pink-400">
                  skema crout.
                </h3>
                <div className="space-y-5">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 mb-2 uppercase font-bold">
                      aturan diagonal
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      diagonal matriks U harus bernilai satu{" "}
                      <span className="text-pink-400">(uᵢᵢ = 1)</span>.
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 mb-2 uppercase font-bold">
                      tahap hitung
                    </p>
                    <ul className="text-[10px] text-gray-400 space-y-2">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-pink-500" /> kolom
                        pertama L
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-pink-500" /> baris
                        pertama U
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-pink-500" /> sisa
                        kolom L & baris U
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                <p className="text-[9px] text-gray-500 mb-4 tracking-widest uppercase">
                  persamaan dasar:
                </p>
                <div className="flex justify-center items-center p-3 bg-pink-500/10 rounded-xl text-xs font-mono text-pink-200">
                  A = L · U
                </div>
              </div>

              <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-pink-500/10 blur-[90px] rounded-full"></div>
            </Card>
          </div>

          {/* AREA HASIL (L, U, & Y) */}
          <div className="mt-12 opacity-50 grayscale cursor-not-allowed lowercase">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-bold tracking-tighter">
                analisis reduksi & substitusi.
              </h2>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/40 border border-dashed border-gray-300 rounded-[35px] h-40 flex items-center justify-center text-gray-400 text-xs italic">
                matriks L & U akan muncul di sini
              </div>
              <div className="bg-white/40 border border-dashed border-gray-300 rounded-[35px] h-40 flex items-center justify-center text-gray-400 text-xs italic">
                vektor y & solusi x akan muncul di sini
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReduksiCroutPage;
