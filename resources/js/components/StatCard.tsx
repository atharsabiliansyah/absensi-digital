import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  count: number;
  percentage: number;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  percentageColor: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  count,
  percentage,
  icon: Icon,
  bgColor,
  iconColor,
  percentageColor,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl sm:rounded-[24px] p-4.5 sm:p-7 shadow-xs border border-slate-100/90 flex items-center gap-4 sm:gap-5 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-200 hover:shadow-sm' : ''
      }`}
    >
      {/* Left Icon in Colored Circle */}
      <div
        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0 ${bgColor} ${iconColor}`}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
      </div>

      {/* Right Stats Text */}
      <div className="flex flex-col justify-center">
        <span className="text-[12.5px] sm:text-[14.5px] text-slate-400 font-medium leading-none">
          {label}
        </span>
        <div className="flex items-baseline mt-2 sm:mt-2.5">
          <span className="text-[25px] sm:text-[34px] font-bold text-slate-900 leading-none tracking-tight font-sans">
            {count}
          </span>
          <span
            className={`text-[13px] sm:text-[15px] font-bold ml-2 sm:ml-2.5 leading-none ${percentageColor}`}
          >
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
