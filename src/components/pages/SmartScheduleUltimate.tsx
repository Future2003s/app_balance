"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  Droplet,
  Moon,
  Sun,
  Briefcase,
  Utensils,
  Home,
  Activity,
  Zap,
  Coffee,
  Shield,
  Smile,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChefHat,
  Sunrise,
  Sunset,
  Egg,
  Milk,
  Leaf,
  Scissors,
  Wind,
  Anchor,
  Fan,
  Sofa,
  ShowerHead,
} from "lucide-react";

type ViewMode =
  | "focus"
  | "list"
  | "master"
  | "breakfast"
  | "lunch"
  | "dinner"
  | "hair";

type ScheduleItem = {
  start: string;
  end: string;
  title: string;
  icon: React.ReactElement<{ className?: string }>;
  phase: string;
  details: string[];
  tags: string[];
};

// --- 1. DỮ LIỆU LỊCH TRÌNH ---
const flatSchedule: ScheduleItem[] = [
  {
    start: "06:00",
    end: "06:05",
    title: "Thức dậy & Hydrat hóa",
    icon: <Zap className="text-yellow-500" />,
    phase: "Sáng Tốc Độ",
    details: ["Uống 300ml nước từng ngụm", "Vươn vai giãn xương"],
    tags: ["Thải muối"],
  },
  {
    start: "06:05",
    end: "06:20",
    title: "Vệ sinh & Face Gym",
    icon: <Smile className="text-pink-500" />,
    phase: "Sáng Tốc Độ",
    details: ["Massage nâng cơ + Rửa mặt", "Đặt lưỡi Mewing ngay"],
    tags: ["V-Line"],
  },
  {
    start: "06:20",
    end: "06:40",
    title: "Bữa sáng Tăng trưởng",
    icon: <Utensils className="text-green-600 dark:text-green-400" />,
    phase: "Sáng Tốc Độ",
    details: ["2 Trứng + Sữa không đường", "Uống D3K2 ngay sau ăn"],
    tags: ["Protein", "D3K2"],
  },
  {
    start: "06:40",
    end: "06:55",
    title: "Thay đồ & Chuẩn bị",
    icon: <Shield className="text-gray-600 dark:text-gray-400" />,
    phase: "Sáng Tốc Độ",
    details: ["Ưỡn ngực, thẳng lưng trước gương"],
    tags: ["Posture"],
  },
  {
    start: "06:55",
    end: "07:00",
    title: "Di chuyển đi làm",
    icon: <Briefcase className="text-blue-600 dark:text-blue-400" />,
    phase: "Sáng Tốc Độ",
    details: ["Đội mũ bảo hiểm sạch", "Giữ thẳng lưng khi lái xe"],
    tags: ["3 Phút"],
  },

  {
    start: "07:00",
    end: "11:15",
    title: "Làm việc Ca Sáng",
    icon: <Briefcase className="text-blue-500" />,
    phase: "Làm Việc & Nghỉ Trưa",
    details: ["Mỗi 45p đứng dậy vươn vai", "Ra đón nắng 5p lúc giải lao"],
    tags: ["Deep Work", "Chống gù"],
  },
  {
    start: "11:15",
    end: "11:45",
    title: "Ăn trưa (Sớm)",
    icon: <Utensils className="text-orange-500" />,
    phase: "Làm Việc & Nghỉ Trưa",
    details: ["Ăn rau trước, không chan nước kho", "Nhai kỹ đều 2 hàm"],
    tags: ["No Salt", "Tiêu hóa"],
  },
  {
    start: "11:45",
    end: "12:30",
    title: "Ngủ trưa",
    icon: <Moon className="text-indigo-500 dark:text-indigo-400" />,
    phase: "Làm Việc & Nghỉ Trưa",
    details: ["Kê gối cổ chữ U", "Không gục đầu lên tay"],
    tags: ["45 Phút", "Cột sống"],
  },
  {
    start: "12:30",
    end: "13:10",
    title: "Thư giãn / Tự học",
    icon: <Coffee className="text-amber-700 dark:text-amber-500" />,
    phase: "Làm Việc & Nghỉ Trưa",
    details: ["Đọc sách/Nghe nhạc", "Uống 1 cốc nước lớn"],
    tags: ["Mental", "Hydrate"],
  },
  {
    start: "13:10",
    end: "18:00",
    title: "Làm việc Ca Chiều",
    icon: <Briefcase className="text-slate-600 dark:text-slate-400" />,
    phase: "Làm Việc",
    details: ["Ca dài: Uống nước đều đặn", "Kiểm tra Mewing liên tục"],
    tags: ["Mewing", "Focus"],
  },

  // --- GIAI ĐOẠN 3: TỐI ---
  {
    start: "18:00",
    end: "18:05",
    title: "Tan làm & Về nhà",
    icon: <Home className="text-emerald-600 dark:text-emerald-400" />,
    phase: "Nạp Năng Lượng",
    details: ["Về nhà rửa chân tay mặt mũi qua loa", "Chuẩn bị ăn ngay"],
    tags: ["Vệ sinh nhanh"],
  },
  {
    start: "18:05",
    end: "18:40",
    title: "ĂN TỐI (Quan Trọng)",
    icon: <Utensils className="text-green-700 dark:text-green-500" />,
    phase: "Nạp Năng Lượng",
    details: ["Ăn no đủ chất để có sức tập", "Không ăn mặn (tránh tích nước)"],
    tags: ["No Salt", "Energy"],
  },
  {
    start: "18:40",
    end: "20:00",
    title: "Tiêu hóa & Giải trí",
    icon: <Sofa className="text-purple-500 dark:text-purple-400" />,
    phase: "Tiêu Hóa",
    details: [
      "Ngồi nghỉ, xem phim, lướt web",
      "Tuyệt đối không vận động mạnh lúc này",
    ],
    tags: ["Digestion", "Free"],
  },
  {
    start: "20:00",
    end: "20:10",
    title: "Khởi động (Warmup)",
    icon: <Zap className="text-orange-500" />,
    phase: "Thể Chất",
    details: ["Xoay kỹ cổ tay cổ chân", "Thay đồ tập"],
    tags: ["Ready"],
  },
  {
    start: "20:10",
    end: "20:50",
    title: "TẬP LUYỆN (Hết mình)",
    icon: <Activity className="text-red-600 dark:text-red-500" />,
    phase: "Thể Chất",
    details: ["Nhảy dây cường độ cao", "Đu xà giãn xương cuối buổi"],
    tags: ["Xương", "Growth"],
  },
  {
    start: "20:50",
    end: "21:00",
    title: "Nghỉ ráo mồ hôi",
    icon: <Wind className="text-teal-500" />,
    phase: "Phục Hồi",
    details: [
      "Đi lại nhẹ nhàng, hít thở sâu",
      "Không ngồi quạt thốc thẳng vào người",
    ],
    tags: ["Cool down"],
  },
  {
    start: "21:00",
    end: "21:30",
    title: "TẮM GỘI & Dưỡng Tóc",
    icon: <ShowerHead className="text-cyan-500 dark:text-cyan-400" />,
    phase: "Vệ Sinh",
    details: ["Nước ấm. Gội sạch mồ hôi dầu.", "Xả tóc & Sấy khô ngay lập tức"],
    tags: ["Clean", "Hair Care"],
  },
  {
    start: "21:30",
    end: "21:45",
    title: "Chuẩn bị ngủ",
    icon: <Moon className="text-purple-400" />,
    phase: "Giấc Ngủ",
    details: ["Massage quai hàm", "Uống sữa ấm không đường (Bù Canxi)"],
    tags: ["GH Boost"],
  },
  {
    start: "21:45",
    end: "22:00",
    title: "Vào giường",
    icon: <Fan className="text-teal-500" />,
    phase: "Giấc Ngủ",
    details: ["Quạt thổi vào chân", "Phòng tối om"],
    tags: ["Fan Rule", "Mewing"],
  },
  {
    start: "22:00",
    end: "06:00",
    title: "Ngủ Sâu",
    icon: <Moon className="text-indigo-950 dark:text-indigo-200" />,
    phase: "Giấc Ngủ",
    details: ["Ngủ thẳng giấc để cao lên", "Thở mũi"],
    tags: ["Growth"],
  },
];

