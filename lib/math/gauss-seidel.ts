// src/lib/math/gauss-seidel.ts

export interface GaussSeidelIteration {
  iterasi: number;
  x: number;
  y: number;
  z: number;
  galatX: number;
  galatY: number;
  galatZ: number;
}

export function solveGaussSeidel(
  A: number[][],
  b: number[],
  initialGuess: number[],
  tolerance: number = 0.00001,
  maxIter: number = 50,
): GaussSeidelIteration[] {
  let x = [...initialGuess];
  const n = b.length;
  const history: GaussSeidelIteration[] = [];

  // Iterasi 0 — tebakan awal
  history.push({
    iterasi: 0,
    x: x[0],
    y: x[1],
    z: x[2],
    galatX: 0,
    galatY: 0,
    galatZ: 0,
  });

  for (let k = 0; k < maxIter; k++) {
    const xOld = [...x]; // simpan nilai lama untuk hitung galat

    // Perbedaan utama vs Jacobi:
    // Gauss-Seidel langsung pakai nilai BARU (x[j] yang sudah diupdate)
    // dalam iterasi yang sama — bukan menunggu iterasi berikutnya
    for (let i = 0; i < n; i++) {
      let sigma = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          // x[j] di sini sudah ter-update jika j < i (nilai baru)
          // dan masih nilai lama jika j > i — inilah inti Gauss-Seidel
          sigma += A[i][j] * x[j];
        }
      }
      x[i] = (b[i] - sigma) / A[i][i];
    }

    // Hitung galat relatif (%) menggunakan nilai LAMA sebagai pembagi
    const gX = xOld[0] !== 0 ? Math.abs((x[0] - xOld[0]) / xOld[0]) * 100 : 100;
    const gY = xOld[1] !== 0 ? Math.abs((x[1] - xOld[1]) / xOld[1]) * 100 : 100;
    const gZ = xOld[2] !== 0 ? Math.abs((x[2] - xOld[2]) / xOld[2]) * 100 : 100;

    history.push({
      iterasi: k + 1,
      x: x[0],
      y: x[1],
      z: x[2],
      // fallback ke 100 (bukan 0) agar loop tidak berhenti palsu
      galatX: isFinite(gX) ? gX : 100,
      galatY: isFinite(gY) ? gY : 100,
      galatZ: isFinite(gZ) ? gZ : 100,
    });

    // Cek konvergensi — hanya berhenti jika semua galat valid dan di bawah toleransi
    if (
      isFinite(gX) &&
      isFinite(gY) &&
      isFinite(gZ) &&
      Math.max(gX, gY, gZ) < tolerance
    )
      break;
  }

  return history;
}
