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
import { RotateCcw, Play, Activity, ListOrdered } from "lucide-react";

const JacobiPage = () => {
  // State untuk nilai awal (P0) sesuai gambar
  const [initialValue, setInitialValue] = useState({ x: 1, y: 2, z: 2 });

  // Data dummy untuk tabel iterasi (meniru gambar hingga 20 baris)
  const iterations = Array.from({ length: 20 }, (_, i) => ({
    iterasi: i,
    x: i === 0 ? initialValue.x : (2).toFixed(2),
    y: i === 0 ? initialValue.y : (4).toFixed(6),
    z: i === 0 ? initialValue.z : (3).toFixed(6),
    galat: i > 16 ? "TRUE" : "FALSE",
  }));

  return (
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900">
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
                  className="rounded-full hover:bg-gray-100"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400" />
                </Button>
              </div>

              {/* Tampilan Fungsi (Read-Only/Manual Input) */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-300 uppercase block mb-2 tracking-widest">
                      fungsi x
                    </span>
                    <p className="font-mono text-sm">x = (7 + y - z) / 4</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-300 uppercase block mb-2 tracking-widest">
                      fungsi y
                    </span>
                    <p className="font-mono text-sm">y = (-21 - 4x - z) / -8</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-300 uppercase block mb-2 tracking-widest">
                      fungsi z
                    </span>
                    <p className="font-mono text-sm">z = (15 + 2x - y) / 5</p>
                  </div>
                </div>

                {/* Tebakan Awal P0 */}
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
                          className="rounded-xl border-none bg-gray-50 text-center font-bold"
                          value={
                            initialValue[axis as keyof typeof initialValue]
                          }
                          onChange={(e) =>
                            setInitialValue({
                              ...initialValue,
                              [axis]: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button className="w-full py-8 bg-black text-white rounded-[25px] text-xs font-bold uppercase tracking-[0.2em] hover:bg-orange-700 transition-all flex gap-3 group">
                mulai lelaran jacobi
                <Play className="w-3 h-3 fill-current group-hover:translate-x-1 transition-transform" />
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
                  <span className="text-white">(2, 4, 3)</span>, matriks
                  koefisien harus dominan secara diagonal.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                <p className="text-[9px] text-gray-500 mb-4 tracking-widest uppercase font-bold">
                  toleransi galat (ε):
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-mono font-bold tracking-tighter">
                    0.00000001
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
                  tabel iterasi (20 lelaran).
                </h2>
              </div>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>

            <Card className="rounded-[35px] border-none shadow-xl overflow-hidden bg-white">
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50 sticky top-0 backdrop-blur-md">
                    <TableRow>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest">
                        iterasi
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest">
                        x
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest">
                        y
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest">
                        z
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest">
                        galat x
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest">
                        galat y
                      </TableHead>
                      <TableHead className="text-center font-bold text-[10px] uppercase tracking-widest">
                        galat z
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {iterations.map((row) => (
                      <TableRow
                        key={row.iterasi}
                        className="hover:bg-orange-50/30 transition-colors"
                      >
                        <TableCell className="text-center font-bold text-gray-300">
                          {row.iterasi}
                        </TableCell>
                        <TableCell className="text-center font-mono font-semibold">
                          {row.x}
                        </TableCell>
                        <TableCell className="text-center font-mono font-semibold">
                          {row.y}
                        </TableCell>
                        <TableCell className="text-center font-mono font-semibold">
                          {row.z}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${row.galat === "TRUE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                          >
                            {row.galat}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${row.galat === "TRUE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                          >
                            {row.galat}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${row.galat === "TRUE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                          >
                            {row.galat}
                          </span>
                        </TableCell>
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

export default JacobiPage;
