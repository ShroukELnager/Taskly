"use client";
import { useState, useEffect } from "react";
import {
  format,
  differenceInDays,
  isSameDay,
  isWithinInterval,
  startOfWeek,
} from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formatDate = (date) => {
  if (!date) return null;
  return format(date, "yyyy-MM-dd");
};

export function DatePicker({ onChange }) {
  const MAX_DAYS = 7;

  const today = new Date();

  const startWeek = startOfWeek(today, {
    weekStartsOn: 0,
  });

  const [date, setDate] = useState({
    from: startWeek,
    to: today,
  });

  // ✅ temp state
  const [tempDate, setTempDate] = useState({
    from: startWeek,
    to: today,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (onChange) {
      onChange({
        from: formatDate(startWeek),
        to: formatDate(today),
      });
    }
  }, []);

  const [currentMonth, setCurrentMonth] = useState(5);
  const [currentYear, setCurrentYear] = useState(2025);

  const years = Array.from({ length: 20 }, (_, i) => 2015 + i);

  const emitChange = (newDate) => {
    setTempDate(newDate);
  };

  const goPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day);

    if (selectedDate > today) return;

    const hasDefaultRange =
      tempDate.from &&
      tempDate.to &&
      isSameDay(tempDate.from, startWeek) &&
      isSameDay(tempDate.to, today);

    if (hasDefaultRange) {
      emitChange({
        from: selectedDate,
        to: null,
      });
      setError("");
      return;
    }

    if (!tempDate.from || (tempDate.from && tempDate.to)) {
      emitChange({
        from: selectedDate,
        to: null,
      });
      setError("");
      return;
    }

    if (tempDate.from && !tempDate.to) {
      let start = tempDate.from;
      let end = selectedDate;

      if (selectedDate < start) {
        start = selectedDate;
        end = tempDate.from;
      }

      const totalDays = differenceInDays(end, start) + 1;

      if (totalDays > MAX_DAYS) {
        setError(`Max ${MAX_DAYS} days allowed`);
        return;
      }

      emitChange({ from: start, to: end });
      setError("");
      return;
    }

    let start = tempDate.from;
    let end = tempDate.to;

    if (selectedDate < start) {
      start = selectedDate;
    } else if (selectedDate > end) {
      end = selectedDate;
    } else {
      const leftDiff = differenceInDays(selectedDate, start);
      const rightDiff = differenceInDays(end, selectedDate);

      if (leftDiff < rightDiff) {
        start = new Date(selectedDate);
        start.setDate(start.getDate() + 1);
      } else {
        end = new Date(selectedDate);
        end.setDate(end.getDate() - 1);
      }
    }

    const totalDays = differenceInDays(end, start) + 1;

    if (totalDays > MAX_DAYS) {
      setError(`Max ${MAX_DAYS} days allowed`);
      return;
    }

    if (start > end) {
      emitChange({ from: selectedDate, to: null });
    } else {
      emitChange({ from: start, to: end });
    }

    setError("");
  };

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex w-[190px] items-center justify-center rounded-xl border border-[#d9deea] bg-white px-3 py-3 text-center text-[15px] font-semibold text-[#0d47c9] shadow-sm transition hover:bg-white">
          <div className="flex items-center gap-2">
            {date?.from && date?.to ? (
              <>
                {format(date.from, "MMM dd")} -{" "}
                {format(date.to, "MMM dd, yyyy")}
              </>
            ) : date?.from ? (
              format(date.from, "PPP")
            ) : (
              <span>Select range</span>
            )}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[320px] rounded-2xl border border-[#e5e9f2] bg-white p-4 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            onClick={goPrevMonth}
            className="rounded-md px-2 py-1 hover:bg-[#f0f4ff]"
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1d2b53]">
              {format(new Date(currentYear, currentMonth), "MMMM")}
            </span>

            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              className="rounded-md border px-1 py-0.5 text-sm text-[#1d2b53]"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={goNextMonth}
            className="rounded-md px-2 py-1 hover:bg-[#f0f4ff]"
          >
            →
          </button>
        </div>

        {/* Days Header */}
        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
          {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
            <div
              key={day}
              className="text-[11px] font-medium text-[#9aa6c1]"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const currentDate = new Date(
              currentYear,
              currentMonth,
              day
            );

            const isFuture = currentDate > today;

            const isStart =
              tempDate.from &&
              isSameDay(currentDate, tempDate.from);

            const isEnd =
              tempDate.to &&
              isSameDay(currentDate, tempDate.to);

            const isInRange =
              tempDate.from &&
              tempDate.to &&
              isWithinInterval(currentDate, {
                start: tempDate.from,
                end: tempDate.to,
              });

            return (
              <button
                key={day}
                disabled={isFuture}
                onClick={() => handleSelectDay(day)}
                className={`
                  h-9 w-9 text-sm transition
                  ${
                    isFuture
                      ? "cursor-not-allowed text-[#c5cede] opacity-40"
                      : "hover:bg-[#edf3ff]"
                  }
                  ${
                    isInRange
                      ? "bg-[#dbe8ff] text-[#0d47c9]"
                      : "text-[#23345d]"
                  }
                  ${
                    isStart || isEnd
                      ? "rounded-lg bg-[#0d47c9] text-white"
                      : "rounded-md"
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => {
              setDate({
                from: startWeek,
                to: today,
              });

              setTempDate({
                from: startWeek,
                to: today,
              });

              setError("");
            }}
            className="flex-1 rounded-xl py-2 text-[#60708f] hover:bg-[#f5f7ff]"
          >
            Reset
          </button>

          <button
            disabled={!tempDate.from || !tempDate.to}
            onClick={() => {
              setDate(tempDate);

              if (onChange) {
                onChange({
                  from: formatDate(tempDate.from),
                  to: formatDate(tempDate.to),
                });
              }
            }}
            className="flex-1 rounded-xl bg-[#0d47c9] py-2 text-white hover:bg-[#0b3cab] disabled:opacity-50"
          >
            Apply Range
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}