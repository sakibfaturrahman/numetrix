// src/app/api/matriks/dekomposisi/route.ts

import { NextResponse } from "next/server";
import { solveLUDecomposition } from "@/lib/math/dekomposisi";

export async function POST(req: Request) {
  try {
    const { matrixA, vectorB } = await req.json();

    // Validasi keberadaan data
    if (!matrixA || !vectorB) {
      return NextResponse.json(
        { error: "data tidak lengkap. mohon isi matriks a dan vektor b." },
        { status: 400 },
      );
    }

    // Validasi dimensi
    const n = matrixA.length;
    if (
      !Array.isArray(matrixA) ||
      !Array.isArray(vectorB) ||
      n < 2 ||
      vectorB.length !== n ||
      matrixA.some((row: unknown[]) => !Array.isArray(row) || row.length !== n)
    ) {
      return NextResponse.json(
        {
          error:
            "dimensi tidak valid. matriks a harus persegi (n×n) dan vektor b harus berukuran n (minimum 2×2).",
        },
        { status: 400 },
      );
    }

    // Validasi elemen numerik angka murni
    const allNumbers =
      matrixA.every((row: number[]) =>
        row.every((v) => typeof v === "number" && isFinite(v)),
      ) && vectorB.every((v: unknown) => typeof v === "number" && isFinite(v));

    if (!allNumbers) {
      return NextResponse.json(
        {
          error:
            "semua nilai harus berupa angka yang valid (bukan NaN atau Infinity).",
        },
        { status: 400 },
      );
    }

    // Deep clone data input agar mutasi array aman di memori backend
    const cleanMatrixA = JSON.parse(JSON.stringify(matrixA));
    const cleanVectorB = JSON.parse(JSON.stringify(vectorB));

    const result = solveLUDecomposition(cleanMatrixA, cleanVectorB);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "terjadi kesalahan tak terduga dalam perhitungan.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
