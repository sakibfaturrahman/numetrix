// src/app/api/spl/jacobi/route.ts

import { NextResponse } from "next/server";
import { solveJacobi } from "@/lib/math/jacobi";

export async function POST(req: Request) {
  try {
    const { matrixA, vectorB, initialGuess, maxIter } = await req.json();

    // Validasi data dasar
    if (!matrixA || !vectorB) {
      return NextResponse.json(
        {
          error: "data tidak lengkap. mohon isi matriks koefisien dan hasil b.",
        },
        { status: 400 },
      );
    }

    // Validasi Diagonal Dominan sebagai log penanda komputasi numerik
    for (let i = 0; i < matrixA.length; i++) {
      const diag = Math.abs(matrixA[i][i]);
      const sum = matrixA[i].reduce(
        (acc: number, val: number, j: number) =>
          i !== j ? acc + Math.abs(val) : acc,
        0,
      );

      if (diag <= sum) {
        console.warn(
          `baris ${i + 1} tidak dominan secara diagonal, lelaran berisiko divergen.`,
        );
      }
    }

    // Putus hubungan referensi data objek dari frontend menggunakan deep clone
    const cleanMatrixA = JSON.parse(JSON.stringify(matrixA));
    const cleanVectorB = JSON.parse(JSON.stringify(vectorB));
    const cleanGuess = JSON.parse(JSON.stringify(initialGuess || [1, 2, 2]));

    // Gunakan parameter toleransi 1e-9 murni agar sinkron dengan batasan kriteria lelaran
    const history = solveJacobi(
      cleanMatrixA,
      cleanVectorB,
      cleanGuess,
      0.000000001,
      maxIter || 50,
    );

    return NextResponse.json(history);
  } catch {
    return NextResponse.json(
      { error: "terjadi kesalahan dalam pemrosesan iterasi lelaran jacobi." },
      { status: 500 },
    );
  }
}
