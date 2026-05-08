import { NextResponse } from "next/server";
import { solveMatrixInverse } from "@/lib/math/balikan";

export async function POST(req: Request) {
  const { matrixA, vectorB } = await req.json();

  try {
    const result = solveMatrixInverse(matrixA, vectorB);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Matriks tidak memiliki balikan (Singular)" },
      { status: 400 },
    );
  }
}
