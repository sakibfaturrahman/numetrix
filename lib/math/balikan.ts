// Interface untuk merekam setiap langkah eliminasi agar bisa ditampilkan di UI Tabel
export interface InverseStep {
  label: string;
  matrixA: number[][]; // Bagian kiri (akan jadi Identitas)
  matrixInv: number[][]; // Bagian kanan (akan jadi Invers)
}

export function solveMatrixInverse(A_input: number[][], b_input: number[]) {
  const n = A_input.length;

  // 1. Inisialisasi Matriks A dan Matriks Identitas I
  let A = A_input.map((row) => [...row]);
  let Inv = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );

  const steps: InverseStep[] = [];

  // Rekam kondisi awal
  steps.push({
    label: "Kondisi Awal [A | I]",
    matrixA: A.map((r) => [...r]),
    matrixInv: Inv.map((r) => [...r]),
  });

  // 2. Proses Eliminasi Gauss-Jordan (Iterasi Matriks)
  for (let i = 0; i < n; i++) {
    // Cari Pivot (Elemen diagonal)
    let pivot = A[i][i];

    // Normalisasi baris pivot agar A[i][i] menjadi 1
    for (let j = 0; j < n; j++) {
      A[i][j] /= pivot;
      Inv[i][j] /= pivot;
    }

    steps.push({
      label: `Normalisasi baris ke-${i + 1} (B${i + 1} / ${pivot.toFixed(2)})`,
      matrixA: A.map((r) => [...r]),
      matrixInv: Inv.map((r) => [...r]),
    });

    // Eliminasi elemen lain di kolom yang sama (selain baris i)
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        let factor = A[k][i];
        for (let j = 0; j < n; j++) {
          A[k][j] -= factor * A[i][j];
          Inv[k][j] -= factor * Inv[i][j];
        }
        steps.push({
          label: `Eliminasi B${k + 1} menggunakan B${i + 1}: (B${k + 1} - ${factor.toFixed(2)} * B${i + 1})`,
          matrixA: A.map((r) => [...r]),
          matrixInv: Inv.map((r) => [...r]),
        });
      }
    }
  }

  // 3. Hitung Solusi Akhir: x = A^-1 * b
  const solution = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      solution[i] += Inv[i][j] * b_input[j];
    }
  }

  return {
    inverse: Inv,
    steps: steps, // Kirim semua history langkah untuk tabel UI
    solution: solution, // [x1, x2, x3]
  };
}
