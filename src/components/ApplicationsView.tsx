import React from 'react';
import { motion } from 'motion/react';
import { Users, HeartPulse, Building2, Globe } from 'lucide-react';

export const ApplicationsView: React.FC = () => {
  const apps = [
    {
      title: 'Quy hoạch Đô thị',
      desc: 'Hiểu cách các khu dân cư tự tổ chức và ngăn chặn sự phân tách không mong muốn thông qua các chính sách nhà ở đa dạng.',
      icon: <Building2 className="text-indigo-600" />,
      color: 'bg-indigo-50',
    },
    {
      title: 'Xã hội học kĩ thuật số',
      desc: 'Nghiên cứu sự hình thành của các "phòng vang" (echo chambers) trên mạng xã hội và cách thuật toán gợi ý ảnh hưởng đến sự phân cực.',
      icon: <Globe className="text-emerald-600" />,
      color: 'bg-emerald-50',
    },
    {
      title: 'Y tế cộng đồng',
      desc: 'Phân tích sự lây lan của các thói quen sức khỏe trong mạng lưới xã hội dựa trên sự tương đồng và khoảng cách địa lý.',
      icon: <HeartPulse className="text-rose-600" />,
      color: 'bg-rose-50',
    },
    {
      title: 'Đa dạng nơi làm việc',
      desc: 'Mô phỏng các chiến lược tuyển dụng để xây dựng môi trường làm việc bao trùm và giảm thiểu các rào cản vô hình.',
      icon: <Users className="text-blue-600" />,
      color: 'bg-blue-50',
    },
  ];

  return (
    <section className="w-full max-w-5xl space-y-12 pb-12 p-6 md:p-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Ứng dụng trong thực tế</h2>
        <p className="text-slate-500 text-base max-w-2xl">
          Mô hình Schelling cung cấp những hiểu biết sâu sắc về cách các sở thích cá nhân dẫn đến các mô hình tập thể quy mô lớn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
          >
            <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              {React.cloneElement(app.icon as React.ReactElement, { size: 28 })}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{app.title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm">{app.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
