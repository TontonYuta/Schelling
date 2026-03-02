import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Move, Grid as GridIcon, Globe, Building2, BarChart3, BookOpen } from 'lucide-react';
import { SimulationMode } from '../types';

interface SidebarProps {
  mode: SimulationMode;
  setMode: (mode: SimulationMode) => void;
  showControls: boolean;
  setShowControls: (show: boolean) => void;
  isMobile: boolean;
  agentCount: number;
  setAgentCount: (val: number) => void;
  radius: number;
  setRadius: (val: number) => void;
  gridSize: number;
  setGridSize: (val: number) => void;
  occupancy: number;
  setOccupancy: (val: number) => void;
  tolerance: number;
  setTolerance: (val: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mode,
  setMode,
  showControls,
  setShowControls,
  isMobile,
  agentCount,
  setAgentCount,
  radius,
  setRadius,
  gridSize,
  setGridSize,
  occupancy,
  setOccupancy,
  tolerance,
  setTolerance,
}) => {
  const handleInputChange = (setter: (val: number) => void, val: string, min: number, max: number) => {
    const num = parseFloat(val);
    if (!isNaN(num)) setter(Math.min(max, Math.max(min, num)));
  };

  return (
    <AnimatePresence>
      {(showControls || !isMobile) && (
        <motion.aside
          initial={isMobile ? { y: '100%' } : { x: -340 }}
          animate={isMobile ? { y: 0 } : { x: 0 }}
          exit={isMobile ? { y: '100%' } : { x: -340 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className={`
            fixed lg:relative bottom-0 left-0 w-full lg:w-[340px] h-[75vh] lg:h-full 
            bg-white/90 lg:bg-white/40 backdrop-blur-2xl border-t lg:border-t-0 lg:border-r border-slate-200 
            z-30 flex flex-col shadow-2xl lg:shadow-none
          `}
        >
          <div className="p-8 overflow-y-auto flex-1 space-y-10">
            {/* Mode Switcher */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Chế độ mô phỏng</label>
              <div className="flex flex-col gap-2 p-1.5 bg-slate-200/50 rounded-2xl border border-slate-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('GRID')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      mode === 'GRID' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <GridIcon size={14} /> Lưới
                  </button>
                  <button
                    onClick={() => setMode('CONTINUOUS')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      mode === 'CONTINUOUS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Move size={14} /> Liên tục
                  </button>
                </div>
                <button
                  onClick={() => setMode('DUAL')}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'DUAL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Globe size={14} /> So sánh trực tiếp
                </button>
                <button
                  onClick={() => setMode('APPLICATIONS')}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'APPLICATIONS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Building2 size={14} /> Ứng dụng thực tế
                </button>
                <button
                  onClick={() => setMode('STATISTICS')}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'STATISTICS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <BarChart3 size={14} /> Thống kê & So sánh
                </button>
                <button
                  onClick={() => setMode('ALGORITHM')}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'ALGORITHM' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <BookOpen size={14} /> Thuật toán sử dụng
                </button>
              </div>
            </div>

            {mode !== 'APPLICATIONS' && mode !== 'STATISTICS' && mode !== 'ALGORITHM' && (
              <div className="space-y-8">
                <div className="pb-4 border-b border-slate-200/60">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Thông số</h3>
                  <p className="text-xs text-slate-400">Điều chỉnh các biến của mô hình.</p>
                </div>

                {(mode === 'CONTINUOUS' || mode === 'DUAL') && (
                  <div className="space-y-6 pt-2">
                    {mode === 'DUAL' && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Move size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Mô hình Liên tục</span>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-600">Số lượng tác tử (N)</label>
                        <input
                          type="number" value={agentCount}
                          onChange={(e) => handleInputChange(setAgentCount, e.target.value, 100, 10000)}
                          className="w-20 text-xs font-bold bg-white px-3 py-1.5 rounded-lg text-indigo-600 border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:outline-none shadow-sm"
                        />
                      </div>
                      <input
                        type="range" min="500" max="10000" step="100" value={agentCount}
                        onChange={(e) => setAgentCount(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-600">Bán kính lân cận (R)</label>
                        <input
                          type="number" value={radius}
                          onChange={(e) => handleInputChange(setRadius, e.target.value, 5, 200)}
                          className="w-20 text-xs font-bold bg-white px-3 py-1.5 rounded-lg text-indigo-600 border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:outline-none shadow-sm"
                        />
                      </div>
                      <input
                        type="range" min="10" max="100" step="1" value={radius}
                        onChange={(e) => setRadius(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                )}

                {(mode === 'GRID' || mode === 'DUAL') && (
                  <div className="space-y-6 pt-2">
                    {mode === 'DUAL' && (
                      <div className="flex items-center gap-2 text-red-600 border-t border-slate-100 pt-6">
                        <GridIcon size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Mô hình Lưới</span>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-600">Kích thước lưới</label>
                        <input
                          type="number" value={gridSize}
                          onChange={(e) => handleInputChange(setGridSize, e.target.value, 10, 150)}
                          className="w-20 text-xs font-bold bg-white px-3 py-1.5 rounded-lg text-indigo-600 border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:outline-none shadow-sm"
                        />
                      </div>
                      <input
                        type="range" min="20" max="100" step="5" value={gridSize}
                        onChange={(e) => setGridSize(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-600">Mật độ chiếm chỗ (%)</label>
                        <input
                          type="number" value={(occupancy * 100).toFixed(0)}
                          onChange={(e) => handleInputChange((v) => setOccupancy(v / 100), e.target.value, 1, 99)}
                          className="w-20 text-xs font-bold bg-white px-3 py-1.5 rounded-lg text-indigo-600 border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:outline-none shadow-sm"
                        />
                      </div>
                      <input
                        type="range" min="0.1" max="0.95" step="0.05" value={occupancy}
                        onChange={(e) => setOccupancy(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-600">Ngưỡng hài lòng (%)</label>
                    <input
                      type="number" value={(tolerance * 100).toFixed(0)}
                      onChange={(e) => handleInputChange((v) => setTolerance(v / 100), e.target.value, 0, 100)}
                      className="w-20 text-xs font-bold bg-white px-3 py-1.5 rounded-lg text-indigo-600 border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:outline-none shadow-sm"
                    />
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05" value={tolerance}
                    onChange={(e) => setTolerance(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-slate-50/50 border-t border-slate-200">
            <button 
              onClick={() => setShowControls(false)}
              className="lg:hidden w-full py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all"
            >
              Đóng cài đặt
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
