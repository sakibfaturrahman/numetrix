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
  SplitSquareHorizontal,
} from "lucide-react";

// Interface sesuai dengan response dari backend (dekomposisi.ts)
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

// Helper: format angka ringkas
const fmt = (n: number, dec = 4): string => {
  if (typeof n !== "number" || isNaN(n)) return "0";
  const r = parseFloat(n.toFixed(dec));
  return Number.isInteger(r) ? r.toString() : r.toFixed(dec);
};

const DekomposisiLUPage = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<LUResult | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  // Default: contoh dari buku hal. 151
  const [matrixA, setMatrixA] = useState([
    [2, -1, -1],
    [0, -4, 2],
    [6, -3, 1],
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
    const newMatrix = matrixA.map((r) => [...r]);
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
      [2, -1, -1],
      [0, -4, 2],
      [6, -3, 1],
    ]);
    setVectorB([1, 5, 1]);
    setResults(null);
    setError(null);
    setShowSteps(false);
  };

  const calculateLU = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setShowSteps(false);

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
    } catch {
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
        theoryOverview="metode ini memfaktorkan A = LU. L adalah matriks segitiga bawah dengan diagonal 1, dan U adalah matriks segitiga atas hasil eliminasi Gauss. solusi dicari melalui dua tahap: penyulihan maju (Ly = b) untuk mencari y, lalu penyulihan mundur (Ux = y) untuk mencari x."
        steps={[
          "masukkan koefisien matriks a pada grid kiri.",
          "isi konstanta hasil pada vektor b di kolom kanan.",
          "klik 'jalankan dekomposisi' untuk melihat proses faktorisasi L dan U, penyulihan maju Ly=b, serta penyulihan mundur Ux=y.",
        ]}
        onClose={handleCloseGuide}
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage message={error} onClose={() => setError(null)} />

          {/* Tombol Bantuan Mengambang */}
          <div className="fixed bottom-10 right-10 z-[100]">
            <Button
              onClick={() => setShowGuide(true)}
              className="w-14 h-14 rounded-full bg-black shadow-2xl hover:scale-110 transition-transform border-none flex items-center justify-center group"
            >
              <HelpCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            </Button>
          </div>

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

          {/* INPUT SECTION */}
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
                {/* Matrix A */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-[30px] border border-gray-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    koefisien [A]
                  </span>
                  {matrixA.map((row, r) =>
                    row.map((_, c) => (
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

                <ArrowRight className="text-gray-200 w-8 h-8 hidden md:block shrink-0" />

                {/* Vector B */}
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

            {/* INFO PANEL */}
            <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-xl bg-[#111] text-white flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4">
                  struktur pemfaktoran.
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center font-bold text-emerald-400 font-mono text-lg">
                      L
                    </div>
                    <p className="text-[10px] text-gray-500 italic leading-relaxed">
                      matriks segitiga bawah (lower) dengan semua elemen
                      diagonal = 1.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center font-bold text-blue-400 font-mono text-lg">
                      U
                    </div>
                    <p className="text-[10px] text-gray-500 italic leading-relaxed">
                      matriks segitiga atas (upper) hasil eliminasi Gauss.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-6 border-t border-white/5 relative z-10">
                <p className="text-[10px] text-gray-500 mb-4 uppercase tracking-widest font-bold">
                  alur penyelesaian:
                </p>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                  <span className="text-emerald-400">A = LU</span>
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-300">Ly = b</span>
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span className="text-blue-300">Ux = y</span>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
            </Card>
          </div>

          {/* RESULTS SECTION */}
          <AnimatePresence>
            {results && results.L && results.U ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 space-y-12"
              >
                {/* Matriks L & U Akhir */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold tracking-tighter text-black">
                      hasil faktorisasi A = LU.
                    </h2>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Matriks L */}
                    <Card className="p-8 rounded-[40px] border-none shadow-lg bg-white relative overflow-hidden">
                      <span className="absolute top-4 right-6 text-[60px] font-black text-gray-50 select-none">
                        L
                      </span>
                      <h4 className="text-sm font-bold mb-2 text-emerald-600 uppercase tracking-widest">
                        matriks L (segitiga bawah)
                      </h4>
                      <p className="text-[10px] text-gray-400 mb-6 italic">
                        diagonal = 1, elemen bawah diagonal = faktor eliminasi
                      </p>
                      <div
                        className="grid gap-2"
                        style={{
                          gridTemplateColumns: `repeat(${results.L[0].length}, minmax(0, 1fr))`,
                        }}
                      >
                        {results.L.map((row, rIdx) =>
                          row.map((val, cIdx) => (
                            <div
                              key={`l-${rIdx}-${cIdx}`}
                              className={`h-14 md:h-16 flex items-center justify-center font-bold rounded-2xl text-sm transition-colors ${
                                rIdx === cIdx
                                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                                  : rIdx > cIdx
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-gray-50 text-gray-300"
                              }`}
                            >
                              {fmt(val, 4)}
                            </div>
                          )),
                        )}
                      </div>
                    </Card>

                    {/* Matriks U */}
                    <Card className="p-8 rounded-[40px] border-none shadow-lg bg-white relative overflow-hidden">
                      <span className="absolute top-4 right-6 text-[60px] font-black text-gray-50 select-none">
                        U
                      </span>
                      <h4 className="text-sm font-bold mb-2 text-blue-600 uppercase tracking-widest">
                        matriks U (segitiga atas)
                      </h4>
                      <p className="text-[10px] text-gray-400 mb-6 italic">
                        hasil eliminasi Gauss dari matriks A
                      </p>
                      <div
                        className="grid gap-2"
                        style={{
                          gridTemplateColumns: `repeat(${results.U[0].length}, minmax(0, 1fr))`,
                        }}
                      >
                        {results.U.map((row, rIdx) =>
                          row.map((val, cIdx) => (
                            <div
                              key={`u-${rIdx}-${cIdx}`}
                              className={`h-14 md:h-16 flex items-center justify-center font-bold rounded-2xl text-sm transition-colors ${
                                rIdx < cIdx
                                  ? "bg-blue-50 text-blue-700"
                                  : rIdx === cIdx
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                    : "bg-gray-50 text-gray-300"
                              }`}
                            >
                              {fmt(val, 4)}
                            </div>
                          )),
                        )}
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Penyulihan Maju & Mundur */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold tracking-tighter text-black">
                      proses penyulihan.
                    </h2>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Forward Substitution: Ly = b */}
                    <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-lg bg-white">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                          <ArrowDown className="text-white w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold tracking-tight">
                            penyulihan maju
                          </h4>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Ly = b → cari y
                          </p>
                        </div>
                      </div>

                      {/* Vektor y hasil */}
                      <div className="flex gap-2 mb-6 flex-wrap">
                        {results.y.map((val, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center bg-emerald-50 rounded-2xl px-4 py-3 min-w-[60px]"
                          >
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
                              y{i + 1}
                            </span>
                            <span className="text-lg font-bold text-emerald-700 font-mono">
                              {fmt(val)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        {results.forwardSteps?.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="p-4 bg-gray-50 rounded-2xl flex justify-between items-start gap-3"
                          >
                            <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">
                              langkah {i + 1}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-emerald-600 text-right">
                              {step}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </Card>

                    {/* Backward Substitution: Ux = y */}
                    <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-lg bg-white">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                          <IterationCcw className="text-white w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold tracking-tight">
                            penyulihan mundur
                          </h4>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Ux = y → cari x
                          </p>
                        </div>
                      </div>

                      {/* Vektor x hasil */}
                      <div className="flex gap-2 mb-6 flex-wrap">
                        {results.x.map((val, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center bg-blue-50 rounded-2xl px-4 py-3 min-w-[60px]"
                          >
                            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">
                              x{i + 1}
                            </span>
                            <span className="text-lg font-bold text-blue-700 font-mono">
                              {fmt(val)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        {results.backwardSteps?.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="p-4 bg-gray-50 rounded-2xl flex justify-between items-start gap-3"
                          >
                            <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">
                              langkah {i + 1}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-blue-600 text-right">
                              {step}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Log Steps Eliminasi (Collapsible) */}
                <div>
                  <button
                    onClick={() => setShowSteps((v) => !v)}
                    className="flex items-center gap-3 group mb-6 w-full"
                  >
                    <SplitSquareHorizontal className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                    <h2 className="text-xl font-bold tracking-tighter text-black group-hover:text-emerald-600 transition-colors">
                      log eliminasi L & U.
                    </h2>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
                      {showSteps
                        ? "sembunyikan"
                        : `tampilkan ${results.steps.length} langkah`}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showSteps && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
                      >
                        {results.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-50 flex flex-col gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-emerald-600 text-[9px] text-white flex items-center justify-center font-bold shadow-md shadow-emerald-100 shrink-0">
                                {index + 1}
                              </span>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                {step.label}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50/80 p-4 rounded-[20px] overflow-x-auto">
                              {/* L snapshot */}
                              <div className="flex flex-col gap-1 min-w-fit">
                                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
                                  L
                                </span>
                                <div
                                  className="grid gap-1"
                                  style={{
                                    gridTemplateColumns: `repeat(${step.matrixL[0].length}, minmax(0, 1fr))`,
                                  }}
                                >
                                  {step.matrixL.map((r, ri) =>
                                    r.map((c, ci) => (
                                      <div
                                        key={`sl-${ri}-${ci}`}
                                        className="w-9 h-9 flex items-center justify-center text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 rounded-lg"
                                      >
                                        {fmt(c, 2)}
                                      </div>
                                    )),
                                  )}
                                </div>
                              </div>

                              <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />

                              {/* U snapshot */}
                              <div className="flex flex-col gap-1 min-w-fit">
                                <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mb-1">
                                  U
                                </span>
                                <div
                                  className="grid gap-1"
                                  style={{
                                    gridTemplateColumns: `repeat(${step.matrixU[0].length}, minmax(0, 1fr))`,
                                  }}
                                >
                                  {step.matrixU.map((r, ri) =>
                                    r.map((c, ci) => (
                                      <div
                                        key={`su-${ri}-${ci}`}
                                        className="w-9 h-9 flex items-center justify-center text-[9px] font-mono font-bold bg-blue-50 text-blue-700 rounded-lg"
                                      >
                                        {fmt(c, 2)}
                                      </div>
                                    )),
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Solusi Akhir */}
                <Card className="p-10 rounded-[45px] border-none shadow-2xl bg-black text-white text-center relative overflow-hidden">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500 mb-8">
                    solusi sistem persamaan — x = U⁻¹y
                  </h4>
                  <div className="flex flex-col md:flex-row justify-center gap-12 items-center">
                    {results.x?.map((val, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-gray-500 text-[10px] uppercase mb-2 font-bold tracking-widest italic">
                          nilai x{i + 1}
                        </span>
                        <span className="text-5xl font-bold tracking-tighter text-white">
                          {fmt(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
                </Card>
              </motion.div>
            ) : (
              !loading && (
                <div className="mt-12 opacity-50 grayscale cursor-not-allowed">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-xl font-bold tracking-tighter">
                      tahapan eliminasi & penyulihan.
                    </h2>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>
                  <div className="bg-white/50 border border-dashed border-gray-300 rounded-[40px] h-60 flex items-center justify-center text-gray-400 italic text-sm text-center px-10">
                    hasil dekomposisi L dan U, proses penyulihan maju, serta
                    penyulihan mundur akan ditampilkan di sini.
                  </div>
                </div>
              )
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DekomposisiLUPage;
