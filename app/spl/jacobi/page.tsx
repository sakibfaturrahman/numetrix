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
import {
  RotateCcw,
  Play,
  Activity,
  ListOrdered,
  HelpCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface JacobiIteration {
  iterasi: number;
  x: number;
  y: number;
  z: number;
  galatX: number;
  galatY: number;
  galatZ: number;
}

const JacobiPage = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iterations, setIterations] = useState<JacobiIteration[]>([]);

  // State Input untuk Tebakan Awal — default 0,0,0
  const [initialGuess, setInitialGuess] = useState({ x: 0, y: 0, z: 0 });

  // Matriks Konstan
  const matrixA = [
    [4, -1, 1],
    [4, -8, 1],
    [-2, 1, 5],
  ];
  const vectorB = [7, -21, 15];

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hasSeenJacobiGuide");
    if (!hasSeenGuide) setShowGuide(true);
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hasSeenJacobiGuide", "true");
  };

  // Ambil data iterasi terakhir untuk summary
  const lastIter =
    iterations.length > 0 ? iterations[iterations.length - 1] : null;
  const isConverged =
    lastIter !== null &&
    lastIter.galatX < 0.001 &&
    lastIter.galatY < 0.001 &&
    lastIter.galatZ < 0.001;

  // Fungsi Fetch ke Backend API
  const calculateJacobi = async () => {
    setLoading(true);
    setError(null);
    setIterations([]);
    try {
      const response = await fetch("/api/spl/jacobi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matrixA,
          vectorB,
          initialGuess: [initialGuess.x, initialGuess.y, initialGuess.z],
          maxIter: 20,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal melakukan lelaran Jacobi.");
        return;
      }

      setIterations(data);
    } catch (err) {
      setError("Terputus dari server. Pastikan API berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const resetInput = () => {
    setInitialGuess({ x: 0, y: 0, z: 0 });
    setIterations([]);
    setError(null);
  };

  return (
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900">
      <Navbar />

      <GuideModal
        isOpen={showGuide}
        onOpenChange={setShowGuide}
        title="panduan lelaran jacobi"
        description="pahami mekanisme iterasi simultan sebelum menjalankan simulasi."
        theoryOverview="nilai variabel baru dihitung berdasarkan nilai variabel dari iterasi sebelumnya secara serentak. proses berhenti jika galat lebih kecil dari toleransi."
        steps={[
          "masukkan tebakan awal (p₀) untuk memulai lelaran pertama.",
          "perhatikan fungsi lelaran yang telah disederhanakan dari persamaan spl asli.",
          "klik 'mulai lelaran' untuk melihat proses konvergensi pada tabel.",
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
                  className="px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-bold tracking-[0.2em] rounded-full uppercase mb-6 inline-block"
                >
                  metode lelaran jacobi
                </motion.span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black leading-tight mb-6">
                  pendekatan <span className="text-gray-300">iteratif</span>{" "}
                  <br /> untuk solusi spl.
                </h1>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  selesaikan sistem persamaan linear dengan teknik lelaran
                  (iterasi). metode ini memperbarui nilai variabel secara
                  simultan pada setiap langkah hingga mencapai konvergensi.
                </p>
              </div>

              <motion.div className="w-full md:w-[350px] flex justify-center items-center">
                <div className="relative w-full aspect-square">
                  <Image
                    src="/images/Mathematics-cuate.svg"
                    alt="Jacobi Iteration Illustration"
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lowercase">
            {/* INPUT PERSAMAAN & TEBAKAN AWAL */}
            <Card className="lg:col-span-2 p-8 md:p-12 rounded-[40px] border-none shadow-xl bg-white flex flex-col gap-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    persamaan lelaran.
                  </h2>
                  <p className="text-xs text-gray-400">
                    masukkan fungsi x, y, dan z untuk iterasi.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetInput}
                  className="rounded-full hover:bg-red-50 group"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-300 uppercase block mb-2 tracking-widest text-center">
                      fungsi x
                    </span>
                    <p className="font-mono text-sm text-center tracking-tighter">
                      x = (7 + y - z) / 4
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-300 uppercase block mb-2 tracking-widest text-center">
                      fungsi y
                    </span>
                    <p className="font-mono text-sm text-center tracking-tighter">
                      y = (-21 - 4x - z) / -8
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-300 uppercase block mb-2 tracking-widest text-center">
                      fungsi z
                    </span>
                    <p className="font-mono text-sm text-center tracking-tighter">
                      z = (15 + 2x - y) / 5
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="text-sm font-bold mb-4 tracking-tighter italic">
                    tebakan awal (p₀):
                  </h3>
                  <div className="flex gap-4">
                    {["x", "y", "z"].map((axis) => (
                      <div key={axis} className="flex-1">
                        <Input
                          type="number"
                          placeholder={`${axis}₀`}
                          className="rounded-xl border-none bg-gray-50 text-center font-bold focus-visible:ring-orange-500"
                          value={
                            initialGuess[axis as keyof typeof initialGuess]
                          }
                          onChange={(e) =>
                            setInitialGuess({
                              ...initialGuess,
                              [axis]: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={calculateJacobi}
                disabled={loading}
                className="w-full py-8 bg-black text-white rounded-[25px] text-xs font-bold uppercase tracking-[0.2em] hover:bg-orange-700 transition-all flex gap-3 group"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    mulai lelaran jacobi
                    <Play className="w-3 h-3 fill-current group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </Card>

            {/* INFO PANEL KONVERGENSI */}
            <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-xl bg-[#0d0d0d] text-white flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold mb-4 text-orange-400">
                  syarat konvergensi.
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  agar lelaran jacobi mencapai solusi sejati{" "}
                  <span className="text-white font-bold">(2, 4, 3)</span>,
                  matriks koefisien harus dominan secara diagonal.
                </p>
              </div>

              {/* Summary hasil iterasi — tampil setelah ada data */}
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
                        <span className="text-sm font-mono font-bold text-orange-400">
                          {val.toFixed(6)}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${isConverged ? "text-green-400" : "text-gray-600"}`}
                      />
                      <span
                        className={`text-[10px] font-bold tracking-wide ${
                          isConverged ? "text-green-400" : "text-gray-500"
                        }`}
                      >
                        {isConverged ? "konvergen ✓" : "belum konvergen"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                <p className="text-[9px] text-gray-500 mb-4 tracking-widest uppercase font-bold">
                  toleransi galat (ε):
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-mono font-bold tracking-tighter text-orange-400">
                    0.00001
                  </span>
                </div>
              </div>
              <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-orange-500/10 blur-[90px] rounded-full"></div>
            </Card>
          </div>

          {/* TABEL ITERASI */}
          <section className="mt-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-black" />
                <h2 className="text-xl font-bold tracking-tighter lowercase">
                  tabel iterasi.
                </h2>
              </div>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
              {/* Badge jumlah iterasi */}
              {iterations.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 bg-black text-white text-[10px] font-bold tracking-widest rounded-full uppercase"
                >
                  {iterations.length - 1} lelaran
                </motion.span>
              )}
            </div>

            <Card className="rounded-[35px] border-none shadow-xl overflow-hidden bg-white">
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50 sticky top-0 backdrop-blur-md z-20">
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
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest py-6">
                        galat x (%)
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest py-6">
                        galat y (%)
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest py-6">
                        galat z (%)
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
                            className="hover:bg-orange-50/30 transition-colors border-b border-gray-50"
                          >
                            <TableCell className="text-center font-bold text-gray-300 py-4">
                              {row.iterasi}
                            </TableCell>
                            <TableCell className="text-center font-mono font-bold py-4 text-black">
                              {row.x.toFixed(6)}
                            </TableCell>
                            <TableCell className="text-center font-mono font-bold py-4 text-black">
                              {row.y.toFixed(6)}
                            </TableCell>
                            <TableCell className="text-center font-mono font-bold py-4 text-black">
                              {row.z.toFixed(6)}
                            </TableCell>
                            <TableCell className="text-center py-4">
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg ${
                                  row.galatX < 0.001
                                    ? "text-green-600 bg-green-50"
                                    : "text-orange-500 bg-orange-50"
                                }`}
                              >
                                {row.galatX.toFixed(4)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-4">
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg ${
                                  row.galatY < 0.001
                                    ? "text-green-600 bg-green-50"
                                    : "text-orange-500 bg-orange-50"
                                }`}
                              >
                                {row.galatY.toFixed(4)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-4">
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg ${
                                  row.galatZ < 0.001
                                    ? "text-green-600 bg-green-50"
                                    : "text-orange-500 bg-orange-50"
                                }`}
                              >
                                {row.galatZ.toFixed(4)}%
                              </span>
                            </TableCell>
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

export default JacobiPage;
