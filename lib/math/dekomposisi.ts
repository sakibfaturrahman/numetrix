// src/lib/math/dekomposisi.ts

/**
 * Implementasi Metode Dekomposisi LU (Gauss) sesuai buku:
 *
 * Langkah-langkah (hal. 153):
 * 1. Bentuk matriks L dan U dari A  →  A = LU
 * 2. Pecahkan Ly = b  →  penyulihan maju (forward substitution)
 * 3. Pecahkan Ux = y  →  penyulihan mundur (backward substitution)
 *
 * Struktur matriks (hal. 151):
 * - L: matriks segitiga BAWAH, semua elemen diagonal = 1
 * - U: matriks segitiga ATAS, hasil eliminasi Gauss
 *
 * Contoh (hal. 151):
 * [ 2 -1 -1 ]   [ 1 0 0 ] [ 2 -1 -1 ]
 * [ 0 -4  2 ] = [ 0 1 0 ] [ 0 -4  2 ]
 * [ 6 -3  1 ]   [ 3 0 1 ] [ 0  0  4 ]
 */

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

/**
 * Format angka: hilangkan trailing zeros untuk angka bulat
 */
function fmt(n: number, dec = 4): string {
  const r = parseFloat(n.toFixed(dec));
  return Number.isInteger(r) ? r.toString() : r.toFixed(dec);
}

export function solveLUDecomposition(
  A_input: number[][],
  b_input: number[],
): LUResult {
  const n = A_input.length;

  // Clone agar tidak merusak input asli
  // U diinisialisasi sebagai salinan A
  let U = A_input.map((row) => [...row]);

  // L diinisialisasi sebagai matriks identitas (diagonal = 1, sesuai buku hal. 151)
  let L: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );

  // b yang bisa di-track (untuk pivoting jika diperlukan)
  let b = [...b_input];

  const steps: LUStep[] = [];

  // Simpan kondisi awal
  steps.push({
    label: "matriks awal: L = I, U = A",
    matrixL: L.map((r) => [...r]),
    matrixU: U.map((r) => [...r]),
  });

  // =========================================================
  // FASE 1: DEKOMPOSISI A = LU (Metode Eliminasi Gauss)
  // Sesuai buku hal. 151-153
  // =========================================================
  for (let i = 0; i < n; i++) {
    // Partial Pivoting: pastikan pivot tidak nol
    if (Math.abs(U[i][i]) < 1e-10) {
      // Cari baris di bawah dengan nilai terbesar di kolom i
      let maxRow = -1;
      let maxVal = 0;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(U[k][i]) > maxVal) {
          maxVal = Math.abs(U[k][i]);
          maxRow = k;
        }
      }

      if (maxRow === -1 || maxVal < 1e-10) {
        throw new Error(
          `matriks singular: pivot pada kolom ${i + 1} bernilai nol dan tidak dapat dipivot. matriks A tidak dapat didekomposisi.`,
        );
      }

      // Tukar baris pada U
      [U[i], U[maxRow]] = [U[maxRow], U[i]];

      // Tukar elemen L yang sudah diisi (hanya kolom < i)
      for (let col = 0; col < i; col++) {
        [L[i][col], L[maxRow][col]] = [L[maxRow][col], L[i][col]];
      }

      // Tukar b (sesuai catatan buku: b juga ikut di-pivot)
      [b[i], b[maxRow]] = [b[maxRow], b[i]];

      steps.push({
        label: `pivoting: tukar baris ${i + 1} ↔ baris ${maxRow + 1}`,
        matrixL: L.map((r) => [...r]),
        matrixU: U.map((r) => [...r]),
      });
    }

    // Eliminasi baris-baris di bawah pivot
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(U[k][i]) < 1e-14) continue; // sudah nol, skip

      // Hitung faktor pengali m_ki = U[k][i] / U[i][i]
      // Ini adalah elemen L[k][i] sesuai definisi L (hal. 151)
      const factor = U[k][i] / U[i][i];

      // Simpan faktor ke matriks L
      L[k][i] = factor;

      // Update baris k pada U: R_k ← R_k - factor * R_i
      for (let j = i; j < n; j++) {
        U[k][j] -= factor * U[i][j];
      }

      // Nolkan elemen yang sudah dieliminasi (numerical cleanup)
      U[k][i] = 0;

      steps.push({
        label: `eliminasi: L[${k + 1}][${i + 1}] = ${fmt(factor)}, b${k + 1} ← b${k + 1} − (${fmt(factor)} × b${i + 1})`,
        matrixL: L.map((r) => [...r]),
        matrixU: U.map((r) => [...r]),
      });
    }
  }

  // =========================================================
  // FASE 2: PENYULIHAN MAJU (Forward Substitution) → Ly = b
  // Sesuai buku hal. 152 (P.4.12): Ux = y → Ly = b
  //
  // Karena diagonal L = 1:
  //   y₁ = b₁
  //   y₂ = b₂ - L₂₁·y₁
  //   y₃ = b₃ - L₃₁·y₁ - L₃₂·y₂
  //   ...
  //   yᵢ = bᵢ - Σ(j<i) Lᵢⱼ·yⱼ
  // =========================================================
  const y = new Array(n).fill(0);
  const forwardSteps: string[] = [];

  for (let i = 0; i < n; i++) {
    let sum = 0;
    const sumParts: string[] = [];

    for (let j = 0; j < i; j++) {
      if (Math.abs(L[i][j]) > 1e-14) {
        sum += L[i][j] * y[j];
        sumParts.push(`${fmt(L[i][j])} × y${j + 1}(${fmt(y[j])})`);
      }
    }

    y[i] = b[i] - sum;

    if (sumParts.length === 0) {
      // Baris pertama atau tidak ada elemen L di bawah diagonal
      forwardSteps.push(`y${i + 1} = b${i + 1} = ${fmt(b[i])}`);
    } else {
      forwardSteps.push(
        `y${i + 1} = ${fmt(b[i])} − (${sumParts.join(" + ")}) = ${fmt(y[i])}`,
      );
    }
  }

  // =========================================================
  // FASE 3: PENYULIHAN MUNDUR (Backward Substitution) → Ux = y
  // Sesuai buku hal. 152:
  //   xₙ = yₙ / Uₙₙ
  //   xᵢ = (yᵢ - Σ(j>i) Uᵢⱼ·xⱼ) / Uᵢᵢ
  // =========================================================
  const x = new Array(n).fill(0);
  const backwardSteps: string[] = [];

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    const sumParts: string[] = [];

    for (let j = i + 1; j < n; j++) {
      if (Math.abs(U[i][j]) > 1e-14) {
        sum += U[i][j] * x[j];
        sumParts.push(`${fmt(U[i][j])} × x${j + 1}(${fmt(x[j])})`);
      }
    }

    x[i] = (y[i] - sum) / U[i][i];

    if (sumParts.length === 0) {
      backwardSteps.push(
        `x${i + 1} = y${i + 1} / U${i + 1}${i + 1} = ${fmt(y[i])} / ${fmt(U[i][i])} = ${fmt(x[i])}`,
      );
    } else {
      backwardSteps.push(
        `x${i + 1} = (${fmt(y[i])} − (${sumParts.join(" + ")})) / ${fmt(U[i][i])} = ${fmt(x[i])}`,
      );
    }
  }

  // Balik urutan backwardSteps agar ditampilkan dari xₙ ke x₁ (lebih natural)
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
