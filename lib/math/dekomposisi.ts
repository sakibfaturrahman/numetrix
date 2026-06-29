// src/lib/math/dekomposisi.ts

export interface LUStep {
  label: string;
  matrixL: number[][];
  matrixU: number[][];
}

export interface LUResult {
  steps: LUStep[];
  L: number[][];
  U: number[][];
  y: number[];
  forwardSteps: string[];
  x: number[];
  backwardSteps: string[];
}

// Menyelesaikan SPL Ax = b dengan Metode Dekomposisi LU Gauss murni
export function solveLUDecomposition(
  A_input: number[][],
  b_input: number[],
): LUResult {
  const n = A_input.length;
  let U = A_input.map((row) => [...row]);
  let b = [...b_input];

  // Inisialisasi matriks L sebagai identitas
  let L: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );

  const steps: LUStep[] = [];

  steps.push({
    label: "inisialisasi awal matriks L dan U",
    matrixL: L.map((r) => [...r]),
    matrixU: U.map((r) => [...r]),
  });

  // Fase Faktorisasi A = LU (Eliminasi Gauss)
  for (let i = 0; i < n; i++) {
    if (Math.abs(U[i][i]) < 1e-10) {
      throw new Error(
        `pivot berharga 0 pada baris ${i + 1}. dekomposisi gagal tanpa pivoting.`,
      );
    }

    for (let k = i + 1; k < n; k++) {
      const factor = U[k][i] / U[i][i];
      L[k][i] = factor;

      for (let j = i; j < n; j++) {
        U[k][j] -= factor * U[i][j];
      }
      U[k][i] = 0; // Bersihkan sisa floating-point

      steps.push({
        label: `eliminasi baris ${k + 1}: b${k + 1} - (${factor.toFixed(2)})b${i + 1}`,
        matrixL: L.map((r) => [...r]),
        matrixU: U.map((r) => [...r]),
      });
    }
  }

  // Penyulihan Maju: Ly = b
  const y = new Array(n).fill(0);
  const forwardSteps: string[] = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    let substitutionStr = `y${i + 1} = ${b[i]}`;
    for (let j = 0; j < i; j++) {
      sum += L[i][j] * y[j];
      const checkFactor = L[i][j];
      const sign = checkFactor >= 0 ? " - " : " + ";
      substitutionStr += `${sign}(${Math.abs(checkFactor).toFixed(2)} * ${y[j].toFixed(2)})`;
    }
    y[i] = b[i] - sum;
    substitutionStr += ` = ${y[i].toFixed(2)}`;
    forwardSteps.push(substitutionStr);
  }

  // Penyulihan Mundur: Ux = y
  const x = new Array(n).fill(0);
  const backwardSteps: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    let substitutionStr = `x${i + 1} = (${y[i].toFixed(2)}`;
    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
      const checkFactor = U[i][j];
      const sign = checkFactor >= 0 ? " - " : " + ";
      substitutionStr += `${sign}(${Math.abs(checkFactor).toFixed(2)} * ${x[j].toFixed(2)})`;
    }
    x[i] = (y[i] - sum) / U[i][i];
    substitutionStr += `) ÷ ${U[i][i].toFixed(2)} = ${x[i].toFixed(2)}`;
    backwardSteps.push(substitutionStr);
  }

  // Balik log backward agar tampil berurutan dari x3 ke x1 di UI
  backwardSteps.reverse();

  return {
    steps,
    L,
    U,
    y,
    forwardSteps,
    x,
    backwardSteps,
  };
}
