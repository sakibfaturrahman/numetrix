// src/app/api/matriks/dekomposisi/route.ts

import { NextResponse } from "next/server";
import { solveLUDecomposition } from "@/lib/math/dekomposisi";

export async function POST(req: Request) {
  try {
    const { matrixA, vectorB } = await req.json();

    // Validasi input
    if (!matrixA || !vectorB || matrixA.length !== vectorB.length) {
      return NextResponse.json(
        { error: "format matriks atau vektor tidak valid" },
        { status: 400 },
      );
    }

    // Cek apakah ada elemen diagonal yang nol (pivot)
    for (let i = 0; i < matrixA.length; i++) {
      if (matrixA[i][i] === 0) {
        return NextResponse.json(
          { error: "elemen diagonal (pivot) tidak boleh nol untuk metode ini" },
          { status: 400 },
        );
      }
    }

    const result = solveLUDecomposition(matrixA, vectorB);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("LU Decomposition Error:", error);
    return NextResponse.json(
      { error: "terjadi kesalahan dalam perhitungan dekomposisi" },
      { status: 500 },
    );
  }
}
