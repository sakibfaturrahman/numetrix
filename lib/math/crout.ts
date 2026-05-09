// src/lib/math/crout.ts

/**
 * Implementasi Metode Reduksi Crout (Dekomposisi Cholesky / Doolittle versi Crout)
 * sesuai buku hal. 154-158, Contoh 4.12.
 *
 * Perbedaan kunci dengan LU Gauss:
 * - Di Crout: diagonal U = 1  (uᵢᵢ = 1)
 * - Di Gauss:  diagonal L = 1  (lᵢᵢ = 1)
 *
 * Struktur (hal. 154):
 *   A = L · U
 *   L = matriks segitiga BAWAH (diagonal bebas, bukan 1)
 *   U = matriks segitiga ATAS  (diagonal = 1)
 *
 * Rumus umum (P.4.13 & P.4.14):
 *   u_pj = (a_pj - Σ(k=1..p-1) l_pk · u_kj) / l_pp    j = p, p+1, ..., n
 *   l_iq  = (a_iq - Σ(k=1..q-1) l_ik · u_kq) / u_qq    i = q+1, q+2, ..., n
 *
 * Urutan penghitungan (hal. 155):
 *   baris-1 U → kolom-1 L → baris-2 U → kolom-2 L → ... → baris-n U
 *
 * Pivoting: jika u_qq = 0 setelah dihitung, tukar baris pada A dan b
 * (sesuai contoh 4.12 hal. 156: R₂ ↔ R₃ saat u₂₂ = 0).
 */

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

/** Format angka ringkas */
function fmt(n: number, dec = 4): string {
  if (!isFinite(n)) return "∞";
  const r = parseFloat(n.toFixed(dec));
  return Number.isInteger(r) ? r.toString() : r.toFixed(dec);
}

