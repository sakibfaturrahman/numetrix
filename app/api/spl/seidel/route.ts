// src/app/api/spl/gauss-seidel/route.ts

import { NextResponse } from "next/server";
import { solveGaussSeidel } from "@/lib/math/gauss-seidel";

export async function POST(req: Request) {
  try {
    const { matrixA, vectorB, initialGuess, maxIter } = await req.json();

    // 1. Validasi data masuk
    if (!matrixA || !vectorB) {
      return NextResponse.json(
        {
          error: "data tidak lengkap. mohon isi matriks koefisien dan hasil b.",
        },
        { status: 400 },
      );
    }

    // 2. Eksekusi fungsi Gauss-Seidel
    // Menggunakan toleransi 0.000001 (1e-6) agar pas berhenti di iterasi 10 (indeks 11) sesuai excel
    const history = solveGaussSeidel(
      matrixA,
      vectorB,
      initialGuess || [0, 0, 0],
      0.000001,
      maxIter || 30,
    );

    // 3. Kembalikan data dalam bentuk JSON array untuk dirender tabel
    return NextResponse.json(history);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "terjadi kesalahan dalam pemrosesan gauss-seidel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
