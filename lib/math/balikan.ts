// src/lib/math/balikan.ts

export interface MatrixStep {
  label: string;
  matrixA: number[][]; // Sisi kiri A menuju Identitas I
  matrixInv: number[][]; // Sisi kanan I menuju Invers A⁻¹
}

export interface BalikanResult {
  steps: MatrixStep[];
  finalInverse: number[][];
  solution: number[];
}

// Menyelesaikan SPL Ax = b menggunakan metode Matriks Balikan.
// Versi Murni Gauss-Jordan Sesuai hitungan Excel tanpa Pivoting.
export function solveInverseGaussJordan(
  A_input: number[][],
  b_input: number[],
): BalikanResult {
  const n = A_input.length;

  let A = A_input.map((row) => [...row]);
  let b = [...b_input];

  // Inisialisasi sisi kanan sebagai matriks identitas I
  let Inv: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );

  const steps: MatrixStep[] = [];

  // Simpan kondisi awal matriks augmented
  steps.push({
    label: "matriks augmented awal [a | i]",
    matrixA: A.map((r) => [...r]),
    matrixInv: Inv.map((r) => [...r]),
  });

  // Fase eliminasi Gauss-Jordan tanpa pivoting seperti Excel
  for (let i = 0; i < n; i++) {
    const pivot = A[i][i];

    // Cek jika pivot nol tidak bisa membagi langsung
    if (Math.abs(pivot) < 1e-10) {
      throw new Error(
        `pivot berharga 0 pada baris ${i + 1}. metode tanpa pivoting tidak dapat melanjutkan perhitungan.`,
      );
    }

    // Normalisasi baris pivot bagi baris dengan nilai pivotnya
    if (Math.abs(pivot - 1) > 1e-10) {
      for (let j = 0; j < n; j++) {
        A[i][j] /= pivot;
        Inv[i][j] /= pivot;
      }

      steps.push({
        label: `normalisasi baris ${i + 1}: b${i + 1} ÷ ${pivot % 1 === 0 ? pivot.toFixed(0) : pivot.toFixed(2)}`,
        matrixA: A.map((r) => [...r]),
        matrixInv: Inv.map((r) => [...r]),
      });
    }

    // Eliminasi elemen di kolom i atas dan bawah baris pivot
    for (let k = 0; k < n; k++) {
      if (k === i) continue; // Skip baris pivot itu sendiri

      const factor = A[k][i];
      if (Math.abs(factor) < 1e-14) continue; // Sudah nol skip

      for (let j = 0; j < n; j++) {
        A[k][j] -= factor * A[i][j];
        Inv[k][j] -= factor * Inv[i][j];
      }

      // Format label langkah OBE sesuai catatan Excel
      const sign = factor > 0 ? "-" : "+";
      const absFactor = Math.abs(factor);
      const factorStr =
        absFactor === 1
          ? ""
          : absFactor % 1 === 0
            ? absFactor.toFixed(0)
            : absFactor.toFixed(2);

      steps.push({
        label: `operasi baris: b${k + 1} ${sign} ${factorStr}b${i + 1}`,
        matrixA: A.map((r) => [...r]),
        matrixInv: Inv.map((r) => [...r]),
      });
    }
  }

  // Hitung solusi akhir x = A⁻¹ · b
  const solution = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      solution[i] += Inv[i][j] * b[j];
    }
  }

  return {
    steps,
    finalInverse: Inv,
    solution,
  };
}
