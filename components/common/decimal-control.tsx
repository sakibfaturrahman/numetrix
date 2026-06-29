// src/components/common/decimal-control.tsx

import React from "react";
import { Plus, Minus } from "lucide-react";

interface DecimalControlProps {
  decimals: number;
  setDecimals: React.Dispatch<React.SetStateAction<number>>;
  min?: number;
  max?: number;
}

export const DecimalControl: React.FC<DecimalControlProps> = ({
  decimals,
  setDecimals,
  min = 0,
  max = 12, // Batas maksimal angka di belakang koma
}) => {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mr-1">
        desimal
      </span>
      <button
        onClick={() => setDecimals((p) => Math.max(min, p - 1))}
        className="w-6 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-black rounded-full transition-colors border border-gray-100"
      >
        <Minus className="w-3 h-3 stroke-[3]" />
      </button>
      <span className="text-xs font-mono font-bold text-black w-4 text-center">
        {decimals}
      </span>
      <button
        onClick={() => setDecimals((p) => Math.min(max, p + 1))}
        className="w-6 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-black rounded-full transition-colors border border-gray-100"
      >
        <Plus className="w-3 h-3 stroke-[3]" />
      </button>
    </div>
  );
};