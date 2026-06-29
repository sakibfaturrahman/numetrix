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
// Menghilangkan penumpukan push log di dalam loop baris untuk menjaga kestabilan data array.
export function solveInverseGaussJordan(
  A_input: number[][],
  b_input: number[],
): BalikanResult {
  const n = A_input.length;

  let A = A_input.map((row) => [...row]);
  let b = [...b_input];

  // Inisialisasi sisi kanan sebagai matriks identitas I murni
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

  // Fase eliminasi Gauss-Jordan murni tanpa partial pivoting
  for (let i = 0; i < n; i++) {
    const pivot = A[i][i];

    // Cek jika pivot mendekati nol untuk menghindari pembagian dengan nol
    if (Math.abs(pivot) < 1e-10) {
      throw new Error(
        `pivot berharga 0 pada baris ${i + 1}. metode tanpa pivoting tidak dapat melanjutkan perhitungan.`,
      );
    }

    // Normalisasi baris pivot: bagi seluruh elemen baris dengan nilai pivot asli
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

    // Eliminasi elemen kolom i di atas dan di bawah baris pivot utama
    let stepLabelParts: string[] = [];

    for (let k = 0; k < n; k++) {
      if (k === i) continue; // Lewati baris pivot itu sendiri

      const factor = A[k][i];
      if (Math.abs(factor) < 1e-11) continue; // Jika elemen sudah nol, lewati

      for (let j = 0; j < n; j++) {
        A[k][j] -= factor * A[i][j];
        Inv[k][j] -= factor * Inv[i][j];
      }

      // Pembersihan nilai sisa floating point agar kolom tereliminasi menjadi murni 0
      A[k][i] = 0;

      // Catat sub-langkah operasi baris elementer
      const sign = factor > 0 ? "-" : "+";
      const absFactor = Math.abs(factor);
      const factorStr =
        absFactor === 1
          ? ""
          : absFactor % 1 === 0
            ? absFactor.toFixed(0)
            : absFactor.toFixed(2);

      stepLabelParts.push(`b${k + 1} ${sign} ${factorStr}b${i + 1}`);
    }

    // Perekaman snapshot matriks dilakukan di sini setelah seluruh baris pada kolom i selesai dieliminasi
    if (stepLabelParts.length > 0) {
      steps.push({
        label: `eliminasi kolom ke-${i + 1}: ${stepLabelParts.join(", ")}`,
        matrixA: A.map((r) => [...r]),
        matrixInv: Inv.map((r) => [...r]),
      });
    }
  }

  // Hitung solusi akhir menggunakan matriks invers hasil final eliminasi: x = A⁻¹ · b
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
