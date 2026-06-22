// src/lib/math/jacobi.ts

export interface JacobiIteration {
  iterasi: number;
  x: number;
  y: number;
  z: number;
  galatX: number;
  galatY: number;
  galatZ: number;
}

export function solveJacobi(
  A: number[][],
  b: number[],
  initialGuess: number[],
  tolerance: number = 0.0001,
  maxIter: number = 50,
) {
  let x = [...initialGuess];
  const n = b.length;
  const history: JacobiIteration[] = [];

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
    const xNext = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      let sigma = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sigma += A[i][j] * x[j];
        }
      }
      xNext[i] = (b[i] - sigma) / A[i][i];
    }

  
    const gX = x[0] !== 0 ? Math.abs((xNext[0] - x[0]) / x[0]) * 100 : 100;
    const gY = x[1] !== 0 ? Math.abs((xNext[1] - x[1]) / x[1]) * 100 : 100;
    const gZ = x[2] !== 0 ? Math.abs((xNext[2] - x[2]) / x[2]) * 100 : 100;

    x = [...xNext];

    history.push({
      iterasi: k + 1,
      x: x[0],
      y: x[1],
      z: x[2],
      galatX: isFinite(gX) ? gX : 100,
      galatY: isFinite(gY) ? gY : 100,
      galatZ: isFinite(gZ) ? gZ : 100,
    });

    // Cek konvergensi (berhenti jika galat sudah di bawah toleransi)
    if (Math.max(gX, gY, gZ) < tolerance) break;
  }

  return history;
}
