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
import { DecimalControl } from "@/components/common/decimal-control";
import {
  RotateCcw,
  HelpCircle,
  Binary,
  ArrowRight,
  CheckCircle2,
  ArrowDown,
  IterationCcw,
  SplitSquareHorizontal,
  Sparkles,
} from "lucide-react";

interface CroutStep {
  type: "baris_u" | "kolom_l" | "pivot";
  label: string;
  detail: string;
}

interface CroutResult {
  L: number[][];
  U: number[][];
  y: number[];
  x: number[];
  forwardSteps: string[];
  backwardSteps: string[];
  decompositionSteps: CroutStep[];
}

const stepTypeStyle: Record<
  CroutStep["type"],
  { bg: string; text: string; border: string; label: string }
> = {
  baris_u: {
    bg: "bg-blue-50/80",
    text: "text-blue-600",
    border: "border-blue-100",
    label: "fase baris U",
  },
  kolom_l: {
    bg: "bg-pink-50/80",
    text: "text-pink-600",
    border: "border-pink-100",
    label: "fase kolom L",
  },
  pivot: {
    bg: "bg-amber-50/80",
    text: "text-amber-600",
    border: "border-amber-100",
    label: "pivoting otomatis",
  },
};

const ReduksiCroutPage = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CroutResult | null>(null);
  const [decimals, setDecimals] = useState<number>(2);

  // Form dikosongkan total saat pertama kali halaman dimuat
  const [matrixA, setMatrixA] = useState<(string | number)[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [vectorB, setVectorB] = useState<(string | number)[]>(["", "", ""]);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hasSeenCroutGuide");
    if (!hasSeenGuide) setShowGuide(true);
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hasSeenCroutGuide", "true");
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

  // CTA Interaktif untuk auto-fill menggunakan soal ujian yang valid
  const injectExampleProblem = () => {
    setMatrixA([
      [4, -1, -1],
      [-2, 6, 1],
      [1, -1, 5],
    ]);
    setVectorB([3, 9, -6]);
    setResults(null);
    setError(null);
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

  const calculateCrout = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    // Cek kelengkapan pengisian form
    const isMatrixEmpty = matrixA.some((row) => row.some((val) => val === ""));
    const isVectorEmpty = vectorB.some((val) => val === "");

    if (isMatrixEmpty || isVectorEmpty) {
      setError(
        "mohon isi semua kolom matriks koefisien A dan vektor b terlebih dahulu.",
      );
      setLoading(false);
      return;
    }

    const parsedMatrixA = matrixA.map((row) =>
      row.map((val) => (val === "" ? 0 : parseFloat(val.toString()) || 0)),
    );
    const parsedVectorB = vectorB.map((val) =>
      val === "" ? 0 : parseFloat(val.toString()) || 0,
    );

    try {
      const response = await fetch("/api/matriks/crout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matrixA: parsedMatrixA,
          vectorB: parsedVectorB,
          maxIter: 30,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "gagal melakukan reduksi crout.");
        return;
      }

      setResults(data);
    } catch {
      setError("koneksi ke server terputus. silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number, places = decimals) => {
    if (typeof n !== "number" || isNaN(n)) return "0";
    return n.toFixed(places);
  };

  return (
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans selection:bg-pink-100 selection:text-pink-900 lowercase">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage message={error} onClose={() => setError(null)} />

          <div className="fixed bottom-10 right-10 z-50">
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
                  memiliki elemen diagonal bernilai murni 1. urutan komputasi
                  bergantian secara spesifik.
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

          {/* INPUT SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-8 md:p-12 rounded-[40px] border-none shadow-xl bg-white flex flex-col gap-10">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-black">
                    susun persamaan.
                  </h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    koefisien [a | b]
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* CTA BUTTON INPUT AUTOMATIC */}
                  <Button
                    variant="outline"
                    onClick={injectExampleProblem}
                    className="rounded-full px-4 py-2 bg-pink-50 text-pink-600 border border-pink-100 hover:bg-pink-100 text-[10px] font-bold tracking-wider uppercase flex gap-1.5 items-center transition-all"
                  >
                    <Sparkles className="w-3 h-3 fill-current" />
                    pakai contoh soal ujian
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetInput}
                    className="rounded-full hover:bg-red-50 border-none transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Matrix A */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-[30px] border border-gray-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    matriks [A]
                  </span>
                  {matrixA.map((row, r) =>
                    row.map((val, c) => (
                      <Input
                        key={`a-${r}-${c}`}
                        type="number"
                        placeholder="0"
                        value={val}
                        onChange={(e) => handleAChange(r, c, e.target.value)}
                        className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white focus-visible:ring-pink-500"
                      />
                    )),
                  )}
                </div>

                <div className="h-40 w-[2px] bg-gray-100 hidden md:block" />

                {/* Vector B */}
                <div className="flex flex-col gap-3 p-4 bg-pink-50/50 rounded-[30px] border border-pink-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-pink-300 uppercase tracking-widest font-sans">
                    vektor [b]
                  </span>
                  {vectorB.map((val, r) => (
                    <div
                      key={`b-container-${r}`}
                      className="flex items-center gap-2"
                    >
                      <span className="text-[10px] font-mono text-gray-400 w-4">
                        b{r + 1}
                      </span>
                      <Input
                        key={`b-${r}`}
                        type="number"
                        placeholder="0"
                        value={val}
                        onChange={(e) => handleBChange(r, e.target.value)}
                        className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white text-pink-600 focus-visible:ring-pink-500"
                      />
                    </div>
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

            {/* INFO PANEL */}
            <Card className="p-8 md:p-10 rounded-[40px] border border-pink-100 shadow-xl bg-white text-black flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6 text-pink-600">
                  skema crout.
                </h3>
                <div className="space-y-5">
                  <div className="p-4 bg-pink-50/40 rounded-2xl border border-pink-100/50">
                    <p className="text-[10px] text-pink-500 mb-2 uppercase font-bold tracking-widest">
                      aturan diagonal
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      diagonal matriks U wajib bernilai satu{" "}
                      <span className="text-pink-600 font-bold underline">
                        (uᵢᵢ = 1)
                      </span>
                      . Nilai diagonal L dicari bertahap.
                    </p>
                  </div>
                  <div className="p-4 bg-pink-50/40 rounded-2xl border border-pink-100/50">
                    <p className="text-[10px] text-pink-500 mb-2 uppercase font-bold tracking-widest">
                      urutan eliminasi:
                    </p>
                    <p className="text-[11px] font-mono text-pink-600 leading-relaxed font-bold">
                      Kolom-1 L → Baris-1 U → Kolom-2 L → Baris-2 U → ... dst.
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-pink-500/10 blur-[90px] rounded-full" />
            </Card>
          </div>

          {/* RESULTS SECTION */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 space-y-12"
              >
                {/* LOG TAHAPAN ELIMINASI */}
                {results.decompositionSteps &&
                  results.decompositionSteps.length > 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <SplitSquareHorizontal className="w-5 h-5 text-pink-600" />
                        <h2 className="text-xl font-bold tracking-tighter text-black">
                          log tahapan reduksi crout (langkah komputasi).
                        </h2>
                        <div className="h-[1px] flex-1 bg-gray-200" />
                      </div>

                      <div className="space-y-6">
                        {results.decompositionSteps.map((step, index) => {
                          const style =
                            stepTypeStyle[step.type] ||
                            stepTypeStyle["baris_u"];
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.01 }}
                              className="bg-white p-6 md:p-8 rounded-[35px] shadow-md border border-gray-100 flex flex-col gap-4"
                            >
                              <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                  <span className="w-7 h-7 rounded-full bg-pink-600 text-[10px] text-white flex items-center justify-center font-bold shadow-md">
                                    {index + 1}
                                  </span>
                                  <span
                                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${style.bg} ${style.text}`}
                                  >
                                    {style.label}
                                  </span>
                                  <p className="text-xs font-bold text-gray-700 tracking-tight">
                                    {step.label}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={`p-4 rounded-2xl font-mono text-xs border ${style.bg} ${style.border} ${style.text} leading-loose break-words`}
                              >
                                <strong>rumus / nilai:</strong> <br />
                                {step.detail}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* FAKTORISASI AKHIR MATRIKS L & U */}
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4 flex-1">
                      <h2 className="text-xl font-bold tracking-tighter text-black">
                        hasil akhir reduksi matriks (A = LU).
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
                      <span className="absolute top-4 right-6 text-[60px] font-black text-gray-50 select-none">
                        L
                      </span>
                      <h4 className="text-[10px] font-bold text-pink-600 uppercase tracking-[0.2em] mb-4">
                        matriks L (segitiga bawah)
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {results.L.map((row, rIdx) =>
                          row.map((val, cIdx) => (
                            <div
                              key={`l-crout-${rIdx}-${cIdx}`}
                              className={`h-14 flex items-center justify-center font-mono font-bold rounded-2xl text-xs ${rIdx >= cIdx ? "bg-pink-50 text-pink-700 border border-pink-100" : "bg-gray-50 text-gray-300"}`}
                            >
                              {fmt(val)}
                            </div>
                          )),
                        )}
                      </div>
                    </Card>

                    <Card className="p-8 rounded-[40px] border-none shadow-lg bg-white relative overflow-hidden">
                      <span className="absolute top-4 right-6 text-[60px] font-black text-gray-50 select-none">
                        U
                      </span>
                      <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">
                        matriks U (segitiga atas)
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {results.U.map((row, rIdx) =>
                          row.map((val, cIdx) => (
                            <div
                              key={`u-crout-${rIdx}-${cIdx}`}
                              className={`h-14 flex items-center justify-center font-mono font-bold rounded-2xl text-xs ${rIdx <= cIdx ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-gray-50 text-gray-300"}`}
                            >
                              {fmt(val)}
                            </div>
                          )),
                        )}
                      </div>
                    </Card>
                  </div>
                </div>

                {/* PENYULIHAN */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-lg bg-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center shrink-0">
                        <ArrowDown className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold tracking-tight">
                          penyulihan maju (Ly = b)
                        </h4>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                          mencari nilai y
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {results.forwardSteps?.map((step, i) => (
                        <div
                          key={i}
                          className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-1 border border-gray-100"
                        >
                          <span className="text-[9px] text-pink-600 font-bold uppercase">
                            langkah y{i + 1}
                          </span>
                          <span className="font-mono text-xs text-gray-800">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-6 border-t border-gray-100 pt-4">
                      {results.y.map((val, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center bg-pink-50 rounded-xl py-2"
                        >
                          <span className="text-[9px] font-bold text-pink-500 uppercase">
                            y{i + 1}
                          </span>
                          <span className="text-sm font-mono font-bold text-pink-800">
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
                          penyulihan mundur (Ux = y)
                        </h4>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                          mencari solusi x
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {results.backwardSteps?.map((step, i) => (
                        <div
                          key={i}
                          className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-1 border border-gray-100"
                        >
                          <span className="text-[9px] text-blue-600 font-bold uppercase">
                            langkah x{results.x.length - i}
                          </span>
                          <span className="font-mono text-xs text-gray-800">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-6 border-t border-gray-100 pt-4">
                      {results.x.map((val, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center bg-blue-50 rounded-xl py-2"
                        >
                          <span className="text-[9px] font-bold text-blue-500 uppercase">
                            x{i + 1}
                          </span>
                          <span className="text-sm font-mono font-bold text-blue-800">
                            {fmt(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* KESIMPULAN AKHIR */}
                <Card className="p-10 rounded-[45px] border border-pink-100 shadow-xl bg-white text-black text-center relative overflow-hidden">
                  <div className="relative z-10">
                    <CheckCircle2 className="w-12 h-12 text-pink-500 mx-auto mb-6" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-pink-500 mb-8">
                      solusi akhir akar persamaan linear
                    </h4>
                    <div className="flex flex-col md:flex-row justify-center gap-12 items-center">
                      {results.x.map((val, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <span className="text-gray-400 text-[10px] uppercase mb-2 font-bold tracking-widest">
                            variabel{" "}
                            {i === 0 ? "x (x1)" : i === 1 ? "y (x2)" : "z (x3)"}
                          </span>
                          <span className="text-5xl font-bold tracking-tighter text-pink-600 font-mono">
                            {fmt(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-pink-500/5 blur-[80px] rounded-full" />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <GuideModal
        isOpen={showGuide}
        onOpenChange={setShowGuide}
        title="panduan crout"
        description="pahami skema pemfaktoran crout untuk efisiensi perhitungan spl."
        theoryOverview="metode ini memfaktorkan A = LU dengan syarat elemen diagonal matriks U bernilai satu (uᵢᵢ = 1). penghitungan bergantian: kolom L → baris U → kolom L → ..."
        steps={[
          "masukkan koefisien variabel pada matriks A.",
          "isi konstanta hasil pada vektor b.",
          "klik tombol 'jalankan kalkulasi crout' untuk melihat hasil pemfaktoran L dan U, penyulihan maju (Ly=b), serta penyulihan mundur (Ux=y).",
        ]}
        onClose={handleCloseGuide}
      />

      <Footer />
    </div>
  );
};

export default ReduksiCroutPage;
