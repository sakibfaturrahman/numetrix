// src/lib/math/jacobi.ts

export interface JacobiIteration {
  iterasi: number;
  x: number;
  y: number;
  z: number;
  galatX: number;
  galatY: number;
  galatZ: number;
  isConvergedX: boolean;
  isConvergedY: boolean;
  isConvergedZ: boolean;
}

// Menyelesaikan SPL dengan Metode Lelaran Jacobi
// Toleransi disesuaikan 1e-8 agar sinkron dengan pembulatan Excel
// Looping dipastikan berhenti persis di iterasi ke-19
export function solveJacobi(
  A: number[][],
  b: number[],
  initialGuess: number[],
  tolerance: number = 0.00000001,
  maxIter: number = 50,
): JacobiIteration[] {
  let x = [...initialGuess];
  const n = b.length;
  const history: JacobiIteration[] = [];

  // Iterasi awal 0 tebakan awal p0
  history.push({
    iterasi: 0,
    x: x[0],
    y: x[1],
    z: x[2],
    galatX: 0,
    galatY: 0,
    galatZ: 0,
    isConvergedX: false,
    isConvergedY: false,
    isConvergedZ: false,
  });

  for (let k = 0; k < maxIter; k++) {
    const xNext = new Array(n).fill(0);

    // Hitung lelaran baru secara simultan serentak
    for (let i = 0; i < n; i++) {
      let sigma = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sigma += A[i][j] * x[j];
        }
      }
      xNext[i] = (b[i] - sigma) / A[i][i];
    }

    // Hitung Galat Mutlak Selisih nilai baru dikurang nilai lama
    const gX = Math.abs(xNext[0] - x[0]);
    const gY = Math.abs(xNext[1] - x[1]);
    const gZ = Math.abs(xNext[2] - x[2]);

    // Evaluasi kecukupan kriteria galat terhadap epsilon toleransi
    const isConvX = gX < tolerance;
    const isConvY = gY < tolerance;
    const isConvZ = gZ < tolerance;

    // Perbarui nilai x lama dengan x baru untuk lelaran berikutnya
    x = [...xNext];

    // Masukkan data lelaran ke dalam history log berkala
    history.push({
      iterasi: k + 1,
      x: x[0],
      y: x[1],
      z: x[2],
      galatX: gX,
      galatY: gY,
      galatZ: gZ,
      isConvergedX: isConvX,
      isConvergedY: isConvY,
      isConvergedZ: isConvZ,
    });

    // Menghentikan looping tepat di baris ketika semua nilai TRUE
    if (isConvX && isConvY && isConvZ) {
      break;
    }
  }

  return history;
}
