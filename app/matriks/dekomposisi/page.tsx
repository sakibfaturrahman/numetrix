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
  ArrowRight,
  Layers,
  ChevronRight,
  HelpCircle,
  ArrowDown,
  IterationCcw,
} from "lucide-react";

// Definisikan Interface dengan lebih ketat
interface LUStep {
  label: string;
  matrixL: number[][];
  matrixU: number[][];
}

interface LUResult {
  steps: LUStep[];
  L: number[][];
  U: number[][];
  y: number[];
  forwardSteps: string[];
  x: number[];
  backwardSteps: string[];
}

const DekomposisiLUPage = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<LUResult | null>(null);

  const [matrixA, setMatrixA] = useState([
    [1, 1, -1],
    [2, 2, 1],
    [-1, 1, 1],
  ]);
  const [vectorB, setVectorB] = useState([1, 5, 1]);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hasSeenLUDecompositionGuide");
    if (!hasSeenGuide) setShowGuide(true);
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hasSeenLUDecompositionGuide", "true");
  };

  const handleAChange = (row: number, col: number, value: string) => {
    const newMatrix = [...matrixA];
    // Pastikan nilai adalah angka, jika tidak bisa di-parse beri 0
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
      [1, 1, -1],
      [2, 2, 1],
      [-1, 1, 1],
    ]);
    setVectorB([1, 5, 1]);
    setResults(null);
    setError(null);
  };

  const calculateLU = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/matriks/dekomposisi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matrixA, vectorB }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "gagal melakukan dekomposisi.");
        return;
      }

      setResults(data);
    } catch (err) {
      setError("terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans lowercase selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <GuideModal
        isOpen={showGuide}
        onOpenChange={setShowGuide}
        title="panduan dekomposisi lu"
        description="pahami alur pemfaktoran matriks menjadi matriks segitiga L dan U."
        theoryOverview="metode ini memfaktorkan A = LU. solusi dicari melalui dua tahap: penyulihan maju (Ly = b) untuk mencari y, lalu penyulihan mundur (Ux = y) untuk mencari x."
        steps={[
          "masukkan koefisien matriks a pada grid kiri.",
          "isi konstanta hasil pada vektor b di kolom kanan.",
          "klik 'jalankan dekomposisi' untuk melihat proses faktorisasi dan substitusi.",
        ]}
        onClose={handleCloseGuide}
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage message={error} onClose={() => setError(null)} />

          <div className="fixed bottom-10 right-10 z-[100]">
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
                  className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-[0.2em] rounded-full uppercase mb-6 inline-block"
                >
                  metode dekomposisi lu
                </motion.span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black leading-tight mb-6">
                  faktorisasi <span className="text-gray-300">matriks</span>{" "}
                  <br /> metode lu gauss.
                </h1>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  pecah matriks A menjadi matriks segitiga bawah (L) dan
                  segitiga atas (U). efisien untuk spl dengan vektor b
                  bervariasi.
                </p>
              </div>
              <div className="w-full md:w-[350px] relative aspect-square">
                <Image
                  src="/images/Mathematics-pana.svg"
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
                  <h2 className="text-xl font-bold tracking-tight">
                    susun matriks A.
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    koefisien [A | b]
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetInput}
                  className="rounded-full hover:bg-gray-100"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400" />
                </Button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-[30px] border border-gray-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    koefisien [A]
                  </span>
                  {matrixA.map((row, r) =>
                    row.map((col, c) => (
                      <Input
                        key={`a-${r}-${c}`}
                        type="number"
                        value={matrixA[r][c]}
                        onChange={(e) => handleAChange(r, c, e.target.value)}
                        className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white focus-visible:ring-emerald-500"
                      />
                    )),
                  )}
                </div>
                <ArrowRight className="text-gray-200 w-8 h-8 hidden md:block" />
                <div className="grid grid-cols-1 gap-3 p-4 bg-emerald-50/50 rounded-[30px] border border-emerald-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                    hasil [b]
                  </span>
                  {vectorB.map((val, r) => (
                    <Input
                      key={`b-${r}`}
                      type="number"
                      value={val}
                      onChange={(e) => handleBChange(r, e.target.value)}
                      className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white text-emerald-600 focus-visible:ring-emerald-500"
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={calculateLU}
                disabled={loading}
                className="w-full py-8 bg-black text-white rounded-[30px] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all flex gap-3 group border-none"
              >
                {loading ? "sedang memproses..." : "jalankan dekomposisi"}
                {!loading && (
                  <Layers className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                )}
              </Button>
            </Card>

            <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-xl bg-[#111] text-white flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4">
                  struktur pemfaktoran.
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center font-bold text-emerald-400 font-mono">
                      L
                    </div>
                    <p className="text-[10px] text-gray-500 italic">
                      matriks segitiga bawah (lower) dengan diagonal 1.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center font-bold text-blue-400 font-mono">
                      U
                    </div>
                    <p className="text-[10px] text-gray-500 italic">
                      matriks segitiga atas (upper) hasil eliminasi.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-6 border-t border-white/5 relative z-10">
                <p className="text-[10px] text-gray-500 mb-4 uppercase tracking-widest font-bold">
                  alur penyelesaian:
                </p>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                  <span>A = LU</span>{" "}
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Ly = b</span>{" "}
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Ux = y</span>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
            </Card>
          </div>

          <AnimatePresence>
            {results && results.L && results.U && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 space-y-12"
              >
                {/* Visualisasi Matriks L & U Akhir */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-8 rounded-[40px] border-none shadow-lg bg-white relative overflow-hidden">
                    <span className="absolute top-4 right-6 text-[40px] font-black text-gray-50 opacity-10 uppercase">
                      lower
                    </span>
                    <h4 className="text-sm font-bold mb-6 text-emerald-600 uppercase tracking-widest">
                      matriks L (segitiga bawah)
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {results.L.map((row, rIdx) =>
                        row.map((val, cIdx) => (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className="h-14 md:h-16 flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold rounded-2xl text-sm"
                          >
                            {typeof val === "number" ? val.toFixed(2) : "0.00"}
                          </div>
                        )),
                      )}
                    </div>
                  </Card>

                  <Card className="p-8 rounded-[40px] border-none shadow-lg bg-white relative overflow-hidden">
                    <span className="absolute top-4 right-6 text-[40px] font-black text-gray-50 opacity-10 uppercase">
                      upper
                    </span>
                    <h4 className="text-sm font-bold mb-6 text-blue-600 uppercase tracking-widest">
                      matriks U (segitiga atas)
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {results.U.map((row, rIdx) =>
                        row.map((val, cIdx) => (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className="h-14 md:h-16 flex items-center justify-center bg-blue-50 text-blue-700 font-bold rounded-2xl text-sm"
                          >
                            {typeof val === "number" ? val.toFixed(2) : "0.00"}
                          </div>
                        )),
                      )}
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-lg bg-white">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <ArrowDown className="text-white w-5 h-5" />
                      </div>
                      <h4 className="font-bold tracking-tight text-lg">
                        penyulihan maju (Ly = b)
                      </h4>
                    </div>
                    <div className="space-y-4">
                      {results.forwardSteps?.map((step, i) => (
                        <div
                          key={i}
                          className="p-4 bg-gray-50 rounded-2xl font-mono text-xs flex justify-between items-center"
                        >
                          <span className="text-gray-400">langkah {i + 1}</span>
                          <span className="font-bold text-emerald-600">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-lg bg-white">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <IterationCcw className="text-white w-5 h-5" />
                      </div>
                      <h4 className="font-bold tracking-tight text-lg">
                        penyulihan mundur (Ux = y)
                      </h4>
                    </div>
                    <div className="space-y-4">
                      {results.backwardSteps?.map((step, i) => (
                        <div
                          key={i}
                          className="p-4 bg-gray-50 rounded-2xl font-mono text-xs flex justify-between items-center"
                        >
                          <span className="text-gray-400">langkah {i + 1}</span>
                          <span className="font-bold text-blue-600">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <Card className="p-10 rounded-[45px] border-none shadow-2xl bg-black text-white text-center relative overflow-hidden">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500 mb-8">
                    solusi sistem persamaan
                  </h4>
                  <div className="flex flex-col md:flex-row justify-center gap-12 items-center">
                    {results.x?.map((val, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-gray-500 text-[10px] uppercase mb-2 font-bold tracking-widest italic">
                          nilai x{i + 1}
                        </span>
                        <span className="text-5xl font-bold tracking-tighter text-white">
                          {typeof val === "number" ? val.toFixed(4) : "0.0000"}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {!results && !loading && (
              <div className="mt-12 opacity-50 grayscale">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xl font-bold tracking-tighter">
                    tahapan eliminasi & penyulihan.
                  </h2>
                  <div className="h-[1px] flex-1 bg-gray-200"></div>
                </div>
                <div className="bg-white/50 border border-dashed border-gray-300 rounded-[40px] h-60 flex items-center justify-center text-gray-400 italic text-sm text-center px-10">
                  hasil dekomposisi L dan U, proses penyulihan maju, serta
                  penyulihan mundur akan ditampilkan di sini.
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

export default DekomposisiLUPage;
