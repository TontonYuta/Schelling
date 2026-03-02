import React, { useMemo } from 'react';
import { Grid as GridIcon, Move, BarChart3, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, BarChart, Bar, Cell, Legend } from 'recharts';
import { HistoryPoint, ComparisonResult } from '../types';

interface StatisticsViewProps {
  history: HistoryPoint[];
  comparison: {
    continuous: ComparisonResult | null;
    grid: ComparisonResult | null;
  };
  isRunning: { continuous: boolean; grid: boolean };
  oscillationDetected: { continuous: boolean; grid: boolean };
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  history,
  comparison,
  isRunning,
  oscillationDetected,
}) => {
  const gridHistory = useMemo(() => history.filter(h => h.mode === 'GRID'), [history]);
  const continuousHistory = useMemo(() => history.filter(h => h.mode === 'CONTINUOUS'), [history]);

  // Prepare unified performance data for the combined chart
  const performanceData = useMemo(() => {
    const maxIteration = Math.max(
      ...gridHistory.map(h => h.iteration),
      ...continuousHistory.map(h => h.iteration),
      0
    );
    
    const data = [];
    for (let i = 0; i <= maxIteration; i++) {
      const grid = gridHistory.find(h => h.iteration === i);
      const continuous = continuousHistory.find(h => h.iteration === i);
      if (grid || continuous) {
        data.push({
          iteration: i,
          gridTime: grid?.calcTime,
          continuousTime: continuous?.calcTime
        });
      }
    }
    return data;
  }, [gridHistory, continuousHistory]);

  return (
    <section className="w-full max-w-5xl space-y-12 pb-12 p-6 md:p-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Thống kê & So sánh</h2>
        <p className="text-slate-500 text-base max-w-2xl">
          Phân tích hiệu suất và động lực của mô hình qua các lần chạy.
        </p>
      </div>

      {(oscillationDetected.continuous || oscillationDetected.grid) && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4 text-amber-800">
          <AlertTriangle className="shrink-0" size={24} />
          <div className="text-sm">
            <p className="font-bold">Cảnh báo: Phát hiện Dao động (Oscillation Detected)</p>
            <p className="opacity-80">
              {oscillationDetected.grid && "Mô hình Lưới đang bị kẹt trong vòng lặp vô hạn. "}
              {oscillationDetected.continuous && "Mô hình Liên tục không có sự cải thiện sau nhiều bước. "}
              Hệ thống đã tự động dừng để bảo vệ hiệu năng.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grid Progress Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <GridIcon size={20} />
            </div>
            <h3 className="font-bold text-slate-900">Tiến trình: Lưới</h3>
          </div>
          <div className="h-[250px] w-full">
            {gridHistory.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gridHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="iteration" hide />
                  <YAxis domain={[0, 100]} tick={{fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Line type="monotone" dataKey="happiness" stroke="#ef4444" strokeWidth={3} dot={false} name="Hài lòng (%)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                Chưa có dữ liệu mô phỏng lưới...
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 text-center italic">Biểu đồ hài lòng của mô hình Lưới.</p>
        </div>

        {/* Continuous Progress Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Move size={20} />
            </div>
            <h3 className="font-bold text-slate-900">Tiến trình: Liên tục</h3>
          </div>
          <div className="h-[250px] w-full">
            {continuousHistory.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={continuousHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="iteration" hide />
                  <YAxis domain={[0, 100]} tick={{fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Line type="monotone" dataKey="happiness" stroke="#3b82f6" strokeWidth={3} dot={false} name="Hài lòng (%)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                Chưa có dữ liệu mô phỏng liên tục...
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 text-center italic">Biểu đồ hài lòng của mô hình Liên tục.</p>
        </div>

        {/* Calculation Time Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <BarChart3 size={20} />
            </div>
            <h3 className="font-bold text-slate-900">Hiệu năng: Thời gian tính toán (ms)</h3>
          </div>
          <div className="h-[250px] w-full">
            {performanceData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="iteration" hide />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="gridTime" stroke="#ef4444" strokeWidth={2} dot={false} name="Lưới (ms)" connectNulls />
                  <Line type="monotone" dataKey="continuousTime" stroke="#3b82f6" strokeWidth={2} dot={false} name="Liên tục (ms)" connectNulls />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                Cần ít nhất 2 vòng lặp để hiển thị hiệu năng...
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 text-center italic">Thời gian xử lý mỗi bước (càng thấp càng tốt).</p>
        </div>

        {/* Comparison Performance Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <BarChart3 size={20} />
            </div>
            <h3 className="font-bold text-slate-900">So sánh kết quả cuối cùng</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { 
                  name: 'Liên tục', 
                  iterations: comparison.continuous?.iterations || 0, 
                  happiness: comparison.continuous?.finalHappiness || 0,
                  avgTime: comparison.continuous?.avgCalcTime || 0
                },
                { 
                  name: 'Lưới', 
                  iterations: comparison.grid?.iterations || 0, 
                  happiness: comparison.grid?.finalHappiness || 0,
                  avgTime: comparison.grid?.avgCalcTime || 0
                }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 12, fontWeight: 'bold'}} />
                <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" tick={{fontSize: 10}} label={{ value: 'Vòng lặp', angle: -90, position: 'insideLeft', style: {fontSize: 10} }} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{fontSize: 10}} label={{ value: 'Hài lòng (%)', angle: 90, position: 'insideRight', style: {fontSize: 10} }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Bar yAxisId="left" dataKey="iterations" name="Số vòng lặp" radius={[4, 4, 0, 0]}>
                  <Cell fill="#4f46e5" />
                  <Cell fill="#4f46e5" />
                </Bar>
                <Bar yAxisId="right" dataKey="happiness" name="Hài lòng cuối (%)" radius={[4, 4, 0, 0]}>
                  <Cell fill="#10b981" />
                  <Cell fill="#10b981" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 text-center italic">So sánh kết quả của lần chạy cân bằng gần nhất giữa hai chế độ.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thời gian TB (ms)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {comparison.continuous && comparison.grid 
                ? (comparison.continuous.avgCalcTime < comparison.grid.avgCalcTime ? 'Liên tục' : 'Lưới')
                : '--'}
            </span>
            <span className="text-xs text-slate-400">tối ưu hơn</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {comparison.continuous ? `LT: ${comparison.continuous.avgCalcTime.toFixed(1)}ms` : ''} 
            {comparison.grid ? ` | Lưới: ${comparison.grid.avgCalcTime.toFixed(1)}ms` : ''}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hài lòng tối đa</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {comparison.continuous && comparison.grid 
                ? (comparison.continuous.finalHappiness > comparison.grid.finalHappiness ? 'Liên tục' : 'Lưới')
                : '--'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {comparison.continuous ? `LT: ${comparison.continuous.finalHappiness.toFixed(1)}%` : ''} 
            {comparison.grid ? ` | Lưới: ${comparison.grid.finalHappiness.toFixed(1)}%` : ''}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vòng lặp trung bình</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {comparison.continuous && comparison.grid 
                ? ((comparison.continuous.iterations + comparison.grid.iterations) / 2).toFixed(0)
                : '--'}
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${
              (oscillationDetected.continuous || oscillationDetected.grid) 
                ? 'text-red-500' 
                : (isRunning.continuous || isRunning.grid) 
                  ? 'text-amber-500' 
                  : 'text-emerald-500'
            }`}>
              {oscillationDetected.continuous || oscillationDetected.grid 
                ? 'Bị kẹt' 
                : (isRunning.continuous || isRunning.grid) 
                  ? 'Đang chạy' 
                  : 'Sẵn sàng'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
