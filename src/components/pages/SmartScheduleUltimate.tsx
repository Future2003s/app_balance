"use client";

import React, { useState, useEffect } from 'react';
import { 
  Clock, Droplet, Moon, Sun, Briefcase, Utensils, 
  Home, Activity, Zap, Coffee, Shield, Smile, 
  ArrowRight, Layout, List, CheckCircle, FileText
} from 'lucide-react';

// --- 1. DỮ LIỆU LỊCH TRÌNH ---
const flatSchedule = [
  // GIAI ĐOẠN 1
  { start: "06:00", end: "06:05", title: "Thức dậy & Hydrat hóa", icon: <Zap className="text-yellow-500" />, phase: "Sáng Tốc Độ", details: ["Uống 300ml nước từng ngụm", "Vươn vai giãn xương"], tags: ["Thải muối"] },
  { start: "06:05", end: "06:20", title: "Vệ sinh & Face Gym", icon: <Smile className="text-pink-500" />, phase: "Sáng Tốc Độ", details: ["Massage nâng cơ + Rửa mặt", "Đặt lưỡi Mewing ngay"], tags: ["V-Line"] },
  { start: "06:20", end: "06:40", title: "Bữa sáng Tăng trưởng", icon: <Utensils className="text-green-600 dark:text-green-400" />, phase: "Sáng Tốc Độ", details: ["2 Trứng + Sữa không đường", "Uống D3K2 ngay sau ăn"], tags: ["Protein", "D3K2"] },
  { start: "06:40", end: "06:55", title: "Thay đồ & Chuẩn bị", icon: <Shield className="text-gray-600 dark:text-gray-400" />, phase: "Sáng Tốc Độ", details: ["Ưỡn ngực, thẳng lưng trước gương"], tags: ["Posture"] },
  { start: "06:55", end: "07:00", title: "Di chuyển đi làm", icon: <Briefcase className="text-blue-600 dark:text-blue-400" />, phase: "Sáng Tốc Độ", details: ["Di chuyển an toàn", "Giữ thẳng lưng khi lái xe"], tags: ["3 Phút"] },
  
  // GIAI ĐOẠN 2
  { start: "07:00", end: "11:15", title: "Làm việc Ca Sáng", icon: <Briefcase className="text-blue-500" />, phase: "Làm Việc & Nghỉ Trưa", details: ["Mỗi 45p đứng dậy vươn vai", "Ra đón nắng 5p lúc giải lao"], tags: ["Deep Work", "Chống gù"] },
  { start: "11:15", end: "11:45", title: "Ăn trưa (Sớm)", icon: <Utensils className="text-orange-500" />, phase: "Làm Việc & Nghỉ Trưa", details: ["Ăn rau trước, không chan nước kho", "Nhai kỹ đều 2 hàm"], tags: ["No Salt", "Tiêu hóa"] },
  { start: "11:45", end: "12:30", title: "Ngủ trưa", icon: <Moon className="text-indigo-500 dark:text-indigo-400" />, phase: "Làm Việc & Nghỉ Trưa", details: ["Kê gối cổ chữ U", "Không gục đầu lên tay"], tags: ["45 Phút", "Cột sống"] },
  { start: "12:30", end: "13:30", title: "Thư giãn / Tự học", icon: <Coffee className="text-amber-700 dark:text-amber-500" />, phase: "Làm Việc & Nghỉ Trưa", details: ["Đọc sách/Nghe nhạc", "Uống 1 cốc nước lớn"], tags: ["Mental", "Hydrate"] },
  { start: "13:30", end: "18:00", title: "Làm việc Ca Chiều", icon: <Briefcase className="text-slate-600 dark:text-slate-400" />, phase: "Làm Việc & Nghỉ Trưa", details: ["Kiểm tra Mewing liên tục", "Uống nước đều đặn"], tags: ["Mewing", "Habit"] },
  
  // GIAI ĐOẠN 3
  { start: "18:00", end: "18:05", title: "Về nhà", icon: <Home className="text-emerald-600 dark:text-emerald-400" />, phase: "Thể Chất & Dinh Dưỡng", details: ["Về ngay lập tức", "Thay đồ tập luôn"], tags: ["Kỷ luật"] },
  { start: "18:05", end: "18:30", title: "Chuẩn bị tập luyện", icon: <Zap className="text-red-400" />, phase: "Thể Chất & Dinh Dưỡng", details: ["Ăn nhẹ 1 quả chuối (nếu đói)", "Khởi động khớp"], tags: ["Warmup"] },
  { start: "18:30", end: "19:15", title: "Tập HIIT & Đu xà", icon: <Activity className="text-red-600 dark:text-red-500" />, phase: "Thể Chất & Dinh Dưỡng", details: ["Nhảy dây 500 cái tốc độ cao", "Treo xà 3 hiệp x 30s"], tags: ["Xương", "Growth"] },
  { start: "19:15", end: "19:45", title: "Tắm & Phục hồi", icon: <Droplet className="text-cyan-500 dark:text-cyan-400" />, phase: "Thể Chất & Dinh Dưỡng", details: ["Tắm nước ấm giãn cơ"], tags: ["Relax"] },
  { start: "19:45", end: "20:15", title: "Ăn tối (No Salt)", icon: <Utensils className="text-green-700 dark:text-green-500" />, phase: "Thể Chất & Dinh Dưỡng", details: ["Natto/Phô mai + Rau luộc", "TUYỆT ĐỐI KHÔNG ĂN MẶN"], tags: ["K2", "V-Line"] },
  
  // GIAI ĐOẠN 4
  { start: "20:15", end: "21:30", title: "Giải trí / Cá nhân", icon: <Smile className="text-purple-500 dark:text-purple-400" />, phase: "Giấc Ngủ Sinh Học", details: ["Thư giãn, không ánh sáng xanh quá nhiều"], tags: ["Free"] },
  { start: "21:30", end: "21:45", title: "Chuẩn bị ngủ", icon: <Moon className="text-purple-400" />, phase: "Giấc Ngủ Sinh Học", details: ["Massage quai hàm", "Uống sữa ấm không đường"], tags: ["GH Boost"] },
  { start: "21:45", end: "22:00", title: "Vào giường", icon: <Moon className="text-indigo-800 dark:text-indigo-300" />, phase: "Giấc Ngủ Sinh Học", details: ["Tắt đèn tối om", "Nằm ngửa thẳng chân tay"], tags: ["Deep Sleep"] },
  { start: "22:00", end: "06:00", title: "Ngủ Sâu", icon: <Moon className="text-indigo-950 dark:text-indigo-200" />, phase: "Giấc Ngủ Sinh Học", details: ["Thời gian vàng cho hormone tăng trưởng"], tags: ["Growth"] },
];

