"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GuideModal } from "@/components/common/guide-modal";
import { ErrorMessage } from "@/components/common/error-message";
import { DecimalControl } from "@/components/common/decimal-control";
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
  const [showSteps, setShowSteps] = useState(true);
  const [decimals, setDecimals] = useState<number>(2);

  // Menggunakan string agar kotak form input bisa dikosongkan dengan leluasa saat diketik
  const [matrixA, setMatrixA] = useState<(string | number)[][]>([
    [1, 1, 1],
    [2, 4, 2],
    [-1, 5, 8],
  ]);
  const [vectorB, setVectorB] = useState<(string | number)[]>([6, 16, 31]);

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
    newMatrix[row][col] = value;
    setMatrixA(newMatrix);
  };

  const handleBChange = (row: number, value: string) => {
    const newVector = [...vectorB];
    newVector[row] = value;
    setVectorB(newVector);
  };

  const resetInput = () => {
    setMatrixA([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setVectorB(["", "", ""]);
    setResults(null);
    setError(null);
  };

  const calculateLU = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    const parsedMatrixA = matrixA.map((row) =>
      row.map((val) => (val === "" ? 0 : parseFloat(val.toString()) || 0)),
    );
    const parsedVectorB = vectorB.map((val) =>
      val === "" ? 0 : parseFloat(val.toString()) || 0,
    );

    try {
      const response = await fetch("/api/matriks/dekomposisi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matrixA: parsedMatrixA,
          vectorB: parsedVectorB,
        }),
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

  const fmt = (n: number, places = decimals) => {
    if (typeof n !== "number" || isNaN(n)) return "0";
    return n.toFixed(places);
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
          "isi konstanta hasil pada vektor b di kolom kanan (vertikal).",
          "klik 'jalankan dekomposisi' untuk melihat proses faktorisasi L dan U, penyulihan maju Ly=b, serta penyulihan mundur Ux=y.",
        ]}
        onClose={handleCloseGuide}
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage message={error} onClose={() => setError(null)} />

          <div className="fixed bottom-10 right-10 z-[100]">
            <Button
              onClick={() => setShowGuide(true)}
              className="w-14 h-14 rounded-full bg-white text-black border border-gray-100 shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
            >
              <HelpCircle className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
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
                  <h2 className="text-xl font-bold tracking-tight text-black">
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
                {/* Matrix A Inputs */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-[30px] border border-gray-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    koefisien [A]
                  </span>
                  {matrixA.map((row, r) =>
                    row.map((val, c) => (
                      <Input
                        key={`a-${r}-${c}`}
                        type="number"
                        value={val}
                        onChange={(e) => handleAChange(r, c, e.target.value)}
                        className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white focus-visible:ring-emerald-500"
                      />
                    )),
                  )}
                </div>

                <ArrowRight className="text-gray-200 w-8 h-8 hidden md:block shrink-0" />

                {/* Vector B Inputs (Vertikal Kolom) */}
                <div className="flex flex-col gap-3 p-4 bg-emerald-50/50 rounded-[30px] border border-emerald-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-emerald-300 uppercase tracking-widest font-sans">
                    vektor [b]
                  </span>
                  {vectorB.map((val, r) => (
                    <div key={`b-row-${r}`} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400 w-4">
                        b{r + 1}
                      </span>
                      <Input
                        key={`b-${r}`}
                        type="number"
                        value={val}
                        onChange={(e) => handleBChange(r, e.target.value)}
                        className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white text-emerald-600 focus-visible:ring-emerald-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={calculateLU}
                disabled={loading}
                className="w-full py-8 bg-zinc-900 text-white rounded-[30px] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex gap-3 group border-none"
              >
                {loading ? "sedang memproses..." : "jalankan dekomposisi"}
                {!loading && (
                  <Layers className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                )}
              </Button>
            </Card>

            {/* INFO PANEL (Diubah menjadi Soft Gray dengan Border Halus) */}
            <Card className="p-8 md:p-10 rounded-[40px] border border-gray-200/60 shadow-xl bg-zinc-50 text-zinc-800 flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4 text-zinc-900">
                  struktur pemfaktoran.
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center font-bold text-emerald-600 font-mono text-lg border border-emerald-100">
                      L
                    </div>
                    <p className="text-[10px] text-zinc-500 italic leading-relaxed">
                      matriks segitiga bawah (lower) dengan semua elemen
                      diagonal = 1.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center font-bold text-blue-600 font-mono text-lg border border-blue-100">
                      U
                    </div>
                    <p className="text-[10px] text-zinc-500 italic leading-relaxed">
                      matriks segitiga atas (upper) hasil eliminasi Gauss.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-6 border-t border-zinc-200 relative z-10">
                <p className="text-[10px] text-zinc-400 mb-4 uppercase tracking-widest font-bold">
                  alur penyelesaian:
                </p>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                  <span className="text-emerald-600">A = LU</span>
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-500">Ly = b</span>
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-600">Ux = y</span>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
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
                {/* LOG TAHAPAN ELIMINASI */}
                <div>
                  <button
                    onClick={() => setShowSteps((v) => !v)}
                    className="flex items-center gap-3 group mb-6 w-full"
                  >
                    <SplitSquareHorizontal className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-xl font-bold tracking-tighter text-black group-hover:text-emerald-600 transition-colors">
                      log tahapan dekomposisi (seperti excel).
                    </h2>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
                      {showSteps
                        ? "sembunyikan"
                        : `tampilkan ${results.steps.length} tabel`}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showSteps && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 overflow-hidden"
                      >
                        {results.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-6 md:p-8 rounded-[35px] shadow-md border border-gray-100 flex flex-col gap-4"
                          >
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
                              <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-zinc-100 text-[11px] text-zinc-700 border border-zinc-200 flex items-center justify-center font-bold">
                                  {index + 1}
                                </span>
                                <p className="text-xs font-bold text-emerald-700 font-sans tracking-wide">
                                  {step.label}
                                </p>
                              </div>
                              <span className="text-[9px] font-mono bg-gray-100 px-3 py-1 rounded-full text-gray-500 uppercase tracking-wider">
                                status berkala [L | U]
                              </span>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-gray-50/50 p-6 rounded-[25px] border border-gray-100 overflow-x-auto">
                              <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold text-emerald-500 font-mono uppercase mb-2">
                                  Matriks L
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                  {step.matrixL.map((row, ri) =>
                                    row.map((val, ci) => (
                                      <div
                                        key={`step-l-${ri}-${ci}`}
                                        className={`w-14 h-12 flex items-center justify-center text-xs font-mono font-bold rounded-xl border transition-all ${
                                          ri >= ci
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                            : "bg-white border-gray-200 text-gray-300"
                                        }`}
                                      >
                                        {fmt(val)}
                                      </div>
                                    )),
                                  )}
                                </div>
                              </div>

                              <div className="text-gray-300 font-bold text-xl hidden md:block">
                                ×
                              </div>

                              <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold text-blue-500 font-mono uppercase mb-2">
                                  Matriks U
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                  {step.matrixU.map((row, ri) =>
                                    row.map((val, ci) => (
                                      <div
                                        key={`step-u-${ri}-${ci}`}
                                        className={`w-14 h-12 flex items-center justify-center text-xs font-mono font-bold rounded-xl border transition-all ${
                                          ri <= ci
                                            ? "bg-blue-50 border-blue-200 text-blue-800"
                                            : "bg-white border-gray-200 text-gray-300"
                                        }`}
                                      >
                                        {fmt(val)}
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

                {/* FAKTORISASI AKHIR */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4 flex-1">
                      <h2 className="text-xl font-bold tracking-tighter text-black">
                        faktorisasi akhir murni (A = LU).
                      </h2>
                      <div className="h-[1px] flex-1 bg-gray-200" />
                    </div>
                    <DecimalControl
                      decimals={decimals}
                      setDecimals={setDecimals}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-8 rounded-[40px] border-none shadow-lg bg-white relative overflow-hidden">
                      <span className="absolute top-4 right-6 text-[60px] font-black text-gray-50/60 select-none">
                        L
                      </span>
                      <h4 className="text-sm font-bold mb-2 text-emerald-600 uppercase tracking-widest">
                        matriks L final
                      </h4>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {results.L.map((row, rIdx) =>
                          row.map((val, cIdx) => (
                            <div
                              key={`l-f-${rIdx}-${cIdx}`}
                              className={`h-14 flex items-center justify-center font-bold rounded-2xl text-sm ${
                                rIdx === cIdx
                                  ? "bg-emerald-600 text-white shadow-md"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {fmt(val)}
                            </div>
                          )),
                        )}
                      </div>
                    </Card>

                    <Card className="p-8 rounded-[40px] border-none shadow-lg bg-white relative overflow-hidden">
                      <span className="absolute top-4 right-6 text-[60px] font-black text-gray-50/60 select-none">
                        U
                      </span>
                      <h4 className="text-sm font-bold mb-2 text-blue-600 uppercase tracking-widest">
                        matriks U final
                      </h4>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {results.U.map((row, rIdx) =>
                          row.map((val, cIdx) => (
                            <div
                              key={`u-f-${rIdx}-${cIdx}`}
                              className={`h-14 flex items-center justify-center font-bold rounded-2xl text-sm ${
                                rIdx === cIdx
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {fmt(val)}
                            </div>
                          )),
                        )}
                      </div>
                    </Card>
                  </div>
                </div>

                {/* SUBSTITUSI ALJABAR */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold tracking-tighter text-black">
                      proses penyulihan aljabar (substitusi).
                    </h2>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-lg bg-white">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                          <ArrowDown className="text-white w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold tracking-tight">
                            proses penyulihan maju (Ly = b)
                          </h4>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            temukan nilai vektor y
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {results.forwardSteps?.map((step, i) => (
                          <div
                            key={i}
                            className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-1 border border-gray-100"
                          >
                            <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">
                              langkah y{i + 1}
                            </span>
                            <span className="font-mono text-xs font-bold text-gray-800">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-6 flex-wrap border-t border-gray-100 pt-4">
                        {results.y.map((val, i) => (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center bg-emerald-50 rounded-xl py-2"
                          >
                            <span className="text-[9px] font-bold text-emerald-500 uppercase">
                              y{i + 1}
                            </span>
                            <span className="text-base font-mono font-bold text-emerald-800">
                              {fmt(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-lg bg-white">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                          <IterationCcw className="text-white w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold tracking-tight">
                            proses penyulihan mundur (Ux = y)
                          </h4>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            temukan nilai variabel x (solusi)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {results.backwardSteps?.map((step, i) => (
                          <div
                            key={i}
                            className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-1 border border-gray-100"
                          >
                            <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">
                              langkah x{results.x.length - i}
                            </span>
                            <span className="font-mono text-xs font-bold text-gray-800">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-6 flex-wrap border-t border-gray-100 pt-4">
                        {results.x.map((val, i) => (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center bg-blue-50 rounded-xl py-2"
                          >
                            <span className="text-[9px] font-bold text-blue-500 uppercase">
                              x{i + 1}
                            </span>
                            <span className="text-base font-mono font-bold text-blue-800">
                              {fmt(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>

                {/* SOLUSI KESIMPULAN (Diubah dari bg-black menjadi Soft Mint Emerald) */}
                <Card className="p-10 rounded-[45px] border border-emerald-100 shadow-xl bg-emerald-50/60 text-zinc-800 text-center relative overflow-hidden">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-8 font-sans">
                    solusi akhir sistem persamaan linear
                  </h4>
                  <div className="flex flex-col md:flex-row justify-center gap-12 items-center">
                    {results.x?.map((val, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-zinc-400 text-[10px] uppercase mb-2 font-bold tracking-widest italic">
                          nilai variabel{" "}
                          {i === 0 ? "x (x1)" : i === 1 ? "y (x2)" : "z (x3)"}
                        </span>
                        <span className="text-5xl font-bold tracking-tighter text-emerald-700 font-mono">
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
                      tahapan dekomposisi & penyulihan.
                    </h2>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>
                  <div className="bg-white/50 border border-dashed border-gray-300 rounded-[40px] h-60 flex items-center justify-center text-gray-400 italic text-sm text-center px-10">
                    hasil dekomposisi L dan U, proses penyulihan maju, serta
                    jawaban akhir akan dipetakan di sini.
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