"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface VietnameseDatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

// Nombres de meses en vietnamita
const MONTHS_VI = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

// Días de la semana en vietnamita
const WEEKDAYS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function VietnameseDatePicker({
  value,
  onChange,
  label,
  error,
  className,
  disabled,
  placeholder = "dd/mm/yyyy",
}: VietnameseDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const pickerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
    position: "above" | "below";
  } | null>(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setCurrentMonth(date);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      calculatePopupPosition();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const calculatePopupPosition = () => {
    if (!pickerRef.current) return;

    const rect = pickerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const popupHeight = 420; // Altura aproximada del popup
    const popupWidth = 320; // Ancho del popup (w-80 = 320px)
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top: number;
    let left: number;

    // Calcular posición vertical
    if (spaceAbove > spaceBelow && spaceAbove > popupHeight) {
      // Mostrar arriba
      top = rect.top - popupHeight - 8;
    } else {
      // Mostrar abajo
      top = rect.bottom + 8;
    }

    // Calcular posición horizontal (ajustar si no cabe)
    left = rect.left;
    if (left + popupWidth > viewportWidth) {
      // Si no cabe a la derecha, ajustar a la izquierda
      left = viewportWidth - popupWidth - 16;
    }
    if (left < 16) {
      // Si no cabe a la izquierda, ajustar al mínimo
      left = 16;
    }

    setPopupPosition({
      top,
      left,
      position: spaceAbove > spaceBelow ? "above" : "below",
    });
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange?.(formatDateForInput(date));
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange?.("");
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
    onChange?.(formatDateForInput(today));
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Días del mes anterior (para completar la primera semana)
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, daysInPrevMonth - i));
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Días del mes siguiente (para completar la última semana hasta 42 días totales)
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 semanas x 7 días = 42
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }

    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative" ref={pickerRef}>
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "w-full px-4 py-2.5 border rounded-lg cursor-pointer",
            "bg-white text-gray-900 border-gray-300",
            "hover:border-blue-400 hover:bg-blue-50",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "transition-colors duration-200",
            "flex items-center justify-between",
            disabled &&
              "bg-gray-100 cursor-not-allowed text-gray-500 opacity-50",
            error &&
              "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500",
            !error && "border-gray-300"
          )}
        >
          <span className={selectedDate ? "text-gray-900" : "text-gray-400"}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>

        {isOpen &&
          !disabled &&
          popupPosition &&
          typeof window !== "undefined" &&
          createPortal(
            <div
              ref={popupRef}
              className="fixed z-[9999] bg-white rounded-lg shadow-xl border-2 border-blue-200 p-4 w-80"
              style={{
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goToPreviousMonth}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  type="button"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                  <select
                    value={currentMonth.getMonth()}
                    onChange={(e) =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          parseInt(e.target.value),
                          1
                        )
                      )
                    }
                    className="px-3 py-1.5 border-2 border-gray-400 rounded-lg text-sm font-bold text-gray-900 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors shadow-sm"
                  >
                    {MONTHS_VI.map((month, index) => (
                      <option key={index} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={currentMonth.getFullYear()}
                    onChange={(e) =>
                      setCurrentMonth(
                        new Date(
                          parseInt(e.target.value),
                          currentMonth.getMonth(),
                          1
                        )
                      )
                    }
                    className="px-3 py-1.5 border-2 border-gray-400 rounded-lg text-sm font-bold text-gray-900 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors shadow-sm"
                  >
                    {Array.from(
                      { length: 100 },
                      (_, i) => today.getFullYear() - 50 + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={goToNextMonth}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  type="button"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS_VI.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={index} className="aspect-square" />;
                  }

                  const isCurrentMonth =
                    date.getMonth() === currentMonth.getMonth();
                  const isSelectedDate = isSelected(date);
                  const isTodayDate = isToday(date);

                  return (
                    <button
                      key={index}
                      onClick={() => isCurrentMonth && handleDateSelect(date)}
                      type="button"
                      disabled={!isCurrentMonth}
                      className={cn(
                        "aspect-square flex items-center justify-center text-sm rounded transition-colors",
                        "min-h-[36px]",
                        !isCurrentMonth && "text-gray-300 cursor-not-allowed",
                        isCurrentMonth &&
                          !isSelectedDate &&
                          !isTodayDate &&
                          "text-gray-700 hover:bg-blue-50 hover:text-blue-700",
                        isTodayDate &&
                          !isSelectedDate &&
                          "font-bold border-2 border-blue-500 text-blue-600 bg-blue-50",
                        isSelectedDate &&
                          "bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md"
                      )}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleClear}
                  type="button"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Xóa
                </button>
                <button
                  onClick={handleToday}
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Hôm Nay
                </button>
              </div>
            </div>,
            document.body
          )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
