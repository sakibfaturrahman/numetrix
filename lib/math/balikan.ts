// src/lib/math/balikan.ts

export interface MatrixStep {
  label: string;
  matrixA: number[][]; // Bagian kiri yang akan jadi Identitas
  matrixInv: number[][]; // Bagian kanan yang akan jadi Invers
}

export function solveInverseGaussJordan(
  A_input: number[][],
  b_input: number[],
) {
  const n = A_input.length;

  // Clone matriks agar tidak merusak state asli
  let A = A_input.map((row) => [...row]);

  // Buat Matriks Identitas I
  let Inv = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );

  const steps: MatrixStep[] = [];

  // Simpan Kondisi Awal
  steps.push({
    label: "matriks augmented awal [a | i]",
    matrixA: A.map((r) => [...r]),
    matrixInv: Inv.map((r) => [...r]),
  });

  for (let i = 0; i < n; i++) {
    let pivot = A[i][i];

    if (Math.abs(pivot) < 1e-10) {
      throw new Error("matriks singular (determinan nol), invers tidak ada.");
    }

    // Langkah 1: Normalisasi baris pivot (jadikan A[i][i] = 1)
    for (let j = 0; j < n; j++) {
      A[i][j] /= pivot;
      Inv[i][j] /= pivot;
    }

    steps.push({
      label: `normalisasi baris ${i + 1} (b${i + 1} / ${pivot.toFixed(2)})`,
      matrixA: A.map((r) => [...r]),
      matrixInv: Inv.map((r) => [...r]),
    });

    // Langkah 2: Eliminasi baris lain (jadikan kolom i bernilai 0 selain di baris i)
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        let factor = A[k][i];
        for (let j = 0; j < n; j++) {
          A[k][j] -= factor * A[i][j];
          Inv[k][j] -= factor * Inv[i][j];
        }
        steps.push({
          label: `eliminasi baris ${k + 1} (b${k + 1} - (${factor.toFixed(2)} * b${i + 1}))`,
          matrixA: A.map((r) => [...r]),
          matrixInv: Inv.map((r) => [...r]),
        });
      }
    }
  }

  // Langkah 3: Hitung Solusi x = A⁻¹ * b
  const solution = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      solution[i] += Inv[i][j] * b_input[j];
    }
  }

  return {
    steps,
    finalInverse: Inv,
    solution,
  };
}
