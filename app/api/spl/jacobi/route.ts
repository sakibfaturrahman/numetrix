// src/app/api/spl/jacobi/route.ts

import { NextResponse } from "next/server";
import { solveJacobi } from "@/lib/math/jacobi";

export async function POST(req: Request) {
  try {
    const { matrixA, vectorB, initialGuess, maxIter } = await req.json();

    // Validasi Diagonal Dominan (Opsional tapi disarankan untuk Jacobi)
    for (let i = 0; i < matrixA.length; i++) {
      let diag = Math.abs(matrixA[i][i]);
      let sum = matrixA[i].reduce(
        (acc: number, val: number, j: number) =>
          i !== j ? acc + Math.abs(val) : acc,
        0,
      );

      if (diag <= sum) {
        console.warn(
          `Baris ${i + 1} tidak dominan secara diagonal, hasil mungkin divergen.`,
        );
      }
    }

    const history = solveJacobi(
      matrixA,
      vectorB,
      initialGuess || [0, 0, 0],
      0.00001,
      maxIter || 20,
    );

    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json(
      { error: "terjadi kesalahan dalam iterasi jacobi" },
      { status: 500 },
    );
  }
}
