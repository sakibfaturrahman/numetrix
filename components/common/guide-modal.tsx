// components/common/guide-modal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Info } from "lucide-react";

interface GuideStep {
  text: string;
}

interface GuideModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  theoryOverview: string;
  steps: string[];
  onClose: () => void;
}

export const GuideModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  theoryOverview,
  steps,
  onClose,
}: GuideModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[35px] border-none p-8 lowercase outline-none">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2 text-left">
            <div className="p-2 bg-blue-600 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tighter">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 text-sm italic leading-relaxed text-left">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-6 text-left">
          {/* Bagian Teori */}
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex gap-4 items-start">
            <Info className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
            <p className="text-xs text-blue-600/80 leading-relaxed italic">
              {theoryOverview}
            </p>
          </div>

          {/* Bagian Langkah-langkah */}
          <div className="space-y-4">
            {steps.map((text, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-100 shrink-0">
                  {i + 1}
                </div>
                <p className="text-xs text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="w-full py-6 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all active:scale-[0.98]"
          >
            saya mengerti, mulai hitung
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
