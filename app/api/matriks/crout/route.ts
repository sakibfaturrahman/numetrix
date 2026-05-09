import { NextResponse } from "next/server";
import { solveCroutDecomposition } from "@/lib/math/crout";

export async function POST(req: Request) {
  try {
    const { matrixA, vectorB } = await req.json();
    const result = solveCroutDecomposition(matrixA, vectorB);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