// --- 2. HÀM XỬ LÝ THỜI GIAN ---
const getMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const getCurrentTimeMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

// --- 3. COMPONENT CON: THẺ TAG ---
const Tag = ({ text }: { text: string }) => {
  let colorClass =
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
  if (["V-Line", "No Salt", "Face", "Mewing"].includes(text))
    colorClass =
      "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300";
  if (["Protein", "D3K2", "K2", "GH Boost", "Energy"].includes(text))
    colorClass =
      "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300";
  if (["Growth", "Xương", "Cột sống", "Ready"].includes(text))
    colorClass =
      "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
  if (["Deep Work", "Kỷ luật", "3 Phút", "Vệ sinh nhanh"].includes(text))
    colorClass =
      "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
  if (["Hair Care", "Clean", "Cool down", "Fan Rule"].includes(text))
    colorClass =
      "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300";

  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded mr-2 mb-2 inline-block ${colorClass} border border-transparent`}
    >
      {text}
    </span>
  );
};

// --- 4. COMPONENT CHÍNH ---
export default function SmartScheduleFinalLogic() {
  const [viewMode, setViewMode] = useState<ViewMode>("focus");
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(-1);
  const [progress, setProgress] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const nowMins = getCurrentTimeMinutes();

      let foundIndex = -1;
      if (nowMins >= getMinutes("22:00") || nowMins < getMinutes("06:00")) {
        foundIndex = flatSchedule.length - 1;
      } else {
        foundIndex = flatSchedule.findIndex((item) => {
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

  const currentEvent =
    currentEventIndex !== -1 ? flatSchedule[currentEventIndex] : null;

  // --- RENDERERS ---
  const renderFocusMode = () => {
    if (!currentEvent)
      return (
        <div className="p-10 text-center dark:text-white">
          Đang tải lịch trình...
        </div>
      );
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border-2 border-blue-500 dark:border-blue-600 relative transition-colors duration-300">
          <div
            className="absolute top-0 left-0 h-1.5 bg-blue-500 dark:bg-blue-400 transition-all duration-1000 ease-linear z-10"
            style={{ width: `${progress}%` }}
          ></div>
          <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 flex justify-between items-start transition-colors duration-300">
            <div>
              <div className="text-blue-100 font-bold tracking-widest text-xs uppercase mb-1 opacity-80">
                ĐANG DIỄN RA
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight">
                {currentEvent.title}
              </h2>
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              {React.cloneElement(currentEvent.icon, {
                className: "w-8 h-8 text-white",
              })}
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center text-4xl font-mono font-bold text-slate-800 dark:text-slate-100 mb-6">
              {currentEvent.start}{" "}
              <span className="mx-3 text-slate-300 dark:text-slate-600 text-2xl font-normal">
                đến
              </span>{" "}
              {currentEvent.end}
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Nhiệm vụ cần làm:
              </h3>
              <ul className="space-y-3">
                {currentEvent.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex items-start text-lg text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              {currentEvent.tags.map((tag, idx) => (
                <Tag key={idx} text={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="space-y-3">
      {flatSchedule.map((item, index) => {
        const isActive = index === currentEventIndex;
        return (
          <div
            key={index}
            className={`flex items-center p-3 md:p-4 rounded-lg border transition-all ${
              isActive
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 shadow-md scale-[1.01]"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <div className="w-16 md:w-20 font-mono font-bold text-slate-600 dark:text-slate-400 text-xs md:text-sm flex-shrink-0">
              {item.start}
            </div>
            <div className="mr-3 md:mr-4 p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
              {React.cloneElement(item.icon, {
                className: "w-4 h-4 md:w-5 md:h-5",
              })}
            </div>
            <div className="flex-grow min-w-0">
              <h4
                className={`font-bold text-sm md:text-base truncate ${
                  isActive
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {item.details[0]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderMasterView = () => (
    <div className="space-y-0 relative pl-2">
      {flatSchedule.map((item, index) => {
        const isNewPhase =
          index === 0 || item.phase !== flatSchedule[index - 1].phase;
        const isActive = index === currentEventIndex;
        return (
          <div key={index}>
            {isNewPhase && (
              <div className="sticky top-0 z-20 py-4 bg-slate-100 dark:bg-slate-950">
                <div className="bg-slate-800 dark:bg-slate-700 text-white py-1.5 px-4 rounded shadow-md inline-block text-xs font-extrabold uppercase tracking-widest border border-slate-700 dark:border-slate-600">
                  {item.phase}
                </div>
              </div>
            )}
            <div
              className={`relative border-l-2 ml-4 pl-6 pb-8 ${
                isActive
                  ? "border-blue-500"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            >
              <div
                className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 ${
                  isActive
                    ? "bg-blue-500 border-blue-200 dark:border-blue-800"
                    : "bg-slate-200 dark:bg-slate-700 border-white dark:border-slate-900"
                }`}
              ></div>
              <div
                className={`text-sm font-mono font-bold mb-1 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-500"
                }`}
              >
                {item.start} - {item.end}
              </div>
              <div
                className={`p-4 rounded-lg border ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className={`font-bold text-lg ${
                      isActive
                        ? "text-blue-800 dark:text-blue-200"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-md">
                    {React.cloneElement(item.icon, { className: "w-4 h-4" })}
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {item.details.map((detail, dIdx) => (
                    <p
                      key={dIdx}
                      className="text-sm text-slate-600 dark:text-slate-400 flex items-start"
                    >
                      <span className="mr-2 mt-1 w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                      {detail}
                    </p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, tIdx) => (
                    <Tag key={tIdx} text={tag} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // --- CÁC CHẾ ĐỘ ĂN UỐNG CHI TIẾT ---
  const renderBreakfastMode = () => (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="bg-yellow-500 dark:bg-yellow-700 text-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex items-center mb-2">
          <Sunrise className="w-8 h-8 mr-3" />
          <h2 className="text-2xl font-extrabold uppercase">
            Chiến thuật Bữa Sáng
          </h2>
        </div>
        <p className="opacity-90 font-medium">
          Khởi động năng lượng & Kích hoạt chiều cao.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" /> CÔNG THỨC
            &quot;TĂNG TRƯỞNG&quot;
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-yellow-100 text-yellow-700 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0">
                1
              </div>
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">
                  Trứng (Lòng đỏ)
                </strong>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Nguồn D3 & K2 tự nhiên tốt nhất.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-700 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0">
                2
              </div>
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">
                  Sữa Không Đường
                </strong>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Nạp Canxi nguyên chất, không gây mụn.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <Utensils className="w-5 h-5 mr-2 text-blue-500" /> COMBO GỢI Ý
            (06:20)
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center">
              <Egg className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  2 Trứng Luộc/Ốp la
                </div>
                <div className="text-xs text-slate-500">Chín tới</div>
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center">
              <Milk className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  1 Ly Sữa Tươi
                </div>
                <div className="text-xs text-slate-500">Không đường</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLunchMode = () => (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="bg-orange-500 dark:bg-orange-700 text-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex items-center mb-2">
          <ChefHat className="w-8 h-8 mr-3" />
          <h2 className="text-2xl font-extrabold uppercase">
            Chiến thuật Bữa Trưa
          </h2>
        </div>
        <p className="opacity-90 font-medium">
          Nạp năng lượng bền bỉ & Giữ dáng.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-red-500" /> QUY TẮC &quot;ĂN
            NGƯỢC&quot;
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 text-green-700 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0">
                1
              </div>
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">
                  Rau xanh đầu tiên
                </strong>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Lớp lót chất xơ.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-100 text-orange-700 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0">
                2
              </div>
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">
                  Đạm (Thịt/Cá)
                </strong>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Xây cơ bắp.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" /> CHECKLIST
            &quot;NO SALT&quot;
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start text-slate-700 dark:text-slate-300 text-sm font-medium">
              <XCircle className="w-5 h-5 text-red-500 mr-2 shrink-0" />
              <span>KHÔNG chan nước thịt kho.</span>
            </li>
            <li className="flex items-start text-slate-700 dark:text-slate-300 text-sm font-medium">
              <XCircle className="w-5 h-5 text-red-500 mr-2 shrink-0" />
              <span>KHÔNG chấm thêm mắm.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderDinnerMode = () => (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="bg-indigo-600 dark:bg-indigo-900 text-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex items-center mb-2">
          <Sunset className="w-8 h-8 mr-3" />
          <h2 className="text-2xl font-extrabold uppercase">
            Chiến thuật Bữa Tối
          </h2>
        </div>
        <p className="opacity-90 font-medium">
          Phục hồi, V-Line & Tối ưu giấc ngủ.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <Smile className="w-5 h-5 mr-2 text-pink-500" /> QUY TẮC
            &quot;V-LINE&quot;
          </h3>
          <div className="space-y-4">
            <div className="flex items-start bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-500 mr-3 mt-0.5 shrink-0" />
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">
                  ĂN NHẠT TUYỆT ĐỐI
                </strong>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tránh sưng mặt.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-indigo-500 mr-3 mt-0.5 shrink-0" />
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">
                  ĂN SỚM (18:05)
                </strong>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Để bụng rỗng khi ngủ.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-green-500" /> SIÊU THỰC PHẨM TỐI
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center border border-slate-100 dark:border-slate-700">
              <div className="text-2xl mr-3">🍱</div>
              <div>
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Natto / Phô mai
                </div>
                <div className="text-xs text-slate-500">Vitamin K2</div>
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center border border-slate-100 dark:border-slate-700">
              <div className="text-2xl mr-3">🥦</div>
              <div>
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Rau Xanh Đậm
                </div>
                <div className="text-xs text-slate-500">Magie thư giãn</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- NEW: HAIR CARE MODE (TÓC NAM) ---
  const renderHairMode = () => (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="bg-teal-600 dark:bg-teal-800 text-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex items-center mb-2">
          <Scissors className="w-8 h-8 mr-3" />
          <h2 className="text-2xl font-extrabold uppercase">
            Chiến thuật Tóc Nam
          </h2>
        </div>
        <p className="opacity-90 font-medium">
          Sạch Gàu - Suôn Mượt - Thẳng Nếp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <Droplet className="w-5 h-5 mr-2 text-cyan-500" /> 1. GỘI & XẢ (QUAN
            TRỌNG)
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-teal-100 text-teal-700 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0">
                1
              </div>
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">
                  Không dùng móng tay
                </strong>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Chỉ dùng phần thịt ngón tay massage. Móng tay làm xước da đầu
                  → Gàu.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-teal-100 text-teal-700 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0">
                2
              </div>
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">
                  Dầu xả (Bắt buộc)
                </strong>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Nam giới hay bỏ qua bước này. Dầu xả giúp tóc mềm và thẳng
                  hơn.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-teal-100 text-teal-700 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0">
                3
              </div>
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">
                  Nước Mát/Ấm
                </strong>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tuyệt đối không gội nước nóng (Gây khô và gàu).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
              <Wind className="w-5 h-5 mr-2 text-blue-500" /> 2. SẤY TÓC THẲNG
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-slate-700 dark:text-slate-300 text-sm font-medium">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                <span>Sấy từ trên đỉnh đầu xuống (Theo chiều tóc mọc).</span>
              </li>
              <li className="flex items-start text-slate-700 dark:text-slate-300 text-sm font-medium">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                <span>Vừa sấy vừa dùng lược chải thẳng xuống.</span>
              </li>
              <li className="flex items-start text-slate-700 dark:text-slate-300 text-sm font-medium">
                <XCircle className="w-5 h-5 text-red-500 mr-2 shrink-0" />
                <span>Không sấy rối tung (Làm tóc xù).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
              <Anchor className="w-5 h-5 mr-2 text-gray-500" /> 3. DIỆT GÀU TẬN
              GỐC
            </h3>
            <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">
                  VỆ SINH MŨ BẢO HIỂM
                </strong>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Giặt lót mũ 1 tuần/lần. Đây là nguyên nhân số 1 gây nấm/gàu.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
              <Fan className="w-5 h-5 mr-2 text-teal-500" /> QUY TẮC NGỦ QUẠT
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-slate-700 dark:text-slate-300 text-sm font-medium">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                <span>
                  Hướng quạt vào tường hoặc phía chân. Tránh thốc thẳng vào mặt.
                </span>
              </li>
              <li className="flex items-start text-slate-700 dark:text-slate-300 text-sm font-medium">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                <span>
                  Vệ sinh cánh quạt thường xuyên để tránh bụi bẩn bay vào mũi
                  gây dị ứng.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen font-sans p-4 md:p-8 flex justify-center transition-colors duration-300 ${
        isDarkMode ? "dark bg-slate-950" : "bg-slate-100"
      }`}
    >
      <div className="w-full max-w-lg md:max-w-3xl">
        {/* Header Control - Responsive Grid */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
          <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 w-full justify-center md:justify-start">
            <button
              onClick={() => setViewMode("focus")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "focus"
                  ? "bg-slate-800 dark:bg-blue-600 text-white"
                  : "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700"
              }`}
            >
              Tập trung
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list"
                  ? "bg-slate-800 dark:bg-blue-600 text-white"
                  : "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700"
              }`}
            >
              Danh sách
            </button>
            <button
              onClick={() => setViewMode("master")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "master"
                  ? "bg-slate-800 dark:bg-blue-600 text-white"
                  : "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700"
              }`}
            >
              Chi tiết
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-600 mx-1 hidden md:block"></div>

            <button
              onClick={() => setViewMode("breakfast")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "breakfast"
                  ? "bg-yellow-500 text-white"
                  : "text-yellow-600 bg-yellow-50 dark:bg-slate-700 dark:text-yellow-400"
              }`}
            >
              Sáng
            </button>
            <button
              onClick={() => setViewMode("lunch")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "lunch"
                  ? "bg-orange-500 text-white"
                  : "text-orange-600 bg-orange-50 dark:bg-slate-700 dark:text-orange-400"
              }`}
            >
              Trưa
            </button>
            <button
              onClick={() => setViewMode("dinner")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "dinner"
                  ? "bg-indigo-500 text-white"
                  : "text-indigo-600 bg-indigo-50 dark:bg-slate-700 dark:text-indigo-400"
              }`}
            >
              Tối
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-600 mx-1 hidden md:block"></div>

            <button
              onClick={() => setViewMode("hair")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${
                viewMode === "hair"
                  ? "bg-teal-600 text-white"
                  : "text-teal-600 bg-teal-50 dark:bg-slate-700 dark:text-teal-400"
              }`}
            >
              <Scissors className="w-3 h-3 mr-1" /> Tóc
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-slate-600 dark:text-yellow-400"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Main Content */}
        {viewMode === "focus" && renderFocusMode()}
        {viewMode === "list" && renderListView()}
        {viewMode === "master" && renderMasterView()}
        {viewMode === "breakfast" && renderBreakfastMode()}
        {viewMode === "lunch" && renderLunchMode()}
        {viewMode === "dinner" && renderDinnerMode()}
        {viewMode === "hair" && renderHairMode()}

        {/* Footer Clock */}
        <div className="mt-8 text-center pb-10">
          <p className="text-slate-400 dark:text-slate-600 text-sm font-mono">
            {new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
