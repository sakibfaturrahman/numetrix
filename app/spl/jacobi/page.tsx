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
  Play,
  Activity,
  ListOrdered,
  HelpCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface JacobiIteration {
  iterasi: number;
  x: number;
  y: number;
  z: number;
  galatX: number;
  galatY: number;
  galatZ: number;
  isConvergedX: boolean;
  isConvergedY: boolean;
  isConvergedZ: boolean;
}

const JacobiPage = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iterations, setIterations] = useState<JacobiIteration[]>([]);
  const [decimals, setDecimals] = useState<number>(6);

  // State inisialisasi dikosongkan secara murni untuk menyambut soal baru secara manual
  const [matrixA, setMatrixA] = useState<(string | number)[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [vectorB, setVectorB] = useState<(string | number)[]>(["", "", ""]);
  const [initialGuess, setInitialGuess] = useState<{
    [key: string]: string | number;
  }>({
    x: "",
    y: "",
    z: "",
  });

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hasSeenJacobiGuide");
    if (!hasSeenGuide) setShowGuide(true);
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hasSeenJacobiGuide", "true");
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

  const handleGuessChange = (axis: string, value: string) => {
    setInitialGuess({ ...initialGuess, [axis]: value });
  };

  // Fungsi CTA untuk auto fill data contoh dari soal ujian agar mempermudah pengujian berulang
  const loadExampleData = () => {
    setMatrixA([
      [4, -1, -1],
      [-2, 6, 1],
      [1, -1, 5],
    ]);
    setVectorB([3, 9, -6]);
    setInitialGuess({ x: 0, y: 0, z: 0 });
    setIterations([]);
    setError(null);
  };

  const lastIter =
    iterations.length > 0 ? iterations[iterations.length - 1] : null;

  const isConverged =
    lastIter !== null &&
    lastIter.isConvergedX &&
    lastIter.isConvergedY &&
    lastIter.isConvergedZ;

  const generateFormulaText = (index: number, variableName: string) => {
    const diagVal = parseFloat(matrixA[index][index]?.toString());
    if (isNaN(diagVal) || diagVal === 0) return `${variableName} = ...`;

    const bVal = parseFloat(vectorB[index]?.toString()) || 0;
    const vars = ["x", "y", "z"];
    let parts: string[] = [];

    parts.push(bVal.toString());

    vars.forEach((v, j) => {
      if (j !== index) {
        const coef = parseFloat(matrixA[index][j]?.toString()) || 0;
        if (coef > 0) {
          parts.push(`- ${coef === 1 ? "" : coef}${v}`);
        } else if (coef < 0) {
          parts.push(`+ ${Math.abs(coef) === 1 ? "" : Math.abs(coef)}${v}`);
        }
      }
    });

    return `${variableName} = (${parts.join(" ")}) / ${diagVal}`;
  };

  const calculateJacobi = async () => {
    // Validasi input kosong sebelum melakukan pengiriman payload ke server API
    const isMatrixEmpty = matrixA.some((row) => row.some((val) => val === ""));
    const isVectorEmpty = vectorB.some((val) => val === "");
    const isGuessEmpty = ["x", "y", "z"].some(
      (axis) => initialGuess[axis] === "",
    );

    if (isMatrixEmpty || isVectorEmpty || isGuessEmpty) {
      setError(
        "mohon isi semua kolom matriks koefisien, vektor konstanta, dan tebakan awal.",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setIterations([]);

    const parsedMatrixA = matrixA.map((row) =>
      row.map((val) => (val === "" ? 0 : parseFloat(val.toString()) || 0)),
    );
    const parsedVectorB = vectorB.map((val) =>
      val === "" ? 0 : parseFloat(val.toString()) || 0,
    );
    const parsedGuess = ["x", "y", "z"].map((axis) =>
      initialGuess[axis] === ""
        ? 0
        : parseFloat(initialGuess[axis].toString()) || 0,
    );

    try {
      const response = await fetch("/api/spl/jacobi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matrixA: parsedMatrixA,
          vectorB: parsedVectorB,
          initialGuess: parsedGuess,
          maxIter: 50,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "gagal melakukan lelaran jacobi.");
        return;
      }

      setIterations(data);
    } catch {
      setError("terputus dari server. pastikan api berjalan dengan aman.");
    } finally {
      setLoading(false);
    }
  };

  const resetInput = () => {
    setMatrixA([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setVectorB(["", "", ""]);
    setInitialGuess({ x: "", y: "", z: "" });
    setIterations([]);
    setError(null);
  };

  return (
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900 lowercase">
      <Navbar />

      <GuideModal
        isOpen={showGuide}
        onOpenChange={setShowGuide}
        title="panduan lelaran jacobi"
        description="pahami mekanisme iterasi simultan sebelum menjalankan simulasi."
        theoryOverview="nilai variabel baru dihitung berdasarkan nilai variabel dari iterasi sebelumnya secara serentak. proses berhenti jika galat lebih kecil dari toleransi."
        steps={[
          "masukkan koefisien pada matriks A dan elemen konstanta pada vektor b.",
          "isi nilai tebakan awal (p₀) untuk memulai lelaran pertama.",
          "klik 'mulai lelaran' untuk melihat proses konvergensi dinamis pada tabel.",
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
          <section className="bg-white rounded-[40px] md:rounded-[50px] p-8 md:p-16 border border-gray-100 shadow-2xl mb-8 overflow-hidden">
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
                  simultan pada setiap langkah hingga mencapai konvergensi
                  murni.
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* INPUT PERSAMAAN & TEBAKAN AWAL DINAMIS */}
            <Card className="lg:col-span-2 p-8 md:p-12 rounded-[40px] border-none shadow-xl bg-white flex flex-col gap-10">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    persamaan lelaran.
                  </h2>
                  <p className="text-xs text-gray-400">
                    transformasi matriks [A] ke fungsi lelaran numerik secara
                    otomatis.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* BUTTON CTA DINAMIS UNTUK AUTO-FILL CONTOH SOAL */}
                  <Button
                    onClick={loadExampleData}
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border-orange-200 bg-orange-50/50 text-orange-600 hover:bg-orange-100/60 hover:text-orange-700 transition-all px-3.5 py-2"
                  >
                    <Sparkles className="w-3 h-3" />
                    isi soal ujian
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetInput}
                    className="rounded-full hover:bg-red-50 group"
                  >
                    <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {/* RUMUS OTOMATIS BERDASARKAN INPUT GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-300 uppercase block mb-2 tracking-widest text-center">
                      fungsi x
                    </span>
                    <p className="font-mono text-xs text-center tracking-tighter font-bold text-orange-600 truncate">
                      {generateFormulaText(0, "x")}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-300 uppercase block mb-2 tracking-widest text-center">
                      fungsi y
                    </span>
                    <p className="font-mono text-xs text-center tracking-tighter font-bold text-orange-600 truncate">
                      {generateFormulaText(1, "y")}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-300 uppercase block mb-2 tracking-widest text-center">
                      fungsi z
                    </span>
                    <p className="font-mono text-xs text-center tracking-tighter font-bold text-orange-600 truncate">
                      {generateFormulaText(2, "z")}
                    </p>
                  </div>
                </div>

                {/* MATRIX GRID INPUT DUAL VERTIKAL */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-6">
                  <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-[30px] border border-gray-100 relative">
                    <span className="absolute -top-6 left-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest font-sans">
                      matriks a
                    </span>
                    {matrixA.map((row, r) =>
                      row.map((val, c) => (
                        <Input
                          key={`a-${r}-${c}`}
                          type="number"
                          value={val}
                          onChange={(e) => handleAChange(r, c, e.target.value)}
                          className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white focus-visible:ring-orange-500"
                        />
                      )),
                    )}
                  </div>

                  <div className="h-40 w-[2px] bg-gray-100 hidden md:block" />

                  <div className="flex flex-col gap-3 p-4 bg-orange-50/30 rounded-[30px] border border-orange-100 relative">
                    <span className="absolute -top-6 left-2 text-[10px] font-bold text-orange-400 uppercase tracking-widest font-sans">
                      vektor b
                    </span>
                    {vectorB.map((val, r) => (
                      <Input
                        key={`b-${r}`}
                        type="number"
                        value={val}
                        onChange={(e) => handleBChange(r, e.target.value)}
                        className="w-16 h-16 md:w-20 md:h-20 text-center text-lg font-bold rounded-2xl border-none shadow-sm bg-white text-orange-600 focus-visible:ring-orange-500"
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="text-xs font-bold uppercase mb-4 tracking-wider text-gray-400">
                    tebakan awal (p₀):
                  </h3>
                  <div className="flex gap-4">
                    {["x", "y", "z"].map((axis) => (
                      <div key={axis} className="flex-1">
                        <Input
                          type="number"
                          placeholder={`${axis}₀`}
                          className="rounded-xl border-none bg-gray-50 text-center font-bold focus-visible:ring-orange-500"
                          value={initialGuess[axis]}
                          onChange={(e) =>
                            handleGuessChange(axis, e.target.value)
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
                className="w-full py-8 bg-black text-white rounded-[25px] text-xs font-bold uppercase tracking-[0.2em] hover:bg-orange-700 transition-all flex gap-3 group border-none"
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
            <Card className="p-8 md:p-10 rounded-[40px] border border-orange-100/80 shadow-xl bg-orange-50/60 text-zinc-800 flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold mb-4 text-orange-700">
                  syarat konvergensi.
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed italic">
                  agar lelaran mencapai solusi sejati, pengujian selisih nilai
                  mutlak tiap variabel dihitung ketat terhadap batas epsilon.
                </p>
              </div>

              <AnimatePresence>
                {lastIter && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 pt-5 border-t border-orange-200/60 relative z-10 space-y-3"
                  >
                    <p className="text-[9px] text-zinc-400 tracking-widest uppercase font-bold mb-2">
                      hasil akhir lelaran ke-{lastIter.iterasi}:
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
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {label} =
                        </span>
                        <span className="text-sm font-mono font-bold text-orange-700">
                          {val.toFixed(decimals)}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${isConverged ? "text-green-600" : "text-zinc-400"}`}
                      />
                      <span
                        className={`text-[10px] font-bold tracking-wide ${isConverged ? "text-green-600" : "text-zinc-500"}`}
                      >
                        {isConverged ? "status konvergen ✓" : "belum konvergen"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 pt-6 border-t border-orange-200/40 relative z-10">
                <p className="text-[9px] text-zinc-400 mb-4 tracking-widest uppercase font-bold">
                  toleransi galat murni (e):
                </p>
                <span className="text-lg font-mono font-bold text-orange-700 tracking-tighter">
                  0.000000001 (1e-9)
                </span>
              </div>
              <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-orange-500/10 blur-[90px] rounded-full"></div>
            </Card>
          </div>

          {/* TABEL ITERASI */}
          <section className="mt-12">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-black" />
                <h2 className="text-xl font-bold tracking-tighter">
                  tabel lelaran numerik.
                </h2>
              </div>
              <div className="h-[1px] flex-1 bg-gray-200 hidden md:block"></div>
              <div className="flex items-center gap-3">
                <DecimalControl decimals={decimals} setDecimals={setDecimals} />
                {iterations.length > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2 bg-black text-white text-[10px] font-bold tracking-widest rounded-full uppercase shrink-0"
                  >
                    {iterations.length - 1} lelaran selesai
                  </motion.span>
                )}
              </div>
            </div>

            <Card className="rounded-[35px] border-none shadow-xl overflow-hidden bg-white">
              <div className="max-h-[650px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-gray-50/80 sticky top-0 backdrop-blur-md z-20">
                    <TableRow className="border-none">
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-wider py-5">
                        iterasi
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-wider py-5">
                        x
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-wider py-5">
                        y
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-wider py-5">
                        z
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-wider py-5 text-orange-600">
                        galat x
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-wider py-5 text-orange-600">
                        galat y
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-wider py-5 text-orange-600">
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
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="hover:bg-orange-50/20 border-b border-gray-50 transition-colors"
                          >
                            <TableCell className="text-center font-bold text-gray-400 py-3.5">
                              {row.iterasi}
                            </TableCell>
                            <TableCell className="text-center font-mono font-bold text-sm py-3.5 text-black">
                              {row.x.toFixed(decimals)}
                            </TableCell>
                            <TableCell className="text-center font-mono font-bold text-sm py-3.5 text-black">
                              {row.y.toFixed(decimals)}
                            </TableCell>
                            <TableCell className="text-center font-mono font-bold text-sm py-3.5 text-black">
                              {row.z.toFixed(decimals)}
                            </TableCell>

                            <TableCell className="text-center py-3.5">
                              {row.iterasi === 0 ? (
                                <span className="text-gray-300 font-mono text-[10px] font-bold">
                                  -
                                </span>
                              ) : (
                                <span
                                  className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-md tracking-wider ${
                                    row.isConvergedX
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-50 text-red-500"
                                  }`}
                                >
                                  {row.isConvergedX ? "TRUE" : "FALSE"}
                                </span>
                              )}
                            </TableCell>

                            <TableCell className="text-center py-3.5">
                              {row.iterasi === 0 ? (
                                <span className="text-gray-300 font-mono text-[10px] font-bold">
                                  -
                                </span>
                              ) : (
                                <span
                                  className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-md tracking-wider ${
                                    row.isConvergedY
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-50 text-red-500"
                                  }`}
                                >
                                  {row.isConvergedY ? "TRUE" : "FALSE"}
                                </span>
                              )}
                            </TableCell>

                            <TableCell className="text-center py-3.5">
                              {row.iterasi === 0 ? (
                                <span className="text-gray-300 font-mono text-[10px] font-bold">
                                  -
                                </span>
                              ) : (
                                <span
                                  className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-md tracking-wider ${
                                    row.isConvergedZ
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-50 text-red-500"
                                  }`}
                                >
                                  {row.isConvergedZ ? "TRUE" : "FALSE"}
                                </span>
                              )}
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-24 text-gray-400 italic"
                          >
                            silakan isi koefisien dan tebakan awal di atas atau
                            klik tombol "isi soal ujian" untuk memetakan lelaran
                            jacobi...
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
