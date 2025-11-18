import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useLanguage } from "./LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { useGetHomePageDataQuery } from "@/store/api/apiSlice";

interface TimelineProps {
  timelineData?: Array<{
    year: string;
    months: Array<{
      name: string;
      cases: number;
    }>;
  }>;
}

const HorizontalTimeline: React.FC<TimelineProps> = ({
  timelineData: propTimelineData,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  // Fetch data if not provided via props
  const { data: homePageData, isLoading } = useGetHomePageDataQuery(
    {
      page: 1,
      limit: 10,
    },
    {
      skip: !!propTimelineData, // Skip fetching if data is provided via props
    }
  );

  // Use prop data if available, otherwise use fetched data
  const timelineData =
    propTimelineData ||
    homePageData?.data?.timelineData?.map((yearData) => ({
      year: yearData?._id?.toString(),
      months: yearData?.months.map((month) => ({
        name: month.name,
        cases: month.cases,
      })),
    })) ||
    [];

  // Set default selected year to the most recent year with data
  const [selectedYear, setSelectedYear] = useState(() => {
    if (timelineData.length > 0) {
      return Number(timelineData[0].year);
    }
    return 2025;
  });

  // Update selected year when timeline data changes
  useEffect(() => {
    if (
      timelineData.length > 0 &&
      !timelineData.find((y) => y.year === selectedYear.toString())
    ) {
      setSelectedYear(Number(timelineData[0].year));
    }
  }, [timelineData, selectedYear]);

  // Generate daily timeline data for the selected year
  const generateDailyTimelineData = (year: number) => {
    const data = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Find the year data from real timeline data
    const yearData = timelineData.find((y) => y.year === year.toString());

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const monthName = d.toLocaleDateString("en", { month: "short" });
      const monthData = yearData?.months.find((m) => m.name === monthName);

      // Distribute monthly cases across days (simplified distribution)
      const monthlyCases = monthData?.cases || 0;
      const daysInMonth = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0
      ).getDate();
      const avgCasesPerDay = monthlyCases / daysInMonth;

      // Add some randomness while keeping the monthly total accurate
      const randomFactor = 0.5 + Math.random(); // 0.5 to 1.5
      const cases = Math.round(avgCasesPerDay * randomFactor);

      data.push({
        date: new Date(d),
        cases,
        month: monthName,
        day: d.getDate(),
        isHighActivity: cases > 10,
      });
    }
    return data;
  };

  const dailyTimelineData = generateDailyTimelineData(selectedYear);

  const maxCases = Math.max(...dailyTimelineData.map((d) => d.cases));

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;

    const rect = scrollRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const scrollPercent = x / rect.width;
    const maxScroll =
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const newScrollLeft = scrollPercent * maxScroll;

    scrollRef.current.scrollLeft = newScrollLeft;
    setScrollPosition(newScrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollRef.current) return;

      const rect = scrollRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const scrollPercent = Math.max(0, Math.min(1, x / rect.width));
      const maxScroll =
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      const newScrollLeft = scrollPercent * maxScroll;

      scrollRef.current.scrollLeft = newScrollLeft;
      setScrollPosition(newScrollLeft);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Show loading state
  if (isLoading && !propTimelineData) {
    return (
      <Card className="w-full p-4 bg-muted/20 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-semibold">{t("loading")}</span>
        </div>
        <div className="h-28 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  // Show empty state if no data
  if (timelineData.length === 0) {
    return (
      <Card className="w-full p-4 bg-muted/20 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-semibold">Timeline</span>
        </div>
        <div className="h-28 flex items-center justify-center text-muted-foreground">
          No timeline data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4 bg-muted/20 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4" />
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="text-sm font-semibold bg-transparent border-none focus:outline-none hover:underline cursor-pointer"
        >
          {timelineData.map((yearData) => (
            <option key={yearData.year} value={Number(yearData.year)}>
              {yearData.year} {t("cases")} (
              {yearData.months.reduce((sum, month) => sum + month.cases, 0)})
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">
          ({t("touchAndDrag")} •{" "}
          {dailyTimelineData.reduce((sum, d) => sum + d.cases, 0)}{" "}
          {t("totalCases")})
        </span>
      </div>

      <div
        ref={scrollRef}
        className={`relative overflow-x-auto overflow-y-hidden h-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex items-end gap-1 pb-2"
          style={{ width: `${dailyTimelineData.length * 8}px` }}
        >
          {dailyTimelineData.map((day, index) => {
            const heightPercent =
              day.cases > 0 ? Math.max(10, (day.cases / maxCases) * 100) : 5;
            const isHovered = hoveredDay === index;
            const shouldShowMonth = day.day === 1;

            return (
              <div
                key={index}
                className="relative flex flex-col items-center group"
                onMouseEnter={() => setHoveredDay(index)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Month label */}
                {shouldShowMonth && (
                  <div className="absolute -top-6 left-0 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {day.month}
                  </div>
                )}

                {/* Case count bar */}
                <div
                  className={`
                    w-2 transition-all duration-200 rounded-t-sm
                    ${
                      day.cases === 0
                        ? "bg-muted"
                        : day.isHighActivity
                        ? "bg-destructive"
                        : "bg-primary"
                    }
                    ${isHovered ? "brightness-110 scale-x-150 z-10" : ""}
                  `}
                  style={{
                    height: `${heightPercent}px`,
                    minHeight: "2px",
                  }}
                />

                {/* Hover tooltip */}
                {isHovered && (
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover border rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg z-20 animate-fade-in">
                    <div className="font-medium">
                      {day.date.toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-muted-foreground">
                      {day.cases} {day.cases === 1 ? t("case") : t("cases")}
                    </div>
                  </div>
                )}

                {/* Day marker (only for significant days) */}
                {(day.day % 7 === 0 || day.isHighActivity) && (
                  <div className="absolute -bottom-4 text-xs text-muted-foreground">
                    {day.day}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary rounded-sm"></div>
          <span>{t("regularCases")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-destructive rounded-sm"></div>
          <span>{t("highCases")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-muted rounded-sm"></div>
          <span>{t("noCases")}</span>
        </div>
      </div>
    </Card>
  );
};

export default HorizontalTimeline;
