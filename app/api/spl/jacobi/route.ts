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

    // Gunakan parameter toleransi 1e-9 agar tepat berhenti di lelaran ke-19 sesuai excel
    const history = solveJacobi(
      matrixA,
      vectorB,
      initialGuess || [0, 0, 0],
      0.000000001,
      maxIter || 30,
    );

    return NextResponse.json(history);
  } catch {
    return NextResponse.json(
      { error: "terjadi kesalahan dalam pemrosesan iterasi lelaran jacobi." },
      { status: 500 },
    );
  }
}
