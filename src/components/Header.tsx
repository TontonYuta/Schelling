import React from 'react';
import { Move, Pause, Play, RotateCcw, Sliders, AlertTriangle } from 'lucide-react';
import { SimulationMode } from '../types';

interface HeaderProps {
  mode: SimulationMode;
  iterations: { continuous: number; grid: number };
  unhappyCount: { continuous: number; grid: number };
  calcTime: { continuous: number; grid: number };
  isRunning: { continuous: boolean; grid: boolean };
  oscillationDetected: { continuous: boolean; grid: boolean };
  onToggleRunning: () => void;
  onReset: () => void;
  onToggleControls: () => void;
  showControls: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  iterations,
  unhappyCount,
  calcTime,
  isRunning,
  oscillationDetected,
  onToggleRunning,
  onReset,
  onToggleControls,
  showControls,
}) => {
  const currentIterations = mode === 'DUAL' 
    ? `${iterations.grid} / ${iterations.continuous}` 
    : (mode === 'GRID' ? iterations.grid : iterations.continuous);

  const currentUnhappy = mode === 'DUAL' 
    ? `${unhappyCount.grid} / ${unhappyCount.continuous}` 
    : (mode === 'GRID' ? unhappyCount.grid : unhappyCount.continuous);

  const currentCalcTime = mode === 'DUAL'
    ? `${calcTime.grid.toFixed(1)} / ${calcTime.continuous.toFixed(1)}`
    : (mode === 'GRID' ? calcTime.grid.toFixed(1) : calcTime.continuous.toFixed(1));

  const isAnyRunning = mode === 'DUAL' 
    ? (isRunning.continuous && isRunning.grid) 
    : (mode === 'CONTINUOUS' ? isRunning.continuous : isRunning.grid);

  const hasUnhappy = (mode === 'DUAL' 
    ? (unhappyCount.grid + unhappyCount.continuous) 
    : (mode === 'GRID' ? unhappyCount.grid : unhappyCount.continuous)) > 0;

  const isOscillating = mode === 'DUAL'
    ? (oscillationDetected.continuous || oscillationDetected.grid)
    : (mode === 'CONTINUOUS' ? oscillationDetected.continuous : oscillationDetected.grid);

  return (
    <header className="bg-white/70 border-b border-slate-200 backdrop-blur-xl px-6 py-4 flex items-center justify-between z-20 shadow-sm sticky top-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Move size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Mô hình Schelling
          </h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Phòng Thí Nghiệm Mô Phỏng</p>
        </div>
        
        <div className="hidden md:flex items-center gap-6 ml-8 border-l border-slate-200 pl-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Vòng lặp</span>
            <span className="text-lg font-semibold text-slate-900 leading-none">{currentIterations}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Không hài lòng</span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-semibold leading-none ${hasUnhappy ? 'text-rose-500' : 'text-emerald-500'}`}>
                {currentUnhappy}
              </span>
              {isOscillating && (
                <AlertTriangle size={16} className="text-amber-500 animate-pulse" title="Phát hiện dao động" />
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tính toán (ms)</span>
            <span className="text-lg font-semibold text-slate-900 leading-none">{currentCalcTime}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex md:hidden flex-col items-end mr-2 text-[10px] font-bold">
          <span className="text-slate-400">ITR: {currentIterations}</span>
          <span className={hasUnhappy ? 'text-rose-500' : 'text-emerald-500'}>UNH: {currentUnhappy}</span>
        </div>
        
        {mode !== 'APPLICATIONS' && mode !== 'STATISTICS' && (
          <>
            <button
              onClick={onToggleRunning}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all active:scale-95 ${
                isAnyRunning 
                  ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' 
                  : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
              }`}
            >
              {isAnyRunning ? <Pause size={18} /> : <Play size={18} />}
              <span className="hidden sm:inline">{isAnyRunning ? 'Tạm dừng' : 'Bắt đầu'}</span>
            </button>
            
            <button
              onClick={onReset}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              title="Đặt lại mô phỏng"
            >
              <RotateCcw size={20} />
            </button>
          </>
        )}
        
        <button
          onClick={onToggleControls}
          className={`p-2.5 rounded-xl transition-all active:scale-95 lg:hidden ${
            showControls ? 'bg-indigo-100 text-indigo-600' : 'bg-white border border-slate-200 text-slate-600 shadow-sm'
          }`}
        >
          <Sliders size={20} />
        </button>
      </div>
    </header>
  );
};
