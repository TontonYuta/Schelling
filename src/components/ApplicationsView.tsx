import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Users, HeartPulse, Building2, Globe, Play, RotateCcw } from 'lucide-react';

interface MiniSimProps {
  tolerance: number;
  density: number;
  title: string;
}

const MiniSimulation: React.FC<MiniSimProps> = ({ tolerance, density }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const size = 12;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initGrid = () => {
    const newGrid = Array(size).fill(0).map(() => 
      Array(size).fill(0).map(() => {
        const r = Math.random();
        if (r < density) {
          return Math.random() < 0.5 ? 1 : 2;
        }
        return 0;
      })
    );
    setGrid(newGrid);
  };

  useEffect(() => {
    initGrid();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const step = () => {
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      const unhappy: [number, number][] = [];

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const agent = prev[y][x];
          if (agent === 0) continue;

          let neighbors = 0;
          let similar = 0;

          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
                const neighbor = prev[ny][nx];
                if (neighbor !== 0) {
                  neighbors++;
                  if (neighbor === agent) similar++;
                }
              }
            }
          }

          const similarity = neighbors === 0 ? 1 : similar / neighbors;
          if (similarity < tolerance) {
            unhappy.push([x, y]);
          }
        }
      }

      if (unhappy.length === 0) {
        setIsRunning(false);
        return prev;
      }

      const [ux, uy] = unhappy[Math.floor(Math.random() * unhappy.length)];
      const empty: [number, number][] = [];
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (prev[y][x] === 0) empty.push([x, y]);
        }
      }

      if (empty.length > 0) {
        const [ex, ey] = empty[Math.floor(Math.random() * empty.length)];
        next[ey][ex] = prev[uy][ux];
        next[uy][ux] = 0;
      }

      return next;
    });
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(step, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  return (
    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mô phỏng thu nhỏ</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isRunning ? <RotateCcw size={14} /> : <Play size={14} />}
          </button>
          <button 
            onClick={() => { setIsRunning(false); initGrid(); }}
            className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-1 aspect-square w-full max-w-[160px] mx-auto">
        {grid.map((row, y) => row.map((cell, x) => (
          <div 
            key={`${x}-${y}`} 
            className={`rounded-sm transition-colors duration-300 ${
              cell === 0 ? 'bg-slate-200' : cell === 1 ? 'bg-indigo-500' : 'bg-rose-500'
            }`}
          />
        )))}
      </div>
      <div className="mt-4 flex justify-between text-[10px] font-medium text-slate-400">
        <span>Mật độ: {Math.round(density * 100)}%</span>
        <span>Ngưỡng: {Math.round(tolerance * 100)}%</span>
      </div>
    </div>
  );
};

export const ApplicationsView: React.FC = () => {
  const apps = [
    {
      title: 'Quy hoạch Đô thị & Tipping Point',
      desc: 'Trong đô thị, hiện tượng "Tipping Point" xảy ra khi một khu vực vượt quá ngưỡng đa dạng nhất định, khiến nhóm đa số cảm thấy "không thoải mái" và rời đi hàng loạt, dẫn đến sự phân tách cực đoan.',
      details: 'Mô phỏng này cho thấy cách các khu dân cư từ hỗn hợp chuyển sang phân tách hoàn toàn chỉ với một thay đổi nhỏ trong sở thích cá nhân.',
      icon: <Building2 className="text-indigo-600" />,
      color: 'bg-indigo-50',
      tolerance: 0.4,
      density: 0.7,
    },
    {
      title: 'Mạng xã hội & Filter Bubbles',
      desc: 'Thuật toán gợi ý thường ưu tiên nội dung tương đồng. Điều này tạo ra các "phòng vang" nơi người dùng chỉ tiếp xúc với quan điểm giống mình, làm tăng sự phân cực xã hội.',
      details: 'Ở đây, các tác tử có ngưỡng tương đồng rất cao (70%), dẫn đến việc hình thành các cụm ý kiến biệt lập và không có sự giao thoa.',
      icon: <Globe className="text-emerald-600" />,
      color: 'bg-emerald-50',
      tolerance: 0.7,
      density: 0.6,
    },
    {
      title: 'Y tế & Social Contagion',
      desc: 'Các thói quen sức khỏe (như tập thể dục hay hút thuốc) có xu hướng lây lan qua mạng lưới bạn bè. Sự tương đồng về lối sống tạo ra các cụm hành vi trong cộng đồng.',
      details: 'Mô hình này minh họa cách các hành vi tích cực hoặc tiêu cực có thể tự củng cố trong một nhóm dân cư có mật độ tương tác cao.',
      icon: <HeartPulse className="text-rose-600" />,
      color: 'bg-rose-50',
      tolerance: 0.3,
      density: 0.8,
    },
    {
      title: 'Đa dạng & Tokenism',
      desc: 'Tại nơi làm việc, hiện tượng "Tokenism" xảy ra khi một cá nhân thuộc nhóm thiểu số cảm thấy bị cô lập. Nếu không có đủ đồng nghiệp tương đồng, họ có xu hướng rời bỏ tổ chức.',
      details: 'Mô phỏng với mật độ thấp cho thấy khó khăn của việc duy trì sự đa dạng nếu các cá nhân không tìm thấy sự hỗ trợ từ những người giống mình.',
      icon: <Users className="text-blue-600" />,
      color: 'bg-blue-50',
      tolerance: 0.2,
      density: 0.4,
    },
  ];

  return (
    <section className="w-full max-w-6xl space-y-12 pb-24 p-6 md:p-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Ứng dụng trong thực tế</h2>
        <p className="text-slate-500 text-lg max-w-3xl">
          Mô hình Schelling không chỉ là lý thuyết toán học; nó là công cụ mạnh mẽ để giải mã các hiện tượng xã hội phức tạp trong thế giới thực.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {apps.map((app, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group flex flex-col p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500"
          >
            <div className="flex-1">
              <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {React.cloneElement(app.icon as React.ReactElement, { size: 32 })}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{app.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">{app.desc}</p>
              <p className="text-slate-400 text-sm italic">{app.details}</p>
            </div>
            
            <MiniSimulation 
              tolerance={app.tolerance} 
              density={app.density} 
              title={app.title} 
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-16 p-12 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-bold mb-6">Kết luận cho Nhà hoạch định</h3>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Bài học lớn nhất từ Schelling là: **Sự phân tách không nhất thiết bắt nguồn từ sự thù ghét.** 
            Ngay cả khi mọi người đều mong muốn một môi trường đa dạng, chỉ cần một ưu tiên nhỏ cho sự tương đồng cũng có thể dẫn đến một xã hội bị chia cắt sâu sắc.
          </p>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-indigo-600 rounded-xl font-bold text-sm">Hiểu để thay đổi</div>
            <div className="px-6 py-3 bg-white/10 rounded-xl font-bold text-sm backdrop-blur-md">Kiến tạo tương lai</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>
    </section>
  );
};
