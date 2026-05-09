// src/app/api/spl/gauss-seidel/route.ts

import { NextResponse } from "next/server";
import { solveGaussSeidel } from "@/lib/math/gauss-seidel";

export async function POST(req: Request) {
  try {
    const { matrixA, vectorB, initialGuess, maxIter } = await req.json();

    // Validasi input dasar
    if (!matrixA || !vectorB) {
      return NextResponse.json(
        { error: "matrixA dan vectorB wajib diisi." },
        { status: 400 },
      );
    }

    if (matrixA.length !== vectorB.length) {
      return NextResponse.json(
        { error: "Dimensi matrixA dan vectorB tidak sesuai." },
        { status: 400 },
      );
    }

    // Validasi diagonal dominan (disarankan untuk konvergensi Gauss-Seidel)
    for (let i = 0; i < matrixA.length; i++) {
      const diag = Math.abs(matrixA[i][i]);
      const sum = matrixA[i].reduce(
        (acc: number, val: number, j: number) =>
          i !== j ? acc + Math.abs(val) : acc,
        0,
      );

      if (diag <= sum) {
        console.warn(
          `Baris ${i + 1} tidak dominan secara diagonal — hasil mungkin divergen.`,
        );
      }
    }

    const history = solveGaussSeidel(
      matrixA,
      vectorB,
      initialGuess || new Array(vectorB.length).fill(0),
      0.00001,
      maxIter || 20,
    );

    return NextResponse.json(history);
  } catch (error: unknown) {
    console.error("Gauss-Seidel error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan dalam iterasi Gauss-Seidel." },
      { status: 500 },
    );
  }
}
