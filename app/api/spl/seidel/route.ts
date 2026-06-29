// src/app/api/spl/seidel/route.ts

import { NextResponse } from "next/server";
import { solveGaussSeidel } from "@/lib/math/gauss-seidel";

export async function POST(req: Request) {
  try {
    const { matrixA, vectorB, initialGuess, maxIter } = await req.json();

    // Validasi data masuk
    if (!matrixA || !vectorB) {
      return NextResponse.json(
        {
          error: "data tidak lengkap. mohon isi matriks koefisien dan hasil b.",
        },
        { status: 400 },
      );
    }

    // Putus referensi objek murni melalui deep clone
    const cleanMatrixA = JSON.parse(JSON.stringify(matrixA));
    const cleanVectorB = JSON.parse(JSON.stringify(vectorB));
    const cleanGuess = JSON.parse(JSON.stringify(initialGuess || [1, 2, 2]));

    // Eksekusi fungsi Gauss-Seidel dengan toleransi mutlak 1e-6
    const history = solveGaussSeidel(
      cleanMatrixA,
      cleanVectorB,
      cleanGuess,
      0.000001,
      maxIter || 50,
    );

    return NextResponse.json(history);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "terjadi kesalahan dalam pemrosesan gauss-seidel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
