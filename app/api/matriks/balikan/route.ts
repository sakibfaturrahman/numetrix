// src/app/api/matriks/balikan/route.ts
import { NextResponse } from "next/server";
import { solveInverseGaussJordan } from "@/lib/math/balikan";

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

    // Validasi dimensi matriks harus nxn dan vektor harus panjang n
    const n = matrixA.length;
    if (
      !Array.isArray(matrixA) ||
      !Array.isArray(vectorB) ||
      vectorB.length !== n ||
      matrixA.some((row: unknown) => !Array.isArray(row) || row.length !== n)
    ) {
      return NextResponse.json(
        {
          error:
            "dimensi tidak valid. matriks a harus n×n dan vektor b harus berukuran n.",
        },
        { status: 400 },
      );
    }

    // Validasi semua nilai adalah angka aman dari typescript strict check
    const allNumbers =
      matrixA.every((row: number[]) =>
        row.every((v: unknown) => typeof v === "number" && !Number.isNaN(v)),
      ) &&
      vectorB.every((v: unknown) => typeof v === "number" && !Number.isNaN(v));

    if (!allNumbers) {
      return NextResponse.json(
        { error: "semua nilai harus berupa angka yang valid." },
        { status: 400 },
      );
    }

    // Putus referensi memori dengan deep clone objek input murni
    const cleanMatrixA = JSON.parse(JSON.stringify(matrixA));
    const cleanVectorB = JSON.parse(JSON.stringify(vectorB));

    // Eksekusi fungsi matematika balikan yang sudah diperbaiki
    const result = solveInverseGaussJordan(cleanMatrixA, cleanVectorB);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "terjadi kesalahan tak terduga.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
