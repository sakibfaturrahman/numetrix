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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  RotateCcw,
  Play,
  Zap,
  ListChecks,
  HelpCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface GaussSeidelIteration {
  iterasi: number;
  x: number;
  y: number;
  z: number;
  galatX: number;
  galatY: number;
  galatZ: number;
}

const TOLERANCE = 0.00001;

const GaussSeidelPage = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iterations, setIterations] = useState<GaussSeidelIteration[]>([]);
  const [initialValue, setInitialValue] = useState({ x: 0, y: 0, z: 0 });

  const matrixA = [
    [4, -1, 1],
    [4, -8, 1],
    [-2, 1, 5],
  ];
  const vectorB = [7, -21, 15];

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hasSeenSeidelGuide");
    if (!hasSeenGuide) setShowGuide(true);
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hasSeenSeidelGuide", "true");
  };

  // Ambil data iterasi terakhir untuk summary panel
  const lastIter =
    iterations.length > 0 ? iterations[iterations.length - 1] : null;
  const isConverged =
    lastIter !== null &&
    lastIter.galatX < TOLERANCE * 100 &&
    lastIter.galatY < TOLERANCE * 100 &&
    lastIter.galatZ < TOLERANCE * 100;

  const calculateGaussSeidel = async () => {
    setLoading(true);
    setError(null);
    setIterations([]);
    try {
      const response = await fetch("/api/spl/seidel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matrixA,
          vectorB,
          initialGuess: [initialValue.x, initialValue.y, initialValue.z],
          maxIter: 20,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal melakukan lelaran Gauss-Seidel.");
        return;
      }

      setIterations(data);
    } catch {
      setError("Terputus dari server. Pastikan API berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const resetInput = () => {
    setInitialValue({ x: 0, y: 0, z: 0 });
    setIterations([]);
    setError(null);
  };

  // Konversi galat angka → label TRUE/FALSE sesuai UI asli
  // TRUE = galat sudah di bawah toleransi (konvergen), FALSE = belum
  const galatLabel = (galat: number, iterasi: number): string | null => {
    if (iterasi === 0) return null;
    return galat < TOLERANCE * 100 ? "TRUE" : "FALSE";
  };

  return (
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900 lowercase">
      <Navbar />

      <GuideModal
        isOpen={showGuide}
        onOpenChange={setShowGuide}
        title="panduan lelaran seidel"
        description="pahami mekanisme pembaruan simultan pada metode gauss-seidel."
        theoryOverview="berbeda dengan jacobi, seidel langsung menggunakan nilai x terbaru untuk menghitung y di iterasi yang sama. hal ini membuat konvergensi jauh lebih cepat."
        steps={[
          "masukkan tebakan awal (p₀) pada kolom x, y, dan z.",
          "atur toleransi galat (ε) jika diperlukan (default 0.000001).",
          "klik 'eksekusi lelaran' untuk melihat tabel konvergensi hingga mencapai solusi sejati.",
        ]}
        onClose={handleCloseGuide}
      />

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
          <section className="bg-white rounded-[40px] md:rounded-[50px] p-8 md:p-16 border border-gray-100 shadow-2xl mb-8 overflow-hidden lowercase">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="max-w-xl flex-1">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-[0.2em] rounded-full uppercase mb-6 inline-block"
                >
                  metode lelaran gauss-seidel
                </motion.span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black leading-tight mb-6">
                  konvergensi <span className="text-gray-300">cepat</span>{" "}
                  <br /> lelaran gauss-seidel.
                </h1>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed lowercase">
                  metode iteratif yang lebih efisien karena langsung menggunakan
                  nilai variabel terbaru dalam satu siklus iterasi yang sama.
                  mempercepat proses pencarian solusi sejati.
                </p>
              </div>

              <motion.div className="w-full md:w-[350px] flex justify-center items-center">
                <div className="relative w-full aspect-square">
                  <Image
                    src="/images/Taking notes-bro.svg"
                    alt="Illustration"
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* INPUT & INFO SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-8 md:p-12 rounded-[40px] border-none shadow-xl bg-white flex flex-col gap-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-emerald-600">
                    persamaan seidel.
                  </h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    input nilai awal p₀
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetInput}
                  className="rounded-full hover:bg-gray-100 group"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                </Button>
              </div>

              {/* Grid Rumus */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "x", formula: "(7 + y - z) / 4" },
                  { label: "y", formula: "(-21 - 4x - z) / -8" },
                  { label: "z", formula: "(15 + 2x - y) / 5" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col gap-2 shadow-sm"
                  >
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      fungsi {item.label}
                    </span>
                    <code className="text-xs font-mono font-bold text-black">
                      {item.label} = {item.formula}
                    </code>
                  </div>
                ))}
              </div>

              {/* Input Awal */}
              <div className="flex gap-4">
                {["x", "y", "z"].map((axis) => (
                  <div key={axis} className="flex-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase mb-2 block tracking-widest text-center">
                      {axis}₀
                    </label>
                    <Input
                      type="number"
                      value={initialValue[axis as keyof typeof initialValue]}
                      onChange={(e) =>
                        setInitialValue({
                          ...initialValue,
                          [axis]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="rounded-2xl border-none bg-gray-50 text-center font-bold text-lg h-14 focus-visible:ring-emerald-500 shadow-inner"
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={calculateGaussSeidel}
                disabled={loading}
                className="w-full py-8 bg-black text-white rounded-[30px] text-xs font-bold uppercase tracking-[0.2em] hover:bg-emerald-800 transition-all flex gap-3 group shadow-lg active:scale-95 border-none"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    eksekusi lelaran seidel
                    <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 group-hover:scale-125 transition-transform" />
                  </>
                )}
              </Button>
            </Card>

            {/* INFO PANEL */}
            <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-xl bg-[#080808] text-white flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6 text-emerald-400 lowercase">
                  mekanisme update.
                </h3>
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    seidel menggunakan nilai{" "}
                    <span className="text-white font-bold">x⁽ᵏ⁺¹⁾</span> yang
                    baru dihitung untuk mencari{" "}
                    <span className="text-white font-bold">y⁽ᵏ⁺¹⁾</span> pada
                    iterasi yang sama.
                  </p>
                  <div className="h-[1px] w-full bg-white/5"></div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    target solusi sejati:
                  </p>
                  <div className="flex gap-2">
                    {["2", "4", "3"].map((n) => (
                      <div
                        key={n}
                        className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 font-mono text-emerald-400 font-bold"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary hasil — muncul setelah ada data */}
              <AnimatePresence>
                {lastIter && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 pt-5 border-t border-white/10 relative z-10 space-y-3"
                  >
                    <p className="text-[9px] text-gray-500 tracking-widest uppercase font-bold mb-2">
                      hasil iterasi ke-{lastIter.iterasi}:
                    </p>
                    {[
                      { label: "x", val: lastIter.x },
                      { label: "y", val: lastIter.y },
                      { label: "z", val: lastIter.z },
                    ].map(({ label, val }) => (
                      <div
                        key={label}
                        className="flex justify-between items-center"
                      >
                        <span className="text-[10px] text-gray-400 font-mono">
                          {label} =
                        </span>
                        <span className="text-sm font-mono font-bold text-emerald-400">
                          {val.toFixed(6)}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${isConverged ? "text-emerald-400" : "text-gray-600"}`}
                      />
                      <span
                        className={`text-[10px] font-bold tracking-wide ${
                          isConverged ? "text-emerald-400" : "text-gray-500"
                        }`}
                      >
                        {isConverged ? "konvergen ✓" : "belum konvergen"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-emerald-500/10 blur-[90px] rounded-full"></div>
            </Card>
          </div>

          {/* TABEL HASIL ITERASI */}
          <section className="mt-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold tracking-tighter">
                  tabel konvergensi seidel.
                </h2>
              </div>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
              {/* Badge jumlah lelaran */}
              {iterations.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold tracking-widest rounded-full uppercase"
                >
                  {iterations.length - 1} lelaran
                </motion.span>
              )}
            </div>

            <Card className="rounded-[40px] border-none shadow-xl overflow-hidden bg-white">
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-gray-50/80 sticky top-0 backdrop-blur-md">
                    <TableRow className="border-none">
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest py-6">
                        iterasi
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest py-6">
                        x
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest py-6">
                        y
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest py-6">
                        z
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest py-6 text-emerald-600">
                        galat x
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest py-6 text-emerald-600">
                        galat y
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest py-6 text-emerald-600">
                        galat z
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {iterations.length > 0 ? (
                        iterations.map((row, idx) => (
                          <motion.tr
                            key={row.iterasi}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-gray-50 hover:bg-emerald-50/20 transition-all duration-300"
                          >
                            <TableCell className="text-center font-bold text-gray-300">
                              {row.iterasi}
                            </TableCell>
                            <TableCell className="text-center font-mono font-bold text-black">
                              {row.x.toFixed(6)}
                            </TableCell>
                            <TableCell className="text-center font-mono font-bold text-black">
                              {row.y.toFixed(6)}
                            </TableCell>
                            <TableCell className="text-center font-mono font-bold text-black">
                              {row.z.toFixed(6)}
                            </TableCell>
                            {[
                              { val: row.galatX },
                              { val: row.galatY },
                              { val: row.galatZ },
                            ].map((g, i) => {
                              const label = galatLabel(g.val, row.iterasi);
                              return (
                                <TableCell key={i} className="text-center">
                                  {label && (
                                    <span
                                      className={`text-[9px] font-black px-3 py-1 rounded-full ${
                                        label === "TRUE"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-gray-100 text-gray-400"
                                      }`}
                                    >
                                      {label}
                                    </span>
                                  )}
                                </TableCell>
                              );
                            })}
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-20 text-gray-400 italic"
                          >
                            klik tombol di atas untuk melihat proses lelaran...
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GaussSeidelPage;
