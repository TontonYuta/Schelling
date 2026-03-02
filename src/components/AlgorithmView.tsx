import React from 'react';
import { BookOpen, Grid as GridIcon, Move, Target, Zap } from 'lucide-react';

export const AlgorithmView: React.FC = () => {
  return (
    <section className="w-full max-w-5xl space-y-16 pb-24 p-6 md:p-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
          <BookOpen size={32} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Thuật toán Schelling</h2>
        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
          Khám phá cơ chế toán học đằng sau sự phân tách xã hội thông qua hai biến thể của mô hình Schelling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Grid Algorithm Card */}
        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <GridIcon size={120} />
          </div>
          
          <div className="space-y-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <GridIcon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Mô hình Lưới (Grid)</h3>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Đây là mô hình nguyên bản được Thomas Schelling đề xuất năm 1971. Không gian được chia thành các ô lưới rời rạc.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 text-red-500"><Target size={18} /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Lân cận Moore</h4>
                  <p className="text-xs text-slate-500 mt-1">Mỗi tác tử xem xét 8 ô xung quanh trực tiếp để đánh giá mức độ hài lòng.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 text-red-500"><Move size={18} /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Di chuyển rời rạc</h4>
                  <p className="text-xs text-slate-500 mt-1">Nếu không hài lòng, tác tử sẽ tìm một ô trống ngẫu nhiên trong lưới để chuyển đến.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 text-red-500"><Zap size={18} /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Đặc điểm</h4>
                  <p className="text-xs text-slate-500 mt-1">Mô phỏng cấu trúc đô thị dạng bàn cờ, phù hợp với các khu phố có ranh giới rõ ràng.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continuous Algorithm Card */}
        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Move size={120} />
          </div>

          <div className="space-y-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Move size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Mô hình Liên tục</h3>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Một biến thể hiện đại hơn, nơi các tác tử tồn tại trong không gian 2D không giới hạn bởi các ô lưới cố định.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 text-blue-500"><Target size={18} /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Bán kính lân cận (R)</h4>
                  <p className="text-xs text-slate-500 mt-1">Sử dụng khoảng cách Euclidean để xác định tất cả tác tử trong vòng tròn bán kính R.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 text-blue-500"><Move size={18} /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Tọa độ thực</h4>
                  <p className="text-xs text-slate-500 mt-1">Tác tử có thể di chuyển đến bất kỳ vị trí (x, y) nào trên mặt phẳng.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 text-blue-500"><Zap size={18} /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Đặc điểm</h4>
                  <p className="text-xs text-slate-500 mt-1">Mô phỏng sự tương tác tự do hơn, thường dẫn đến các cụm (clusters) có hình dạng tự nhiên hơn.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-12 rounded-[3rem] space-y-8">
        <h3 className="text-2xl font-bold text-center">Công thức Hài lòng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-mono text-indigo-400">f = nₛ / nₜ</div>
            <p className="text-sm text-slate-400">Tỷ lệ đồng loại</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-px w-12 bg-slate-700 hidden md:block" />
            <div className="px-4 py-2 border border-slate-700 rounded-full text-xs font-bold uppercase tracking-widest">So sánh với</div>
            <div className="h-px w-12 bg-slate-700 hidden md:block" />
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-mono text-emerald-400">τ (Tolerance)</div>
            <p className="text-sm text-slate-400">Ngưỡng chấp nhận</p>
          </div>
        </div>
        <p className="text-center text-slate-400 text-sm max-w-xl mx-auto">
          Nếu <span className="text-white font-bold">f ≥ τ</span>, tác tử hài lòng và đứng yên. 
          Nếu <span className="text-white font-bold">f &lt; τ</span>, tác tử sẽ di chuyển tìm nơi ở mới.
        </p>
      </div>

      {/* KD-Tree Optimization Section */}
      <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-slate-200 shadow-sm space-y-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase tracking-widest">
              <Zap size={14} /> Hiệu năng tối đa
            </div>
            <h3 className="text-3xl font-bold text-slate-900">Tối ưu hóa với KD-Tree</h3>
            <p className="text-slate-600 leading-relaxed">
              Trong mô phỏng liên tục với 10,000 tác tử, việc kiểm tra khoảng cách giữa mọi cặp tác tử (Brute-force) sẽ tốn 100 triệu phép tính mỗi vòng lặp. Chúng tôi sử dụng cấu trúc dữ liệu <strong>KD-Tree (k-dimensional tree)</strong> để giảm thiểu khối lượng tính toán này.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Độ phức tạp Xây dựng</h4>
                <div className="text-2xl font-mono text-indigo-600">O(N log N)</div>
                <p className="text-xs text-slate-500 mt-2">Phân chia không gian thành các vùng phân cấp dựa trên tọa độ X và Y.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Độ phức tạp Truy vấn</h4>
                <div className="text-2xl font-mono text-emerald-600">O(log N)</div>
                <p className="text-xs text-slate-500 mt-2">Tìm kiếm hàng xóm trong bán kính R bằng cách loại bỏ các nhánh cây không liên quan.</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-sm aspect-square bg-slate-50 rounded-3xl border border-slate-200 p-8 flex items-center justify-center relative overflow-hidden">
            {/* Visual representation of KD-Tree partitioning */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-20">
              <div className="border-r border-b border-slate-400"></div>
              <div className="border-b border-slate-400"></div>
              <div className="border-r border-slate-400"></div>
              <div></div>
            </div>
            <div className="relative z-10 text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-slate-200 mx-auto flex items-center justify-center">
                <Zap size={40} className="text-amber-500" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900">Xử lý 10,000+</p>
                <p className="text-xs text-slate-500">Tác tử trong thời gian thực</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Comparison Section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-bold text-slate-900">So sánh hai mô hình</h3>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Tại sao mô hình Lưới thường mất nhiều thời gian hơn để đạt đến trạng thái cân bằng so với mô hình Liên tục?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <Target size={24} />
            </div>
            <h4 className="font-bold text-slate-900">Giới hạn lân cận</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Trong <strong>Lưới</strong>, số lân cận tối đa là 8. Ở các góc hoặc cạnh, con số này còn ít hơn. Điều này khiến việc đạt ngưỡng hài lòng (ví dụ 60%) trở nên cực kỳ khó khăn ở các vùng biên.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Move size={24} />
            </div>
            <h4 className="font-bold text-slate-900">Áp lực không gian</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mô hình <strong>Lưới</strong> bị giới hạn bởi các ô trống. Khi mật độ cao, tác tử có rất ít lựa chọn để di chuyển. Trong khi đó, mô hình <strong>Liên tục</strong> có vô số vị trí (x, y) khả thi.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h4 className="font-bold text-slate-900">Khả năng nén</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ở mô hình <strong>Liên tục</strong>, các tác tử có thể "nén" lại gần nhau trong một bán kính R, dẫn đến số lượng lân cận thực tế có thể lớn hơn 8, giúp dễ dàng vượt qua ngưỡng hài lòng hơn.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <h4 className="text-xl font-bold text-slate-900">Kết luận thực nghiệm</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Mô hình <strong>Lưới</strong> mô phỏng sự phân tách trong một xã hội có cấu trúc cứng nhắc (như quy hoạch đô thị phân lô). Mô hình <strong>Liên tục</strong> mô phỏng sự tương tác tự do hơn. Sự "khó tính" của mô hình lưới phản ánh thực tế rằng trong một không gian hữu hạn và chia ô, sự phân tách diễn ra chậm chạp nhưng triệt để hơn.
              </p>
            </div>
            <div className="flex-shrink-0 flex gap-4">
              <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="text-xs text-slate-400 uppercase font-bold">Grid</div>
                <div className="text-lg font-bold text-red-500">Ổn định chậm</div>
              </div>
              <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="text-xs text-slate-400 uppercase font-bold">Continuous</div>
                <div className="text-lg font-bold text-blue-500">Hội tụ nhanh</div>
              </div>
            </div>
          </div>
        </div>

        {/* Limit Cycles Phenomenon Section */}
        <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Hiện tượng Dao động Vô hạn (Limit Cycles)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Thực nghiệm với lưới <span className="font-mono font-bold">N=20</span>, mật độ <span className="font-mono font-bold">85%</span> và ngưỡng <span className="font-mono font-bold">T=40%</span> cho thấy một nghịch lý: thời gian hội tụ có thể kéo dài bất thường (lên đến 3000 bước lặp) hoặc không bao giờ hội tụ.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span><strong>Sự khan hiếm vị trí:</strong> Với mật độ 85%, hệ thống chỉ có 15% ô trống. Một tác tử di chuyển có thể làm thay đổi cục diện của 8 người khác, biến người đang "hạnh phúc" thành "bất hạnh".</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span><strong>Tính nhạy cảm rời rạc:</strong> Tỷ lệ hài lòng thay đổi theo các bước nhảy lớn (ví dụ 3/8 lên 4/8). Một thay đổi nhỏ gây ra phản ứng dây chuyền "đuổi hình bắt bóng".</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Giải pháp kỹ thuật</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chúng tôi triển khai hàm <strong>Phát hiện Dao động (Oscillation Detection)</strong> bằng cách theo dõi lịch sử số lượng người không hạnh phúc. Nếu con số này không cải thiện sau 50 bước lặp, hệ thống sẽ tự động dừng để tránh vòng lặp vô tận.
              </p>
              <div className="p-4 bg-slate-900 rounded-xl font-mono text-[10px] text-indigo-300 overflow-x-auto">
                <pre>{`if (no_improvement_count >= patience) {
  return "Gridlock/Oscillation Detected";
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
