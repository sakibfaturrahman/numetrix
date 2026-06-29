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

  let A = A_input.map((row) => [...row]);
  let b = [...b_input];

  const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const U: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // set diagonal U bernilai 1 sesuai kaidah reduksi crout
  for (let i = 0; i < n; i++) U[i][i] = 1;

  const decompositionSteps: CroutStep[] = [];

  // hitung matriks segitiga bawah L dan segitiga atas U bergantian per kolom
  for (let j = 0; j < n; j++) {
    // hitung elemen kolom j untuk matriks L (baris j sampai n-1)
    for (let i = j; i < n; i++) {
      let sumL = 0;
      for (let k = 0; k < j; k++) {
        sumL += L[i][k] * U[k][j];
      }
      L[i][j] = A[i][j] - sumL;
    }

    // cek kebutuhan pertukaran baris jika pivot L[j][j] mendekati nol
    if (Math.abs(L[j][j]) < 1e-10) {
      let swapRow = -1;

      // cari baris di bawahnya yang punya nilai tidak nol pada kolom j
      for (let k = j + 1; k < n; k++) {
        if (Math.abs(L[k][j]) > 1e-10) {
          swapRow = k;
          break;
        }
      }

      if (swapRow === -1) {
        throw new Error(
          `matriks singular elemen kolom ${j + 1} berharga nol semua di bawah diagonal`,
        );
      }

      // tukar seluruh baris j dengan swapRow pada A, b, dan L
      // (kolom L yang sudah terhitung untuk baris ini ikut tertukar)
      [A[j], A[swapRow]] = [A[swapRow], A[j]];
      [b[j], b[swapRow]] = [b[swapRow], b[j]];
      [L[j], L[swapRow]] = [L[swapRow], L[j]];

      decompositionSteps.push({
        type: "pivot",
        label: `pivoting tukar baris ${j + 1} ke baris ${swapRow + 1}`,
        detail: `elemen pivot l${j + 1}${j + 1} bernilai 0, baris ditukar dengan baris ${swapRow + 1} yang memiliki elemen tidak nol pada kolom ${j + 1}`,
      });
    }

    // hitung elemen baris j untuk matriks U (kolom j+1 sampai n-1)
    for (let i = j + 1; i < n; i++) {
      let sumU = 0;
      for (let k = 0; k < j; k++) {
        sumU += L[j][k] * U[k][i];
      }
      U[j][i] = (A[j][i] - sumU) / L[j][j];
    }

    decompositionSteps.push({
      type: "kolom_l",
      label: `iterasi langkah ke ${j + 1}`,
      detail: `menghitung komponen pengali l dan u pada kolom baris elemen diagonal ke ${j + 1}`,
    });
  }

  // proses penyulihan maju Ly sama dengan b untuk mencari nilai y
  const y = new Array(n).fill(0);
  const forwardSteps: string[] = [];

  for (let i = 0; i < n; i++) {
    let sum = 0;
    const parts: string[] = [];
    for (let j = 0; j < i; j++) {
      sum += L[i][j] * y[j];
      parts.push(`${fmt(L[i][j])} murni dikali ${fmt(y[j])}`);
    }
    y[i] = (b[i] - sum) / L[i][i];

    if (parts.length === 0) {
      forwardSteps.push(
        `y${i + 1} = ${fmt(b[i])} / ${fmt(L[i][i])} = ${fmt(y[i])}`,
      );
    } else {
      forwardSteps.push(
        `y${i + 1} = ${fmt(b[i])} dikurangi ${parts.join(" dikurangi ")} kemudian dibagi ${fmt(L[i][i])} = ${fmt(y[i])}`,
      );
    }
  }

  // proses penyulihan mundur Ux sama dengan y untuk mencari nilai x
  const x = new Array(n).fill(0);
  const backwardSteps: string[] = [];

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    const parts: string[] = [];
    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
      parts.push(`${fmt(U[i][j])} murni dikali ${fmt(x[j])}`);
    }
    x[i] = y[i] - sum;

    if (parts.length === 0) {
      backwardSteps.push(`x${i + 1} = ${fmt(y[i])}`);
    } else {
      backwardSteps.push(
        `x${i + 1} = ${fmt(y[i])} dikurangi ${parts.join(" dikurangi ")} = ${fmt(x[i])}`,
      );
    }
  }

  backwardSteps.reverse();

  return { L, U, y, x, forwardSteps, backwardSteps, decompositionSteps };
}
