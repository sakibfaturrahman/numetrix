"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image"; // Import komponen Image
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Play } from "lucide-react";

const MatriksBalikanPage = () => {
  const [matrixA, setMatrixA] = useState([
    [1, -1, 2],
    [3, 0, 1],
    [1, 0, 2],
  ]);
  const [vectorB, setVectorB] = useState([5, 10, 5]);

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
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* HERO SECTION DENGAN SVG */}
          <section className="bg-white rounded-[40px] md:rounded-[50px] p-8 md:p-16 border border-gray-100 shadow-2xl mb-8 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              {/* Sisi Kiri: Teks */}
              <div className="max-w-xl flex-1">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold tracking-[0.2em] rounded-full uppercase mb-6 inline-block"
                >
                  metode matriks balikan
                </motion.span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black leading-tight mb-6 lowercase">
                  cari solusi <span className="text-gray-300">melalui</span>{" "}
                  <br /> inversi matriks.
                </h1>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed lowercase">
                  selesaikan sistem persamaan lanjar (spl) dengan mencari
                  matriks balikan (invers) menggunakan eliminasi gauss-jordan.
                  format penyelesaian:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-black font-bold">
                    x = A⁻¹b
                  </code>
                </p>
              </div>

              {/* Sisi Kanan: SVG Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full md:w-[350px] flex justify-center items-center"
              >
                <div className="relative w-full aspect-square md:w-[400px] h-auto">
                  <Image
                    src="/images/Mathematics-amico.svg"
                    alt="Mathematics Illustration"
                    width={400}
                    height={400}
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* INPUT SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-8 md:p-12 rounded-[40px] border-none shadow-xl bg-white flex flex-col gap-10">
              <div className="flex justify-between items-center lowercase">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    input augmented.
                  </h2>
                  <p className="text-xs text-gray-400">
                    masukkan koefisien matriks [a | b]
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
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-[30px] border border-gray-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-gray-300 uppercase">
                    matriks A
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
                        className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm focus-visible:ring-blue-500 bg-white"
                      />
                    )),
                  )}
                </div>

                <div className="h-40 w-[2px] bg-gray-200 hidden md:block"></div>

                <div className="grid grid-cols-1 gap-3 p-4 bg-blue-50/50 rounded-[30px] border border-blue-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-blue-300 uppercase">
                    vektor b
                  </span>
                  {vectorB.map((val, rowIndex) => (
                    <Input
                      key={`b-${rowIndex}`}
                      type="number"
                      value={vectorB[rowIndex]}
                      onChange={(e) => handleBChange(rowIndex, e.target.value)}
                      className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm focus-visible:ring-blue-500 bg-white text-blue-600"
                    />
                  ))}
                </div>
              </div>

              <Button className="w-full py-8 bg-black text-white rounded-[25px] text-xs font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex gap-3 group">
                hitung solusi sekarang
                <Play className="w-3 h-3 fill-current group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-xl bg-black text-white flex flex-col justify-between overflow-hidden relative lowercase">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2 lowercase">
                  target identitas.
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  matriks A akan diubah menjadi matriks identitas [I], sementara
                  [I] akan berubah menjadi [A⁻¹].
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 opacity-40 scale-90">
                {[1, 0, 0, 0, 1, 0, 0, 0, 1].map((val, i) => (
                  <div
                    key={i}
                    className={`h-16 rounded-xl border border-white/10 flex items-center justify-center font-bold ${val === 1 ? "bg-white/10 text-white" : "text-white/20"}`}
                  >
                    {val}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-2 text-blue-400 mb-4 uppercase">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    status sistem: ready
                  </span>
                </div>
                <p className="text-[10px] text-gray-500">
                  pastikan determinan matriks ≠ 0 agar invers dapat ditemukan.
                </p>
              </div>

              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full"></div>
            </Card>
          </div>

          <div className="mt-12 opacity-50 grayscale cursor-not-allowed lowercase">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-bold tracking-tighter">
                hasil perhitungan.
              </h2>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>
            <div className="bg-white/50 border border-dashed border-gray-300 rounded-[40px] h-40 flex items-center justify-center text-gray-400 italic text-sm">
              klik tombol hitung untuk melihat langkah penyelesaian dan solusi
              akhir
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MatriksBalikanPage;