export function solveCroutDecomposition(
  A_input: number[][],
  b_input: number[],
): CroutResult {
  const n = A_input.length;

  // Clone agar tidak merusak input
  let A = A_input.map((row) => [...row]);
  let b = [...b_input];

  // Inisialisasi L dan U sebagai matriks nol
  const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const U: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Diagonal U = 1 (syarat Crout, sesuai hal. 154)
  for (let i = 0; i < n; i++) U[i][i] = 1;

  const decompositionSteps: CroutStep[] = [];

  // =========================================================
  // DEKOMPOSISI CROUT: bergantian baris U → kolom L
  // Sesuai urutan hal. 155 buku
  // =========================================================
  for (let p = 0; p < n; p++) {
    // --- FASE A: Hitung baris ke-p dari U (dan L[p][p]) ---
    // Formula (P.4.13): u_pj = (a_pj - Σ(k=0..p-1) l_pk·u_kj) / l_pp
    // Untuk j = p (diagonal): l_pp = a_pp - Σ(k=0..p-1) l_pk·u_kp
    // Untuk j > p (atas diagonal U): u_pj = (a_pj - Σ l_pk·u_kj) / l_pp

    // Pertama hitung L[p][p] (diagonal L)
    let sumDiag = 0;
    const diagParts: string[] = [];
    for (let k = 0; k < p; k++) {
      sumDiag += L[p][k] * U[k][p];
      diagParts.push(`${fmt(L[p][k])}×${fmt(U[k][p])}`);
    }
    L[p][p] = A[p][p] - sumDiag;

    const diagLabel =
      diagParts.length > 0
        ? `l${p + 1}${p + 1} = a${p + 1}${p + 1} − (${diagParts.join(" + ")}) = ${fmt(A[p][p])} − ${fmt(sumDiag)} = ${fmt(L[p][p])}`
        : `l${p + 1}${p + 1} = a${p + 1}${p + 1} = ${fmt(L[p][p])}`;

    decompositionSteps.push({
      type: "baris_u",
      label: `diagonal L[${p + 1}][${p + 1}] & baris ${p + 1} dari U`,
      detail: diagLabel,
    });

    // Cek pivoting: jika L[p][p] ≈ 0, perlu tukar baris
    if (Math.abs(L[p][p]) < 1e-10) {
      // Cari baris di bawah yang bisa dipakai
      let swapRow = -1;
      for (let r = p + 1; r < n; r++) {
        // Hitung sementara nilai l_rp untuk baris r
        let tempSum = 0;
        for (let k = 0; k < p; k++) tempSum += L[r][k] * U[k][p];
        const tempL = A[r][p] - tempSum;
        if (Math.abs(tempL) > 1e-10) {
          swapRow = r;
          break;
        }
      }

      if (swapRow === -1) {
        throw new Error(
          `matriks singular: l${p + 1}${p + 1} = 0 dan tidak dapat dipivot. sistem tidak memiliki solusi unik.`,
        );
      }

      // Tukar baris pada A dan b (sesuai buku: "baik untuk matriks A maupun vektor b")
      [A[p], A[swapRow]] = [A[swapRow], A[p]];
      [b[p], b[swapRow]] = [b[swapRow], b[p]];

      // Reset L[p][p] karena A sudah berubah, hitung ulang
      // (hanya elemen A[p] yang berubah, elemen L yang sudah terhitung di baris lain tidak berubah)
      sumDiag = 0;
      for (let k = 0; k < p; k++) sumDiag += L[p][k] * U[k][p];
      L[p][p] = A[p][p] - sumDiag;

      decompositionSteps.push({
        type: "pivot",
        label: `pivoting: tukar baris ${p + 1} ↔ baris ${swapRow + 1}`,
        detail: `l${p + 1}${p + 1} = 0, tukar R${p + 1} ↔ R${swapRow + 1} pada A dan b, hitung ulang l${p + 1}${p + 1} = ${fmt(L[p][p])}`,
      });
    }

    // Hitung elemen U baris ke-p (j > p, atas diagonal)
    const uRowParts: string[] = [];
    for (let j = p + 1; j < n; j++) {
      let sumU = 0;
      const uParts: string[] = [];
      for (let k = 0; k < p; k++) {
        sumU += L[p][k] * U[k][j];
        uParts.push(`${fmt(L[p][k])}×${fmt(U[k][j])}`);
      }
      U[p][j] = (A[p][j] - sumU) / L[p][p];

      const uDetail =
        uParts.length > 0
          ? `u${p + 1}${j + 1} = (${fmt(A[p][j])} − (${uParts.join(" + ")})) / ${fmt(L[p][p])} = ${fmt(U[p][j])}`
          : `u${p + 1}${j + 1} = ${fmt(A[p][j])} / ${fmt(L[p][p])} = ${fmt(U[p][j])}`;
      uRowParts.push(uDetail);
    }

    if (uRowParts.length > 0) {
      decompositionSteps.push({
        type: "baris_u",
        label: `elemen U baris ${p + 1} (atas diagonal)`,
        detail: uRowParts.join(" | "),
      });
    }

    // --- FASE B: Hitung kolom ke-p dari L (i > p, bawah diagonal) ---
    // Formula (P.4.14): l_iq = (a_iq - Σ(k=0..q-1) l_ik·u_kq) / u_qq
    // Di Crout u_qq = 1 untuk diagonal, jadi u_pp = 1 → pembagi = 1 untuk kolom p
    // Tapi elemen off-diagonal U bukan 1, jadi untuk kolom q ≠ diagonal, U[q][q] = 1 sudah benar
    const lColParts: string[] = [];
    for (let i = p + 1; i < n; i++) {
      let sumL = 0;
      const lParts: string[] = [];
      for (let k = 0; k < p; k++) {
        sumL += L[i][k] * U[k][p];
        lParts.push(`${fmt(L[i][k])}×${fmt(U[k][p])}`);
      }
      // U[p][p] = 1 selalu (diagonal U = 1 di Crout)
      L[i][p] = (A[i][p] - sumL) / U[p][p]; // U[p][p] = 1, tapi tulis eksplisit

      const lDetail =
        lParts.length > 0
          ? `l${i + 1}${p + 1} = (${fmt(A[i][p])} − (${lParts.join(" + ")})) / u${p + 1}${p + 1}(${fmt(U[p][p])}) = ${fmt(L[i][p])}`
          : `l${i + 1}${p + 1} = ${fmt(A[i][p])} / u${p + 1}${p + 1}(${fmt(U[p][p])}) = ${fmt(L[i][p])}`;
      lColParts.push(lDetail);
    }

    if (lColParts.length > 0) {
      decompositionSteps.push({
        type: "kolom_l",
        label: `elemen L kolom ${p + 1} (bawah diagonal)`,
        detail: lColParts.join(" | "),
      });
    }
  }

  // =========================================================
  // PENYULIHAN MAJU: Ly = b
  // Di Crout, diagonal L bukan 1, jadi: y[i] = (b[i] - Σ) / L[i][i]
  // Sesuai buku hal. 157: y₁ = b₁/l₁₁, dst.
  // =========================================================
  const y = new Array(n).fill(0);
  const forwardSteps: string[] = [];

  for (let i = 0; i < n; i++) {
    let sum = 0;
    const parts: string[] = [];
    for (let j = 0; j < i; j++) {
      if (Math.abs(L[i][j]) > 1e-14) {
        sum += L[i][j] * y[j];
        parts.push(`${fmt(L[i][j])} × y${j + 1}(${fmt(y[j])})`);
      }
    }
    y[i] = (b[i] - sum) / L[i][i];

    if (parts.length === 0) {
      forwardSteps.push(
        `y${i + 1} = b${i + 1} / l${i + 1}${i + 1} = ${fmt(b[i])} / ${fmt(L[i][i])} = ${fmt(y[i])}`,
      );
    } else {
      forwardSteps.push(
        `y${i + 1} = (${fmt(b[i])} − (${parts.join(" + ")})) / ${fmt(L[i][i])} = ${fmt(y[i])}`,
      );
    }
  }

  // =========================================================
  // PENYULIHAN MUNDUR: Ux = y
  // Di Crout, diagonal U = 1, jadi: x[i] = y[i] - Σ U[i][j]·x[j]
  // Sesuai buku hal. 157: 3x₃ = 3 → x₃ = 1, dst.
  // =========================================================
  const x = new Array(n).fill(0);
  const backwardSteps: string[] = [];

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    const parts: string[] = [];
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(U[i][j]) > 1e-14) {
        sum += U[i][j] * x[j];
        parts.push(`${fmt(U[i][j])} × x${j + 1}(${fmt(x[j])})`);
      }
    }
    // U[i][i] = 1 selalu di Crout
    x[i] = y[i] - sum;

    if (parts.length === 0) {
      backwardSteps.push(
        `x${i + 1} = y${i + 1} = ${fmt(y[i])} → x${i + 1} = ${fmt(x[i])}`,
      );
    } else {
      backwardSteps.push(
        `x${i + 1} = ${fmt(y[i])} − (${parts.join(" + ")}) = ${fmt(x[i])}`,
      );
    }
  }

  // Balik agar ditampilkan dari xₙ ke x₁
  backwardSteps.reverse();

  return { L, U, y, x, forwardSteps, backwardSteps, decompositionSteps };
}
