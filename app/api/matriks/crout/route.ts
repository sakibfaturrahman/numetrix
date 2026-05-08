// app/api/matriks/crout/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Placeholder untuk logic Crout nanti
    return NextResponse.json({
      message: "API Crout ready",
      receivedData: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
