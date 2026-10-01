import React, { useRef, useState, useEffect } from 'react';
import { House, ClipboardCheck, Users, FileChartColumn, Settings } from 'lucide-react';
import { NavTab } from './Sidebar';

interface CurvedMobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: House },
  { id: 'presensi', label: 'Presensi', icon: ClipboardCheck },
  { id: 'data-siswa', label: 'Data Siswa', icon: Users },
  { id: 'laporan', label: 'Laporan', icon: FileChartColumn },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
];

export const CurvedMobileBottomNav: React.FC<CurvedMobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [navWidth, setNavWidth] = useState<number>(360);

  // Track exact container width to position liquid wave and bubble pixel-perfectly
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setNavWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((item) => item.id === activeTab)
  );

  const numItems = NAV_ITEMS.length;
  const itemWidth = navWidth > 0 ? navWidth / numItems : 72;
  const cx = activeIndex * itemWidth + itemWidth / 2;

  // Geometry parameters for liquid wave
  const W = navWidth || 360;
  const H = 76;
  const yBase = 20;
  const yPeak = 2;
  const rCorner = 24;

  const waveRadius = 38;
  const waveLeft = Math.max(rCorner, cx - waveRadius);
  const waveRight = Math.min(W - rCorner, cx + waveRadius);

  // Continuous seamless liquid shape path
  const liquidPath = `
    M ${rCorner} ${yBase}
    L ${waveLeft} ${yBase}
    C ${waveLeft + 14} ${yBase}, ${cx - 18} ${yPeak}, ${cx - 10} ${yPeak}
    C ${cx - 4} ${yPeak - 2}, ${cx + 4} ${yPeak - 2}, ${cx + 10} ${yPeak}
    C ${cx + 18} ${yPeak}, ${waveRight - 14} ${yBase}, ${waveRight} ${yBase}
    L ${W - rCorner} ${yBase}
    A ${rCorner} ${rCorner} 0 0 1 ${W} ${yBase + rCorner}
    L ${W} ${H - rCorner}
    A ${rCorner} ${rCorner} 0 0 1 ${W - rCorner} ${H}
    L ${rCorner} ${H}
    A ${rCorner} ${rCorner} 0 0 1 0 ${H - rCorner}
    L 0 ${yBase + rCorner}
    A ${rCorner} ${rCorner} 0 0 1 ${rCorner} ${yBase}
    Z
  `;

  const ActiveIcon = NAV_ITEMS[activeIndex]?.icon || House;

  return (
    <div className="md:hidden fixed bottom-2 left-0 right-0 z-30 select-none px-3 pointer-events-none">
      <div
        ref={containerRef}
        className="relative w-full max-w-md mx-auto pointer-events-auto h-[82px]"
      >
        {/* Unified Liquid Background with Smooth Wave & Drop Shadow */}
        <div className="absolute inset-0 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
          <svg
            width={W}
            height={H + 6}
            viewBox={`0 0 ${W} ${H + 6}`}
            className="w-full h-[82px] overflow-visible"
          >
            <path
              d={liquidPath}
              fill="#ffffff"
              className="transition-all duration-300 ease-out"
            />
          </svg>
        </div>

        {/* Sliding Elevated Liquid Bubble Button (No blue border circle) */}
        <div
          className="absolute -top-2.5 z-20 transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: `${cx}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-[52px] h-[52px] rounded-full bg-white shadow-lg shadow-slate-300/60 flex items-center justify-center ring-[3px] ring-white transition-transform duration-200">
            <ActiveIcon className="w-6 h-6 text-[#2563eb] stroke-[2.2]" />
          </div>
        </div>

        {/* 5 Tab Navigation Buttons */}
        <div className="relative z-10 grid grid-cols-5 h-[76px] pt-5">
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="flex flex-col items-center justify-end pb-3.5 cursor-pointer outline-hidden group relative"
              >
                {/* Inactive Icon */}
                {!isActive ? (
                  <div className="text-slate-400 group-hover:text-slate-600 transition-colors mb-1">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                ) : (
                  /* Placeholder space for the active bubble */
                  <div className="w-5 h-5 mb-1" />
                )}

                {/* Tab Label */}
                <span
                  className={`text-[10px] tracking-tight leading-none transition-colors ${
                    isActive
                      ? 'font-bold text-slate-900 mt-0.5'
                      : 'font-medium text-slate-400 group-hover:text-slate-600 mt-0.5'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom iOS Home Indicator Line */}
        <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none">
          <div className="w-28 h-1 bg-slate-300/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
