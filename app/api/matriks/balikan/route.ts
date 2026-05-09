// src/app/api/matriks/balikan/route.ts
import { NextResponse } from "next/server";
import { solveInverseGaussJordan } from "@/lib/math/balikan";

export async function POST(req: Request) {
  try {
    const { matrixA, vectorB } = await req.json();

    if (!matrixA || !vectorB) {
      return NextResponse.json(
        { error: "data tidak lengkap" },
        { status: 400 },
      );
    }

    const result = solveInverseGaussJordan(matrixA, vectorB);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
