// src/lib/math/balikan.ts

export interface MatrixStep {
  label: string;
  matrixA: number[][]; // Bagian kiri [A] → menuju Identitas I
  matrixInv: number[][]; // Bagian kanan [I] → menuju Invers A⁻¹
}

export interface BalikanResult {
  steps: MatrixStep[];
  finalInverse: number[][];
  solution: number[];
}

/**
 * Menyelesaikan SPL Ax = b menggunakan metode Matriks Balikan.
 *
 * Langkah sesuai buku (Contoh 4.9):
 * 1. Bentuk matriks augmented [A | I]
 * 2. Lakukan eliminasi Gauss-Jordan pada sisi kiri hingga menjadi I
 *    → Sisi kanan otomatis menjadi A⁻¹
 * 3. Hitung solusi: x = A⁻¹ · b
 *
 * Catatan: Jika terjadi pivoting (pertukaran baris), baris-baris pada b
 * juga harus dipertukarkan (sesuai catatan akhir buku).
 */
export function solveInverseGaussJordan(
  A_input: number[][],
  b_input: number[],
): BalikanResult {
  const n = A_input.length;

  // Clone agar tidak merusak state asli
  let A = A_input.map((row) => [...row]);
  let b = [...b_input]; // b juga di-track untuk partial pivoting

  // Inisialisasi sisi kanan sebagai matriks identitas I
  let Inv: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );

  const steps: MatrixStep[] = [];

  // Simpan kondisi awal [A | I]
  steps.push({
    label: "matriks augmented awal [a | i]",
    matrixA: A.map((r) => [...r]),
    matrixInv: Inv.map((r) => [...r]),
  });

  // === FASE FORWARD: Gauss-Jordan dengan Partial Pivoting ===
  for (let i = 0; i < n; i++) {
    // --- Partial Pivoting: cari baris dengan nilai absolut terbesar di kolom i ---
    let maxRow = i;
    let maxVal = Math.abs(A[i][i]);
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > maxVal) {
        maxVal = Math.abs(A[k][i]);
        maxRow = k;
      }
    }

    // Lakukan pertukaran baris jika diperlukan
    if (maxRow !== i) {
      [A[i], A[maxRow]] = [A[maxRow], A[i]];
      [Inv[i], Inv[maxRow]] = [Inv[maxRow], Inv[i]];
      // Sesuai catatan buku: b juga harus dipertukarkan
      [b[i], b[maxRow]] = [b[maxRow], b[i]];

      steps.push({
        label: `tukar baris ${i + 1} ↔ baris ${maxRow + 1} (pivoting)`,
        matrixA: A.map((r) => [...r]),
        matrixInv: Inv.map((r) => [...r]),
      });
    }

    const pivot = A[i][i];

    // Cek singular: jika pivot ≈ 0, matriks tidak memiliki invers
    if (Math.abs(pivot) < 1e-10) {
      throw new Error(
        "matriks singular (determinan nol), invers tidak ada. pastikan matriks a tidak singular.",
      );
    }

    // --- Normalisasi baris pivot: bagi seluruh baris dengan pivot ---
    // Tujuan: jadikan A[i][i] = 1  (sesuai langkah buku: R₂ - 3R₁, dst.)
    for (let j = 0; j < n; j++) {
      A[i][j] /= pivot;
      Inv[i][j] /= pivot;
    }

    steps.push({
      label: `normalisasi baris ${i + 1}: b${i + 1} ÷ ${pivot % 1 === 0 ? pivot.toFixed(0) : pivot.toFixed(4)}`,
      matrixA: A.map((r) => [...r]),
      matrixInv: Inv.map((r) => [...r]),
    });

    // --- Eliminasi: nolkan semua elemen di kolom i selain baris i ---
    // Ini yang membedakan Gauss-Jordan dari Gauss biasa (eliminasi ke atas & bawah)
    for (let k = 0; k < n; k++) {
      if (k === i) continue; // lewati baris pivot itu sendiri

      const factor = A[k][i];
      if (Math.abs(factor) < 1e-14) continue; // sudah nol, skip

      for (let j = 0; j < n; j++) {
        A[k][j] -= factor * A[i][j];
        Inv[k][j] -= factor * Inv[i][j];
      }

      steps.push({
        label: `eliminasi baris ${k + 1}: b${k + 1} − (${factor % 1 === 0 ? factor.toFixed(0) : factor.toFixed(4)} × b${i + 1})`,
        matrixA: A.map((r) => [...r]),
        matrixInv: Inv.map((r) => [...r]),
      });
    }
  }

  // Pada titik ini, A sudah menjadi I, dan Inv sudah menjadi A⁻¹

  // === HITUNG SOLUSI: x = A⁻¹ · b ===
  // (sesuai persamaan P.4.8 pada buku: x = A⁻¹b)
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
