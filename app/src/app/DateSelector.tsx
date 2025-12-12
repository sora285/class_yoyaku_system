import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateSelectorProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export default function DateSelector({
                                         selectedDate,
                                         onDateChange,
                                     }: DateSelectorProps) {
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth()); // October (0-indexed)

    useEffect(() => {
        setCurrentYear(selectedDate.getFullYear());
        setCurrentMonth(selectedDate.getMonth());
    }, [selectedDate]);

    const year = currentYear;
    const month = currentMonth;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push({
            day: prevMonthDays - i,
            isCurrentMonth: false,
            date: new Date(year, month - 1, prevMonthDays - i),
        });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            day: i,
            isCurrentMonth: true,
            date: new Date(year, month, i),
        });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({
            day: i,
            isCurrentMonth: false,
            date: new Date(year, month + 1, i),
        });
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (
        <div className="bg-white h-[450px] relative rounded-[14px] w-[325px]">
            <div
                aria-hidden="true"
                className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]"
            />
            {/* Header */}
            <div className="absolute box-border gap-[6px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[16px_minmax(0px,_1fr)] h-[70px] left-px pb-0 pt-[24px] px-[24px] top-px w-[323px]">
                <div className="[grid-area:1_/_1] relative shrink-0">
                    <p className="absolute font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">
                        日付選択
                    </p>
                </div>
                <div className="[grid-area:2_/_1] relative shrink-0">
                    <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#717182] text-[16px] text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">
                        予約する日付を選択してください
                    </p>
                </div>
            </div>

            {/* Calendar */}
            <div className="absolute box-border content-stretch flex flex-col h-[340px] items-start left-[37.5px] pb-px pt-[13px] px-[13px] rounded-[8px] top-[95px] w-[250px]">
                <div
                    aria-hidden="true"
                    className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]"
                />
                <div className="h-[314px] relative shrink-0 w-full">
                    {/* Month/Year Header */}
                    <div className="absolute h-[28px] left-0 top-0 w-[224px] flex items-center justify-between">
                        <button
                            onClick={handlePreviousMonth}
                            className="size-[24px] flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                        >
                            <ChevronLeft className="size-[18px] text-neutral-950" />
                        </button>
                        <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[20px] not-italic text-[14px] text-neutral-950 text-nowrap tracking-[-0.1504px] whitespace-pre">
                            {month + 1}月 {year}
                        </p>
                        <button
                            onClick={handleNextMonth}
                            className="size-[24px] flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                        >
                            <ChevronRight className="size-[18px] text-neutral-950" />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="absolute h-[270px] left-0 top-[44px] w-[224px]">
                        {/* Week Days Header */}
                        <div className="absolute h-[24px] left-[0.5px] top-0 w-[216px]">
                            <div className="absolute content-stretch flex h-[24px] items-center left-0 top-0 w-[224px]">
                                {weekDays.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`h-[24px] relative rounded-[8px] shrink-0 flex items-center justify-center ${
                                            index === 6 ? "basis-0 grow min-h-px min-w-px" : "w-[32px]"
                                        }`}
                                    >
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] leading-[19.2px] not-italic text-[#717182] text-[12.8px] text-nowrap tracking-[-0.06px] whitespace-pre">
                                            {day}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Calendar Days */}
                        <div className="absolute h-[240px] left-0 top-[30px] w-[224px]">
                            {weeks.map((week, weekIndex) => (
                                <div
                                    key={weekIndex}
                                    className="absolute h-[36px] left-0 w-[224px]"
                                    style={{ top: `${weekIndex * 40}px` }}
                                >
                                    {week.map((dayInfo, dayIndex) => {
                                        const isSelected =
                                            dayInfo.isCurrentMonth &&
                                            dayInfo.date.getDate() === selectedDate.getDate();

                                        return (
                                            <button
                                                key={dayIndex}
                                                onClick={() =>
                                                    dayInfo.isCurrentMonth && onDateChange(dayInfo.date)
                                                }
                                                className="absolute content-stretch flex flex-col items-center justify-center size-[32px] top-[2px]"
                                                style={{ left: `${dayIndex * 32}px` }}
                                            >
                                                <div
                                                    className={`h-[32px] relative rounded-[8px] shrink-0 w-full cursor-pointer flex items-center justify-center ${
                                                        isSelected ? "bg-[#030213]" : ""
                                                    } ${
                                                        dayInfo.isCurrentMonth
                                                            ? "hover:bg-[#e9ebef]"
                                                            : ""
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute inset-[-1px] bg-[#e9ebef] rounded-[8px] -z-10" />
                                                    )}
                                                    <p
                                                        className={`font-['Inter:Regular',sans-serif] leading-[20px] not-italic text-[14px] text-nowrap tracking-[-0.1504px] whitespace-pre ${
                                                            isSelected
                                                                ? "text-white"
                                                                : dayInfo.isCurrentMonth
                                                                    ? "text-neutral-950"
                                                                    : "text-[#717182]"
                                                        }`}
                                                    >
                                                        {dayInfo.day}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
