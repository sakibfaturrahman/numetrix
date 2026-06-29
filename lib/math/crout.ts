// src/lib/math/crout.ts

export interface CroutStep {
  type: "baris_u" | "kolom_l" | "pivot";
  label: string;
  detail: string;
}

export interface CroutResult {
  L: number[][];
  U: number[][];
  y: number[];
  x: number[];
  forwardSteps: string[];
  backwardSteps: string[];
  decompositionSteps: CroutStep[];
}

// Menyelesaikan SPL Ax = b menggunakan metode Dekomposisi Reduksi Crout
// Faktorisasi dilakukan secara bergantian: Kolom L kemudian Baris U
export function solveCroutDecomposition(
  A: number[][],
  b: number[],
): CroutResult {
  const n = A.length;

  // Inisialisasi matriks L (segitiga bawah) dan U (segitiga atas dengan diagonal 1)
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  const U = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    U[i][i] = 1;
  }

  const decompositionSteps: CroutStep[] = [];

  // Proses eliminasi bergantian kolom L dan baris U
  for (let j = 0; j < n; j++) {
    // 1. Hitung kolom ke-j untuk matriks L
    for (let i = j; i < n; i++) {
      let sum = 0;
      for (let k = 0; k < j; k++) {
        sum += L[i][k] * U[k][j];
      }
      L[i][j] = A[i][j] - sum;

      decompositionSteps.push({
        type: "kolom_l",
        label: `hitung L[${i + 1}][${j + 1}]`,
        detail: `L[${i + 1}][${j + 1}] = A[${i + 1}][${j + 1}] - sum(L[${i + 1}][k] * U[k][${j + 1}]) = ${A[i][j]} - ${sum} = ${L[i][j].toFixed(4)}`,
      });
    }

    // Cek apakah elemen diagonal L bernilai nol untuk menghindari pembagian nol
    if (Math.abs(L[j][j]) < 1e-12) {
      throw new Error(
        `matriks singular atau memerlukan pivoting. elemen diagonal L[${j + 1}][${j + 1}] berharga 0.`,
      );
    }

    // 2. Hitung baris ke-j untuk matriks U
    for (let i = j + 1; i < n; i++) {
      let sum = 0;
      for (let k = 0; k < j; k++) {
        sum += L[j][k] * U[k][i];
      }
      U[j][i] = (A[j][i] - sum) / L[j][j];

      decompositionSteps.push({
        type: "baris_u",
        label: `hitung U[${j + 1}][${i + 1}]`,
        detail: `U[${j + 1}][${i + 1}] = (A[${j + 1}][${i + 1}] - sum(L[${j + 1}][k] * U[k][${i + 1}])) / L[${j + 1}][${j + 1}] = (${A[j][i]} - ${sum}) / ${L[j][j].toFixed(4)} = ${U[j][i].toFixed(4)}`,
      });
    }
  }

  // 3. Penyulihan Maju: Ly = b
  const y = new Array(n).fill(0);
  const forwardSteps: string[] = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += L[i][j] * y[j];
    }
    y[i] = (b[i] - sum) / L[i][i];
    forwardSteps.push(
      `y${i + 1} = (${b[i]} - ${sum.toFixed(4)}) / ${L[i][i].toFixed(4)} = ${y[i].toFixed(4)}`,
    );
  }

  // 4. Penyulihan Mundur: Ux = y
  const x = new Array(n).fill(0);
  const backwardSteps: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
    }
    x[i] = y[i] - sum;
    backwardSteps.push(
      `x${i + 1} = ${y[i].toFixed(4)} - ${sum.toFixed(4)} = ${x[i].toFixed(4)}`,
    );
  }

  // Khusus untuk tampilan log penyulihan mundur di frontend agar berurutan dari x3 ke x1
  backwardSteps.reverse();

  return {
    L,
    U,
    y,
    x,
    forwardSteps,
    backwardSteps,
    decompositionSteps,
  };
}
