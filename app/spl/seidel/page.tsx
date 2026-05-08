"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
import { RotateCcw, Play, Zap, ListChecks } from "lucide-react";

const GaussSeidelPage = () => {
  // State untuk nilai awal (P0) sesuai gambar
  const [initialValue, setInitialValue] = useState({ x: 1, y: 2, z: 2 });

  // Data simulasi berdasarkan gambar Excel (mencapai konvergensi lebih cepat)
  const iterations = [
    { iter: 0, x: "1.0000", y: "2.0000", z: "2.0000", gx: "", gy: "", gz: "" },
    {
      iter: 1,
      x: "1.7500",
      y: "3.7500",
      z: "2.9500",
      gx: "FALSE",
      gy: "FALSE",
      gz: "FALSE",
    },
    {
      iter: 2,
      x: "1.9500",
      y: "3.9688",
      z: "2.9863",
      gx: "FALSE",
      gy: "FALSE",
      gz: "FALSE",
    },
    {
      iter: 3,
      x: "1.9956",
      y: "3.9961",
      z: "2.9990",
      gx: "FALSE",
      gy: "FALSE",
      gz: "FALSE",
    },
    {
      iter: 4,
      x: "1.9993",
      y: "3.9995",
      z: "2.9998",
      gx: "FALSE",
      gy: "FALSE",
      gz: "FALSE",
    },
    {
      iter: 5,
      x: "1.9999",
      y: "3.9999",
      z: "3.0000",
      gx: "FALSE",
      gy: "FALSE",
      gz: "FALSE",
    },
    {
      iter: 6,
      x: "2.0000",
      y: "4.0000",
      z: "3.0000",
      gx: "FALSE",
      gy: "FALSE",
      gz: "FALSE",
    },
    {
      iter: 7,
      x: "2.0000",
      y: "4.0000",
      z: "3.0000",
      gx: "FALSE",
      gy: "FALSE",
      gz: "FALSE",
    },
    {
      iter: 8,
      x: "2.0000",
      y: "4.0000",
      z: "3.0000",
      gx: "FALSE",
      gy: "FALSE",
      gz: "FALSE",
    },
    {
      iter: 9,
      x: "2.0000",
      y: "4.0000",
      z: "3.0000",
      gx: "FALSE",
      gy: "FALSE",
      gz: "FALSE",
    },
    {
      iter: 10,
      x: "2.0000",
      y: "4.0000",
      z: "3.0000",
      gx: "TRUE",
      gy: "TRUE",
      gz: "TRUE",
    },
    {
      iter: 11,
      x: "2.0000",
      y: "4.0000",
      z: "3.0000",
      gx: "TRUE",
      gy: "TRUE",
      gz: "TRUE",
    },
  ];

  return (
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
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
                    alt="Gauss Seidel Illustration"
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
                  className="rounded-full hover:bg-gray-100"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400" />
                </Button>
              </div>

              {/* Tampilan Rumus Lelaran */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "x", formula: "(7 + y - z) / 4" },
                  { label: "y", formula: "(-21 - 4x - z) / -8" },
                  { label: "z", formula: "(15 + 2x - y) / 5" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col gap-2"
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

              {/* Input Nilai Awal */}
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
                          [axis]: parseFloat(e.target.value),
                        })
                      }
                      className="rounded-2xl border-none bg-gray-50 text-center font-bold text-lg h-14 focus-visible:ring-emerald-500 shadow-inner"
                    />
                  </div>
                ))}
              </div>

              <Button className="w-full py-8 bg-black text-white rounded-[30px] text-xs font-bold uppercase tracking-[0.2em] hover:bg-emerald-800 transition-all flex gap-3 group">
                eksekusi lelaran seidel
                <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 group-hover:scale-125 transition-transform" />
              </Button>
            </Card>

            {/* INFO PANEL KEUNGGULAN */}
            <Card className="p-8 md:p-10 rounded-[40px] border-none shadow-xl bg-[#080808] text-white flex flex-col justify-between overflow-hidden relative lowercase">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6 text-emerald-400">
                  mekanisme update.
                </h3>
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    berbeda dengan jacobi, seidel menggunakan nilai{" "}
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

              <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                    status: optimized
                  </span>
                </div>
              </div>

              <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-emerald-500/10 blur-[90px] rounded-full"></div>
            </Card>
          </div>

          {/* TABEL HASIL */}
          <section className="mt-12 lowercase">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold tracking-tighter">
                  tabel konvergensi seidel.
                </h2>
              </div>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
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
                    {iterations.map((row) => (
                      <TableRow
                        key={row.iter}
                        className="border-gray-50 hover:bg-emerald-50/20 transition-all duration-300"
                      >
                        <TableCell className="text-center font-bold text-gray-300">
                          {row.iter}
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold text-black">
                          {row.x}
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold text-black">
                          {row.y}
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold text-black">
                          {row.z}
                        </TableCell>
                        {[row.gx, row.gy, row.gz].map((g, i) => (
                          <TableCell key={i} className="text-center">
                            {g && (
                              <span
                                className={`text-[9px] font-black px-3 py-1 rounded-full ${g === "TRUE" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}
                              >
                                {g}
                              </span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
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
