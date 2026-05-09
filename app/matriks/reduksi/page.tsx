"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GuideModal } from "@/components/common/guide-modal";
import { ErrorMessage } from "@/components/common/error-message";
import {
  RotateCcw,
  Play,
  HelpCircle,
  Binary,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface CroutResult {
  L: number[][];
  U: number[][];
  y: number[];
  x: number[];
}

const ReduksiCroutPage = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CroutResult | null>(null);

  // State default sesuai contoh soal gambar
  const [matrixA, setMatrixA] = useState([
    [1, 1, -1],
    [-1, 1, 1],
    [2, 2, 1],
  ]);
  const [vectorB, setVectorB] = useState([1, 1, 5]);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hasSeenCroutGuide");
    if (!hasSeenGuide) setShowGuide(true);
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hasSeenCroutGuide", "true");
  };

  const handleAChange = (row: number, col: number, value: string) => {
    const newMatrix = [...matrixA];
    const parsed = parseFloat(value);
    newMatrix[row][col] = isNaN(parsed) ? 0 : parsed;
    setMatrixA(newMatrix);
  };

  const handleBChange = (row: number, value: string) => {
    const newVector = [...vectorB];
    const parsed = parseFloat(value);
    newVector[row] = isNaN(parsed) ? 0 : parsed;
    setVectorB(newVector);
  };

  const resetInput = () => {
    setMatrixA([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    setVectorB([0, 0, 0]);
    setResults(null);
    setError(null);
  };

  // FUNGSI FETCH KE BACKEND
  const calculateCrout = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/matriks/crout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matrixA, vectorB }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "gagal melakukan reduksi crout.");
        return;
      }

      setResults(data);
    } catch (err) {
      setError("koneksi ke server terputus.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans selection:bg-pink-100 selection:text-pink-900 lowercase">
      <Navbar />

      <ErrorMessage message={error} onClose={() => setError(null)} />

      <GuideModal
        isOpen={showGuide}
        onOpenChange={setShowGuide}
        title="panduan crout"
        description="pahami skema pemfaktoran crout untuk efisiensi perhitungan spl."
        theoryOverview="metode ini memfaktorkan A = LU dengan syarat elemen diagonal matriks U bernilai satu (uᵢᵢ = 1)."
        steps={[
          "masukkan koefisien variabel pada matriks A.",
          "isi konstanta hasil pada vektor b.",
          "klik tombol 'reduksi' untuk melihat hasil pemfaktoran L dan U serta solusi akhirnya.",
        ]}
        onClose={handleCloseGuide}
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="fixed bottom-10 right-10 z-50">
            <Button
              onClick={() => setShowGuide(true)}
              className="w-14 h-14 rounded-full bg-black shadow-2xl hover:scale-110 transition-transform border-none flex items-center justify-center group"
            >
              <HelpCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            </Button>
          </div>

          <section className="bg-white rounded-[40px] md:rounded-[50px] p-8 md:p-16 border border-gray-100 shadow-2xl mb-8 overflow-hidden">
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
                  perhitungan manual.
                </p>
              </div>
              <div className="w-full md:w-[350px] relative aspect-square">
                <Image
                  src="/images/Mathematics-rafiki.svg"
                  alt="Illustration"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-8 md:p-12 rounded-[40px] border-none shadow-xl bg-white flex flex-col gap-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-black">
                    susun persamaan.
                  </h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    koefisien [a | b]
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetInput}
                  className="rounded-full hover:bg-red-50 border-none group transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                </Button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-[30px] border border-gray-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    matriks [A]
                  </span>
                  {matrixA.map((row, r) =>
                    row.map((col, c) => (
                      <Input
                        key={`a-${r}-${c}`}
                        type="number"
                        value={matrixA[r][c]}
                        onChange={(e) => handleAChange(r, c, e.target.value)}
                        className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white focus-visible:ring-pink-500"
                      />
                    )),
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">
                    hasil
                  </span>
                  <div className="h-20 w-[2px] bg-gray-100 hidden md:block"></div>
                </div>
                <div className="grid grid-cols-1 gap-3 p-4 bg-pink-50/50 rounded-[30px] border border-pink-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-pink-300 uppercase tracking-widest">
                    vektor [b]
                  </span>
                  {vectorB.map((val, r) => (
                    <Input
                      key={`b-${r}`}
                      type="number"
                      value={vectorB[r]}
                      onChange={(e) => handleBChange(r, e.target.value)}
                      className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white text-pink-600 focus-visible:ring-pink-500"
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={calculateCrout}
                disabled={loading}
                className="w-full py-8 bg-black text-white rounded-[30px] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-pink-700 transition-all flex gap-3 group border-none"
              >
                {loading ? "sedang mereduksi..." : "jalankan kalkulasi crout"}
                {!loading && (
                  <Binary className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
              </Button>
            </Card>

            <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-xl bg-[#0a0a0a] text-white flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6 text-pink-400">
                  skema crout.
                </h3>
                <div className="space-y-5">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 mb-2 uppercase font-bold tracking-widest">
                      aturan diagonal
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      diagonal matriks U bernilai satu{" "}
                      <span className="text-pink-400 font-bold underline">
                        (uᵢᵢ = 1)
                      </span>
                      .
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 mb-2 uppercase font-bold tracking-widest">
                      persamaan dasar:
                    </p>
                    <div className="p-3 bg-pink-500/10 rounded-xl text-xs font-mono text-pink-200 text-center uppercase tracking-widest">
                      A = L · U
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-pink-500/10 blur-[90px] rounded-full"></div>
            </Card>
          </div>

          {/* AREA HASIL */}
          <AnimatePresence>
            {results ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 space-y-12"
              >
                {/* Visualisasi Matriks L & U */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-8 rounded-[40px] border-none shadow-lg bg-white">
                    <h4 className="text-[10px] font-bold text-pink-600 uppercase tracking-[0.2em] mb-6 italic">
                      matriks L (segitiga bawah)
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {results.L.map((row, rIdx) =>
                        row.map((val, cIdx) => (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className="h-14 flex items-center justify-center bg-gray-50 text-black font-bold rounded-2xl text-sm border border-gray-100 shadow-sm"
                          >
                            {val.toFixed(2)}
                          </div>
                        )),
                      )}
                    </div>
                  </Card>
                  <Card className="p-8 rounded-[40px] border-none shadow-lg bg-white">
                    <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-6 italic">
                      matriks U (segitiga atas)
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {results.U.map((row, rIdx) =>
                        row.map((val, cIdx) => (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className="h-14 flex items-center justify-center bg-gray-50 text-black font-bold rounded-2xl text-sm border border-gray-100 shadow-sm"
                          >
                            {val.toFixed(2)}
                          </div>
                        )),
                      )}
                    </div>
                  </Card>
                </div>

                {/* Solusi Akhir */}
                <Card className="p-10 rounded-[45px] border-none shadow-2xl bg-black text-white text-center relative overflow-hidden">
                  <div className="relative z-10">
                    <CheckCircle2 className="w-12 h-12 text-pink-500 mx-auto mb-6" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-pink-500 mb-8 italic">
                      solusi konvergen
                    </h4>
                    <div className="flex flex-col md:flex-row justify-center gap-12 items-center">
                      {results.x.map((val, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-gray-500 text-[10px] uppercase mb-2 font-bold tracking-widest italic font-sans">
                            variabel x{i + 1}
                          </span>
                          <span className="text-5xl font-bold tracking-tighter text-white">
                            {val.toFixed(4)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-pink-500/20 blur-[80px] rounded-full"></div>
                </Card>
              </motion.div>
            ) : (
              <div className="mt-12 opacity-50 grayscale cursor-not-allowed">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xl font-bold tracking-tighter text-black">
                    analisis reduksi & substitusi.
                  </h2>
                  <div className="h-[1px] flex-1 bg-gray-200"></div>
                </div>
                <div className="bg-white/50 border border-dashed border-gray-300 rounded-[40px] h-40 flex items-center justify-center text-gray-400 italic text-sm px-10 text-center">
                  klik tombol reduksi untuk melihat hasil pemfaktoran L dan U
                  serta solusi akhir.
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReduksiCroutPage;
