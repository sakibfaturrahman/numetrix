// src/app/api/matriks/crout/route.ts

import { NextResponse } from "next/server";
import { solveCroutDecomposition } from "@/lib/math/crout";

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

    // Validasi dimensi ukuran array
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
            "dimensi tidak valid. matriks a harus persegi (n×n) dan vektor b harus berukuran n.",
        },
        { status: 400 },
      );
    }

    // Validasi tipe data elemen angka
    const allNumbers =
      matrixA.every((row: number[]) =>
        row.every((v: unknown) => typeof v === "number" && isFinite(v)),
      ) && vectorB.every((v: unknown) => typeof v === "number" && isFinite(v));

    if (!allNumbers) {
      return NextResponse.json(
        { error: "semua nilai harus berupa angka yang valid." },
        { status: 400 },
      );
    }

    // Putus referensi memori objek dari frontend memakai deep clone murni
    const cleanMatrixA = JSON.parse(JSON.stringify(matrixA));
    const cleanVectorB = JSON.parse(JSON.stringify(vectorB));

    // Eksekusi fungsi komputasi matematika crout sekuensial
    const result = solveCroutDecomposition(cleanMatrixA, cleanVectorB);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "terjadi kesalahan tak terduga.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
