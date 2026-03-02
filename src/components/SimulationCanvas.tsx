import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, AlertTriangle } from 'lucide-react';
import { SimulationMode } from '../types';

interface SimulationCanvasProps {
  mode: SimulationMode;
  canvasGridRef: React.RefObject<HTMLCanvasElement>;
  canvasContRef: React.RefObject<HTMLCanvasElement>;
  isRunning: { continuous: boolean; grid: boolean };
  oscillationDetected: { continuous: boolean; grid: boolean };
  iterations: { continuous: number; grid: number };
  unhappyCount: { continuous: number; grid: number };
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  mode,
  canvasGridRef,
  canvasContRef,
  isRunning,
  oscillationDetected,
  iterations,
  unhappyCount,
}) => {
  return (
    <div className="flex flex-col items-center p-6 md:p-12 space-y-12">
      <div className={`w-full max-w-7xl grid ${mode === 'DUAL' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
        {/* Grid View (First if Dual) */}
        {(mode === 'GRID' || mode === 'DUAL') && (
          <div className="space-y-4">
            {mode === 'DUAL' && <h3 className="text-center font-bold text-slate-400 uppercase text-[10px] tracking-widest">Mô hình Lưới</h3>}
            <div className="relative aspect-[4/3] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-300/40 border border-slate-200 group">
              <canvas ref={canvasGridRef} width={800} height={600} className="w-full h-full object-contain" />
              
              <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none">
                <div className="flex items-center gap-3 bg-white/80 px-3 py-2 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-sm shadow-red-200" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Nhóm A</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 px-3 py-2 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
                  <div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-sm shadow-blue-200" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Nhóm B</span>
                </div>
              </div>

              <AnimatePresence>
                {!isRunning.grid && iterations.grid > 0 && unhappyCount.grid === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="absolute inset-x-0 bottom-10 mx-auto w-fit bg-emerald-600 text-white px-8 py-4 rounded-3xl font-bold shadow-2xl shadow-emerald-200 flex items-center gap-3 text-sm z-10"
                  >
                    <ShieldCheck size={20} />
                    Cân bằng (Lưới)
                  </motion.div>
                )}
                {oscillationDetected.grid && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="absolute inset-x-0 bottom-10 mx-auto w-fit bg-amber-600 text-white px-8 py-4 rounded-3xl font-bold shadow-2xl shadow-amber-200 flex flex-col items-center gap-1 text-sm z-10"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={20} />
                      Phát hiện Dao động (Grid)
                    </div>
                    <span className="text-[10px] opacity-80 font-medium">Hệ thống bị kẹt (Gridlock)</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Continuous View */}
        {(mode === 'CONTINUOUS' || mode === 'DUAL') && (
          <div className="space-y-4">
            {mode === 'DUAL' && <h3 className="text-center font-bold text-slate-400 uppercase text-[10px] tracking-widest">Mô hình Liên tục</h3>}
            <div className="relative aspect-[4/3] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-300/40 border border-slate-200 group">
              <canvas ref={canvasContRef} width={800} height={600} className="w-full h-full object-contain" />
              
              <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none">
                <div className="flex items-center gap-3 bg-white/80 px-3 py-2 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-sm shadow-red-200" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Nhóm A</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 px-3 py-2 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
                  <div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-sm shadow-blue-200" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Nhóm B</span>
                </div>
              </div>

              <AnimatePresence>
                {!isRunning.continuous && iterations.continuous > 0 && unhappyCount.continuous === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="absolute inset-x-0 bottom-10 mx-auto w-fit bg-emerald-600 text-white px-8 py-4 rounded-3xl font-bold shadow-2xl shadow-emerald-200 flex items-center gap-3 text-sm z-10"
                  >
                    <ShieldCheck size={20} />
                    Cân bằng (Liên tục)
                  </motion.div>
                )}
                {oscillationDetected.continuous && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="absolute inset-x-0 bottom-10 mx-auto w-fit bg-amber-600 text-white px-8 py-4 rounded-3xl font-bold shadow-2xl shadow-amber-200 flex flex-col items-center gap-1 text-sm z-10"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={20} />
                      Phát hiện Dao động (Liên tục)
                    </div>
                    <span className="text-[10px] opacity-80 font-medium">Không có sự cải thiện sau 50 bước</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
        <Info size={14} className="text-slate-300" />
        <span>
          {mode === 'DUAL' 
            ? 'So sánh song song hai phương pháp mô phỏng với cùng các tham số cơ bản.' 
            : (mode === 'CONTINUOUS' ? 'Mô hình không gian liên tục sử dụng chỉ mục không gian KD-Tree.' : 'Mô hình lưới rời rạc sử dụng logic lân cận Moore.')}
        </span>
      </div>
    </div>
  );
};
