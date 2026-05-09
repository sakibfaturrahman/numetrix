// src/lib/math/crout.ts

export function solveCroutDecomposition(A: number[][], b: number[]) {
  const n = A.length;
  let L = Array.from({ length: n }, () => new Array(n).fill(0));
  let U = Array.from({ length: n }, () => new Array(n).fill(0));

  // Inisialisasi Diagonal U dengan 1
  for (let i = 0; i < n; i++) U[i][i] = 1;

  for (let j = 0; j < n; j++) {
    // 1. Hitung elemen L (Kolom j)
    for (let i = j; i < n; i++) {
      let sum = 0;
      for (let k = 0; k < j; k++) {
        sum += L[i][k] * U[k][j];
      }
      L[i][j] = A[i][j] - sum;
    }

    // 2. Hitung elemen U (Baris j)
    for (let i = j + 1; i < n; i++) {
      let sum = 0;
      for (let k = 0; k < j; k++) {
        sum += L[j][k] * U[k][i];
      }
      if (L[j][j] === 0)
        throw new Error("matriks singular: pembagi nol pada diagonal L");
      U[j][i] = (A[j][i] - sum) / L[j][j];
    }
  }

  // 3. Forward Substitution (Ly = b)
  const y = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) sum += L[i][j] * y[j];
    y[i] = (b[i] - sum) / L[i][i];
  }

  // 4. Backward Substitution (Ux = y)
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) sum += U[i][j] * x[j];
    x[i] = y[i] - sum; // Karena U[i][i] selalu 1
  }

  return { L, U, y, x };
}
