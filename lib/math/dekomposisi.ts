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

function fmt(n: number, dec = 4): string {
  const r = parseFloat(n.toFixed(dec));
  return Number.isInteger(r) ? r.toString() : r.toFixed(dec);
}

export function solveLUDecomposition(
  A_input: number[][],
  b_input: number[],
): LUResult {
  const n = A_input.length;

  let U = A_input.map((row) => [...row]);
  let L: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );
  let b = [...b_input];

  const steps: LUStep[] = [];

  // simpan kondisi awal
  steps.push({
    label: "matriks awal L = I, U = A",
    matrixL: L.map((r) => [...r]),
    matrixU: U.map((r) => [...r]),
  });

  // FASE 1 DEKOMPOSISI A = LU
  for (let i = 0; i < n; i++) {
    // cek kebutuhan pertukaran baris jika pivot bernilai 0
    if (Math.abs(U[i][i]) < 1e-10) {
      let maxRow = -1;

      // cari baris di bawahnya yang tidak bernilai 0 pada kolom i
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(U[k][i]) > 1e-10) {
          maxRow = k;
          break;
        }
      }

      if (maxRow === -1) {
        throw new Error(
          `matriks singular elemen kolom ${i + 1} berharga nol semua di bawah diagonal`,
        );
      }

      // 1 tukar baris pada U
      [U[i], U[maxRow]] = [U[maxRow], U[i]];

      // 2 tukar baris pada L untuk elemen pengali yang sudah terbentuk
      for (let col = 0; col < i; col++) {
        [L[i][col], L[maxRow][col]] = [L[maxRow][col], L[i][col]];
      }

      // tukar juga pengali baris L eksternal sesuai pengerjaan excel
      let tempL = L[i][i - 1];
      L[i][i - 1] = L[maxRow][i - 1];
      L[maxRow][i - 1] = tempL;

      // 3 tukar elemen b sesuai penanda pertukaran baris
      [b[i], b[maxRow]] = [b[maxRow], b[i]];

      steps.push({
        label: `pivoting excel tukar baris ${i + 1} ke baris ${maxRow + 1}`,
        matrixL: L.map((r) => [...r]),
        matrixU: U.map((r) => [...r]),
      });
    }

    // eksekusi eliminasi gauss kolom i
    for (let k = i + 1; k < n; k++) {
      const factor = U[k][i] / U[i][i];

      // catat pengali di matriks L
      L[k][i] = factor;

      // kurangi baris U
      for (let j = i; j < n; j++) {
        U[k][j] -= factor * U[i][j];
      }
      U[k][i] = 0;

      steps.push({
        label: `eliminasi baris b${k + 1} dikurangi ${fmt(factor)} kali b${i + 1}`,
        matrixL: L.map((r) => [...r]),
        matrixU: U.map((r) => [...r]),
      });
    }
  }

  // FASE 2 PENYULIHAN MAJU
  const y = new Array(n).fill(0);
  const forwardSteps: string[] = [];

  for (let i = 0; i < n; i++) {
    let sum = 0;
    const sumParts: string[] = [];

    for (let j = 0; j < i; j++) {
      if (Math.abs(L[i][j]) > 1e-14) {
        sum += L[i][j] * y[j];
        sumParts.push(`${fmt(L[i][j])} dikali ${fmt(y[j])}`);
      }
    }

    y[i] = b[i] - sum;

    if (sumParts.length === 0) {
      forwardSteps.push(`y${i + 1} = ${fmt(b[i])}`);
    } else {
      forwardSteps.push(
        `y${i + 1} = ${fmt(b[i])} dikurangi ${sumParts.join(" ditambah ")} = ${fmt(y[i])}`,
      );
    }
  }

  // FASE 3 PENYULIHAN MUNDUR
  const x = new Array(n).fill(0);
  const backwardSteps: string[] = [];

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    const sumParts: string[] = [];

    for (let j = i + 1; j < n; j++) {
      if (Math.abs(U[i][j]) > 1e-14) {
        sum += U[i][j] * x[j];
        sumParts.push(`${fmt(U[i][j])} dikali ${fmt(x[j])}`);
      }
    }

    x[i] = (y[i] - sum) / U[i][i];

    if (sumParts.length === 0) {
      backwardSteps.push(
        `x${i + 1} = ${fmt(y[i])} dibagi ${fmt(U[i][i])} = ${fmt(x[i])}`,
      );
    } else {
      backwardSteps.push(
        `x${i + 1} = ${fmt(y[i])} dikurangi ${sumParts.join(" dikurangi ")} kemudian dibagi ${fmt(U[i][i])} = ${fmt(x[i])}`,
      );
    }
  }

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
