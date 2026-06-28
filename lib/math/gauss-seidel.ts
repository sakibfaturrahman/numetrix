// src/lib/math/gauss-seidel.ts

export interface GaussSeidelIteration {
  iterasi: number;
  x: number;
  y: number;
  z: number;
  galatX: number;
  galatY: number;
  galatZ: number;
  isConvergedX: boolean;
  isConvergedY: boolean;
  isConvergedZ: boolean;
}

export function solveGaussSeidel(
  A: number[][],
  b: number[],
  initialGuess: number[],
  tolerance: number = 0.000001,
  maxIter: number = 50,
): GaussSeidelIteration[] {
  let x = [...initialGuess];
  const n = b.length;
  const history: GaussSeidelIteration[] = [];

  history.push({
    iterasi: 0,
    x: x[0],
    y: x[1],
    z: x[2],
    galatX: 0,
    galatY: 0,
    galatZ: 0,
    isConvergedX: false,
    isConvergedY: false,
    isConvergedZ: false,
  });

  for (let k = 0; k < maxIter; k++) {
    const xOld = [...x];

    for (let i = 0; i < n; i++) {
      let sigma = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sigma += A[i][j] * x[j];
        }
      }
      x[i] = (b[i] - sigma) / A[i][i];
    }

    const gX = Math.abs(x[0] - xOld[0]);
    const gY = Math.abs(x[1] - xOld[1]);
    const gZ = Math.abs(x[2] - xOld[2]);

    const isConvX = gX < tolerance;
    const isConvY = gY < tolerance;
    const isConvZ = gZ < tolerance;

    history.push({
      iterasi: k + 1,
      x: x[0],
      y: x[1],
      z: x[2],
      galatX: gX,
      galatY: gY,
      galatZ: gZ,
      isConvergedX: isConvX,
      isConvergedY: isConvY,
      isConvergedZ: isConvZ,
    });

    if (isConvX && isConvY && isConvZ) {
      break;
    }
  }

  return history;
}