// --- 2. HÀM XỬ LÝ THỜI GIAN ---
const getMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const getCurrentTimeMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

// --- 3. COMPONENT CON: THẺ TAG ---
const Tag = ({ text }: { text: string }) => {
  let colorClass = "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
  
  if (["V-Line", "No Salt", "Face"].includes(text)) 
    colorClass = "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300";
  
  if (["Protein", "D3K2", "K2", "GH Boost"].includes(text)) 
    colorClass = "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300";
  
  if (["Growth", "Xương", "Cột sống", "Mewing"].includes(text)) 
    colorClass = "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
  
  if (["Deep Work", "Kỷ luật", "3 Phút"].includes(text)) 
    colorClass = "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";

  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded mr-2 mb-2 inline-block ${colorClass} border border-transparent`}>
      {text}
    </span>
  );
};

// --- 4. COMPONENT CHÍNH ---
export default function SmartScheduleUltimate() {
  const [viewMode, setViewMode] = useState<'focus' | 'list' | 'master'>('focus');
  const [currentTime, setCurrentTime] = useState(getCurrentTimeMinutes());
  const [currentEventIndex, setCurrentEventIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Xử lý Dark Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  // Cập nhật thời gian
  useEffect(() => {
    const timer = setInterval(() => {
      const nowMins = getCurrentTimeMinutes();
      setCurrentTime(nowMins);
      
      let foundIndex = -1;
      if (nowMins >= getMinutes("22:00") || nowMins < getMinutes("06:00")) {
         foundIndex = flatSchedule.length - 1; 
      } else {
        foundIndex = flatSchedule.findIndex(item => {
          const start = getMinutes(item.start);
          const end = getMinutes(item.end);
          return nowMins >= start && nowMins < end;
        });
      }
      
      setCurrentEventIndex(foundIndex);

      if (foundIndex !== -1) {
        const item = flatSchedule[foundIndex];
        let start = getMinutes(item.start);
        let end = getMinutes(item.end);
        
        if (end < start) end += 24 * 60; 
        let current = nowMins;
        if (current < start) current += 24 * 60;

        const duration = end - start;
        const elapsed = current - start;
        setProgress(Math.min(100, Math.max(0, (elapsed / duration) * 100)));
      }

    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const currentEvent = currentEventIndex !== -1 ? flatSchedule[currentEventIndex] : null;
  const nextEvent = currentEventIndex !== -1 
    ? flatSchedule[(currentEventIndex + 1) % flatSchedule.length] 
    : null;

  // --- RENDERERS ---

  // 1. VIEW TẬP TRUNG (FOCUS)
  const renderFocusMode = () => {
    if (!currentEvent) return <div className="p-10 text-center dark:text-white">Đang tải lịch trình...</div>;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border-2 border-blue-500 dark:border-blue-600 relative transition-colors duration-300">
          <div 
            className="absolute top-0 left-0 h-1.5 bg-blue-500 dark:bg-blue-400 transition-all duration-1000 ease-linear z-10"
            style={{ width: `${progress}%` }}
          ></div>
          
          <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 flex justify-between items-start transition-colors duration-300">
            <div>
              <div className="text-blue-100 font-bold tracking-widest text-xs uppercase mb-1 opacity-80">ĐANG DIỄN RA</div>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight">{currentEvent.title}</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              {React.cloneElement(currentEvent.icon, { className: "w-8 h-8 text-white" })}
            </div>
          </div>
          
          <div className="p-6 md:p-8 bg-white dark:bg-slate-800">
            <div className="flex items-center text-4xl font-mono font-bold text-slate-800 dark:text-slate-100 mb-6">
              {currentEvent.start} 
              <span className="mx-3 text-slate-300 dark:text-slate-600 text-2xl font-normal">đến</span> 
              {currentEvent.end}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Chi tiết thực hiện:</h3>
              <ul className="space-y-3">
                {currentEvent.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start text-lg text-slate-700 dark:text-slate-300 font-medium">
                    <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              {currentEvent.tags.map((tag, idx) => <Tag key={idx} text={tag} />)}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 opacity-90 hover:opacity-100 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
              <ArrowRight className="w-4 h-4 mr-1" /> Tiếp theo
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-mono font-bold">{nextEvent?.start}</span>
          </div>
          <div className="flex items-center">
            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm mr-4 border border-slate-100 dark:border-slate-600">
              {nextEvent && React.cloneElement(nextEvent.icon, { className: "w-5 h-5" })}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">{nextEvent?.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {nextEvent?.details.join(" • ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 2. VIEW DANH SÁCH (LIST)
  const renderListView = () => (
    <div className="space-y-3">
      {flatSchedule.map((item, index) => {
        const isActive = index === currentEventIndex;
        return (
          <div 
            key={index} 
            className={`flex items-center p-3 md:p-4 rounded-lg border transition-all ${
              isActive 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 shadow-md scale-[1.01]' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <div className="w-16 md:w-20 font-mono font-bold text-slate-600 dark:text-slate-400 text-xs md:text-sm flex-shrink-0">
              {item.start}
            </div>
            <div className="mr-3 md:mr-4 p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
              {React.cloneElement(item.icon, { className: "w-4 h-4 md:w-5 md:h-5" })}
            </div>
            <div className="flex-grow min-w-0">
              <h4 className={`font-bold text-sm md:text-base truncate ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{item.details[0]}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  // 3. VIEW CHI TIẾT (MASTER - GIỐNG HTML CŨ)
  const renderMasterView = () => (
    <div className="space-y-0 relative pl-2">
      {flatSchedule.map((item, index) => {
        const isNewPhase = index === 0 || item.phase !== flatSchedule[index - 1].phase;
        const isActive = index === currentEventIndex;

        return (
          <div key={index}>
            {/* Phase Header */}
            {isNewPhase && (
              <div className="sticky top-0 z-20 py-4 bg-slate-100 dark:bg-slate-950">
                 <div className="bg-slate-800 dark:bg-slate-700 text-white py-1.5 px-4 rounded shadow-md inline-block text-xs font-extrabold uppercase tracking-widest border border-slate-700 dark:border-slate-600">
                    {item.phase}
                 </div>
              </div>
            )}

            {/* Timeline Item */}
            <div className={`relative border-l-2 ml-4 pl-6 pb-8 ${isActive ? 'border-blue-500' : 'border-slate-300 dark:border-slate-700'}`}>
              
              {/* Dot */}
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 ${
                isActive 
                  ? 'bg-blue-500 border-blue-200 dark:border-blue-800' 
                  : 'bg-slate-200 dark:bg-slate-700 border-white dark:border-slate-900'
              }`}></div>

              {/* Time */}
              <div className={`text-sm font-mono font-bold mb-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-500'}`}>
                {item.start} - {item.end}
              </div>

              {/* Card Content */}
              <div className={`p-4 rounded-lg border ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-start justify-between mb-2">
                   <h3 className={`font-bold text-lg ${isActive ? 'text-blue-800 dark:text-blue-200' : 'text-slate-800 dark:text-slate-200'}`}>
                     {item.title}
                   </h3>
                   <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-md">
                     {React.cloneElement(item.icon, { className: "w-4 h-4" })}
                   </div>
                </div>

                <div className="space-y-1 mb-3">
                  {item.details.map((detail, dIdx) => (
                    <p key={dIdx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                       <span className="mr-2 mt-1 w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                       {detail}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1">
                   {item.tags.map((tag, tIdx) => <Tag key={tIdx} text={tag} />)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 flex justify-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div className="w-full max-w-lg md:max-w-3xl">
        
        {/* Header Control */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 w-full md:w-auto overflow-hidden">
            <button 
              onClick={() => setViewMode('focus')}
              className={`flex-1 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center ${
                viewMode === 'focus' 
                  ? 'bg-slate-800 dark:bg-blue-600 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Layout className="w-4 h-4 mr-2" />
              Tập trung
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex-1 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center ${
                viewMode === 'list' 
                  ? 'bg-slate-800 dark:bg-blue-600 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              Danh sách
            </button>
            <button 
              onClick={() => setViewMode('master')}
              className={`flex-1 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center ${
                viewMode === 'master' 
                  ? 'bg-slate-800 dark:bg-blue-600 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Chi tiết
            </button>
          </div>

          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-slate-600 dark:text-yellow-400 w-full md:w-auto flex justify-center"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Main Content */}
        {viewMode === 'focus' && renderFocusMode()}
        {viewMode === 'list' && renderListView()}
        {viewMode === 'master' && renderMasterView()}

        {/* Footer Clock */}
        <div className="mt-8 text-center pb-10">
            <p className="text-slate-400 dark:text-slate-600 text-sm font-mono">
                {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
            </p>
        </div>
      </div>
    </div>
  );
}

