"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorMessage } from "@/components/common/error-message";
import { GuideModal } from "@/components/common/guide-modal";
import {
  RotateCcw,
  Play,
  HelpCircle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Grid3X3,
} from "lucide-react";

interface MatrixStep {
  label: string;
  matrixA: number[][];
  matrixInv: number[][];
}

interface CalculationResult {
  steps: MatrixStep[];
  finalInverse: number[][];
  solution: number[];
}

const MatriksBalikanPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CalculationResult | null>(null);

  // Default value based on Buku Contoh 4.9
  const [matrixA, setMatrixA] = useState([
    [1, -1, 2],
    [3, 0, 1],
    [1, 0, 2],
  ]);
  const [vectorB, setVectorB] = useState([5, 10, 5]);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hasSeenInverseGuide");
    if (!hasSeenGuide) setShowGuide(true);
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hasSeenInverseGuide", "true");
  };

  const handleAChange = (row: number, col: number, value: string) => {
    const newMatrix = matrixA.map((r) => [...r]);
    newMatrix[row][col] = value === "" ? 0 : parseFloat(value);
    setMatrixA(newMatrix);
  };

  const handleBChange = (row: number, value: string) => {
    const newVector = [...vectorB];
    newVector[row] = value === "" ? 0 : parseFloat(value);
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

  const calculateInverse = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const response = await fetch("/api/matriks/balikan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matrixA, vectorB }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "gagal melakukan perhitungan.");
        return;
      }
      setResults(data);
    } catch {
      setError("koneksi ke server terputus. silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number, decimals = 4) => {
    const rounded = parseFloat(n.toFixed(decimals));
    return Number.isInteger(rounded)
      ? rounded.toString()
      : rounded.toFixed(decimals);
  };

  return (
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 lowercase">
      <Navbar />

      <GuideModal
        isOpen={showGuide}
        onOpenChange={setShowGuide}
        title="panduan kalkulator"
        description="pahami cara kerja metode matriks balikan melalui eliminasi gauss-jordan."
        theoryOverview="metode ini mencari invers matriks A menggunakan augmented matrix [A|I] lalu menghitung solusi sistem melalui rumus x = A⁻¹b."
        steps={[
          "isi koefisien variabel pada matriks a (pastikan matriks tidak singular).",
          "masukkan nilai konstanta hasil pada vektor b.",
          "klik 'hitung' untuk melihat log eliminasi baris, matriks invers akhir, dan solusi x = A⁻¹b.",
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

          {/* HERO SECTION */}
          <section className="bg-white rounded-[40px] md:rounded-[50px] p-8 md:p-16 border border-gray-100 shadow-2xl mb-8 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="max-w-xl flex-1">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold tracking-[0.2em] rounded-full uppercase mb-6 inline-block"
                >
                  metode matriks balikan
                </motion.span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black leading-tight mb-6">
                  solusi <span className="text-gray-300">spl</span> <br />{" "}
                  dengan matriks invers.
                </h1>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  selesaikan sistem persamaan linear dengan mencari balikan
                  (invers) dari matriks koefisien. metode ini menggunakan
                  eliminasi gauss-jordan untuk mereduksi matriks augmented
                  secara efisien.
                </p>
              </div>

              <motion.div className="w-full md:w-[350px] flex justify-center items-center">
                <div className="relative w-full aspect-square">
                  <Image
                    src="/images/Mathematics-pana.svg"
                    alt="Inverse Matrix Illustration"
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* INPUT SECTION */}
            <Card className="lg:col-span-2 p-8 md:p-12 rounded-[40px] border-none shadow-xl bg-white flex flex-col gap-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-black">
                    input augmented.
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-sans">
                    koefisien [a | b]
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetInput}
                  className="rounded-full hover:bg-red-50 group transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                </Button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Matrix A Inputs */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-[30px] border border-gray-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest font-sans">
                    matriks a
                  </span>
                  {matrixA.map((row, r) =>
                    row.map((_, c) => (
                      <Input
                        key={`a-${r}-${c}`}
                        type="number"
                        value={matrixA[r][c]}
                        onChange={(e) => handleAChange(r, c, e.target.value)}
                        className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white focus-visible:ring-blue-500"
                      />
                    )),
                  )}
                </div>

                <div className="h-40 w-[2px] bg-gray-100 hidden md:block" />

                {/* Vector B Inputs */}
                <div className="grid grid-cols-1 gap-3 p-4 bg-blue-50/50 rounded-[30px] border border-blue-100 relative">
                  <span className="absolute -top-6 left-2 text-[10px] font-bold text-blue-300 uppercase tracking-widest font-sans">
                    vektor b
                  </span>
                  {vectorB.map((val, r) => (
                    <Input
                      key={`b-${r}`}
                      type="number"
                      value={val}
                      onChange={(e) => handleBChange(r, e.target.value)}
                      className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white text-blue-600 focus-visible:ring-blue-500"
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={calculateInverse}
                disabled={loading}
                className="w-full py-8 bg-black text-white rounded-[30px] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex gap-3 group border-none"
              >
                {loading
                  ? "sedang memproses data..."
                  : "hitung solusi sekarang"}
                {!loading && (
                  <Play className="w-3 h-3 fill-current group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </Card>

            {/* INFO PANEL */}
            <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-xl bg-black text-white flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Calculator className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-4 tracking-tight">
                  target identitas.
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed italic mb-8">
                  metode gauss-jordan memaksa sisi kiri menjadi matriks
                  identitas untuk menghasilkan invers.
                </p>
                <div className="grid grid-cols-3 gap-2 opacity-30 scale-90 origin-left">
                  {[1, 0, 0, 0, 1, 0, 0, 0, 1].map((v, i) => (
                    <div
                      key={i}
                      className={`h-12 rounded-lg border border-white/20 flex items-center justify-center font-bold font-mono ${v === 1 ? "bg-white/10" : ""}`}
                    >
                      {v}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-blue-500/10 blur-[90px] rounded-full" />
            </Card>
          </div>

          {/* RESULTS SECTION */}
          <AnimatePresence mode="wait">
            {results ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-12 space-y-12"
              >
                {/* Solusi x = A⁻¹b */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold tracking-tighter text-black">
                      solusi x = a⁻¹b.
                    </h2>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {results.solution.map((val, i) => (
                      <Card
                        key={i}
                        className="p-10 rounded-[40px] border-none shadow-lg bg-white flex flex-col items-center justify-center group hover:bg-blue-600 transition-colors duration-500"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-white/20">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 group-hover:text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-500 group-hover:text-white uppercase tracking-[0.2em] mb-2">
                          variabel x{i + 1}
                        </span>
                        <h4 className="text-5xl font-bold tracking-tighter group-hover:text-white">
                          {fmt(val)}
                        </h4>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Matriks Invers Akhir A⁻¹ */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold tracking-tighter text-black">
                      matriks invers a⁻¹.
                    </h2>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>
                  <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-lg bg-white">
                    <div className="flex items-start gap-6">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                        <Grid3X3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                          hasil akhir eliminasi gauss-jordan
                        </p>
                        <div
                          className="grid gap-2"
                          style={{
                            gridTemplateColumns: `repeat(${results.finalInverse[0].length}, minmax(0, 1fr))`,
                          }}
                        >
                          {results.finalInverse.map((row, ri) =>
                            row.map((val, ci) => (
                              <div
                                key={`finv-${ri}-${ci}`}
                                className="w-16 h-16 flex items-center justify-center text-sm font-mono font-bold bg-blue-50 text-blue-700 rounded-2xl border border-blue-100"
                              >
                                {fmt(val)}
                              </div>
                            )),
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Log Langkah Eliminasi */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold tracking-tighter text-black">
                      log eliminasi baris.
                    </h2>
                    <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {results.steps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.04 }}
                        className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-col gap-6"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-full bg-blue-600 text-[10px] text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 shrink-0">
                            {index + 1}
                          </span>
                          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-sans">
                            {step.label}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 justify-between bg-gray-50/50 p-6 rounded-[30px] border border-gray-50 overflow-x-auto">
                          {/* Sisi kiri: bagian A */}
                          <div
                            className="grid gap-1.5 min-w-fit"
                            style={{
                              gridTemplateColumns: `repeat(${step.matrixA[0].length}, minmax(0, 1fr))`,
                            }}
                          >
                            {step.matrixA.map((r, ri) =>
                              r.map((c, ci) => (
                                <div
                                  key={`a-${ri}-${ci}`}
                                  className="w-10 h-10 flex items-center justify-center text-[10px] font-mono font-bold bg-white rounded-xl shadow-sm border border-gray-100"
                                >
                                  {fmt(c, 2)}
                                </div>
                              )),
                            )}
                          </div>

                          <ArrowRight className="w-5 h-5 text-gray-300 shrink-0" />

                          {/* Sisi kanan: bagian Inv */}
                          <div
                            className="grid gap-1.5 min-w-fit"
                            style={{
                              gridTemplateColumns: `repeat(${step.matrixInv[0].length}, minmax(0, 1fr))`,
                            }}
                          >
                            {step.matrixInv.map((r, ri) =>
                              r.map((c, ci) => (
                                <div
                                  key={`inv-${ri}-${ci}`}
                                  className="w-10 h-10 flex items-center justify-center text-[10px] font-mono font-bold bg-blue-50 text-blue-600 rounded-xl shadow-sm border border-blue-100"
                                >
                                  {fmt(c, 2)}
                                </div>
                              )),
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="mt-12 opacity-50 grayscale cursor-not-allowed">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xl font-bold tracking-tighter text-black">
                    hasil perhitungan.
                  </h2>
                  <div className="h-[1px] flex-1 bg-gray-200" />
                </div>
                <div className="bg-white/50 border border-dashed border-gray-300 rounded-[40px] h-60 flex items-center justify-center text-gray-400 italic text-sm px-10 text-center leading-loose lowercase">
                  masukkan data pada kolom di atas <br /> lalu klik tombol
                  hitung untuk melihat visualisasi langkah demi langkah
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

export default MatriksBalikanPage;
