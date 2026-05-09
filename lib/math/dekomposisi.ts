// src/lib/math/dekomposisi.ts

export interface LUStep {
  label: string;
  matrixL: number[][];
  matrixU: number[][];
}

export function solveLUDecomposition(A_input: number[][], b_input: number[]) {
  const n = A_input.length;

  // Inisialisasi U sebagai copy dari A, L sebagai matriks identitas
  let U = A_input.map((row) => [...row]);
  let L = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0) as number),
  );

  const steps: LUStep[] = [];

  // 1. Proses Dekomposisi (Eliminasi Gauss untuk membentuk L dan U)
  for (let i = 0; i < n; i++) {
    for (let k = i + 1; k < n; k++) {
      const factor = U[k][i] / U[i][i];

      // Simpan faktor pengali ke matriks L
      L[k][i] = factor;

      // Update baris pada matriks U
      for (let j = i; j < n; j++) {
        U[k][j] -= factor * U[i][j];
      }

      steps.push({
        label: `eliminasi baris ${k + 1} kolom ${i + 1} (faktor: ${factor.toFixed(2)})`,
        matrixL: L.map((r) => [...r]),
        matrixU: U.map((r) => [...r]),
      });
    }
  }

  // 2. Penyulihan Maju (Forward Substitution) Ly = b
  // Sesuai gambar: y1 = b1, y2 = b2 - L21*y1, dst.
  const y = new Array(n).fill(0);
  const forwardSteps: string[] = [];

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += L[i][j] * y[j];
    }
    y[i] = b_input[i] - sum;
    forwardSteps.push(
      `y${i + 1} = ${b_input[i]} - (${sum.toFixed(2)}) = ${y[i].toFixed(2)}`,
    );
  }

  // 3. Penyulihan Mundur (Backward Substitution) Ux = y
  // Sesuai gambar: x3 = y3/U33, dst.
  const x = new Array(n).fill(0);
  const backwardSteps: string[] = [];

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
    }
    x[i] = (y[i] - sum) / U[i][i];
    backwardSteps.push(
      `x${i + 1} = (${y[i].toFixed(2)} - ${sum.toFixed(2)}) / ${U[i][i].toFixed(2)} = ${x[i].toFixed(2)}`,
    );
  }

  return {
    steps, // History matriks L & U
    L, // Matriks Segitiga Bawah Final
    U, // Matriks Segitiga Atas Final
    y, // Hasil intermediate
    forwardSteps, // Narasi proses Ly = b
    x, // Solusi akhir
    backwardSteps, // Narasi proses Ux = y
  };
}
