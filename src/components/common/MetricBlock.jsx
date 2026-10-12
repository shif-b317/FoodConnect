import React from 'react';

const MetricBlock = ({ icon: Icon, value, label, subtitle, color = 'burgundy', onClick, selected = false }) => {
  return (
    <button
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      className={`text-left bg-[#FFFDF8] border rounded-fc-lg p-5 flex items-start space-x-4 transition-colors ${
        selected ? 'border-[#4A2523] ring-1 ring-[#4A2523]' : 'border-[#E7DED1]'
      } ${onClick ? 'w-full hover:border-[#4A2523] cursor-pointer' : ''}`}
    >
      {Icon && (
        <div className="p-3 rounded-fc-md bg-[#F8EFE1] text-[#4A2523] border border-[#E8D8C1]">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div>
        <div className="text-2xl font-serif font-bold text-[#4A2523] tracking-tight">{value}</div>
        <div className="text-sm font-medium text-[#2D2422] mt-0.5">{label}</div>
        {subtitle && <div className="text-xs text-[#746B66] mt-1">{subtitle}</div>}
      </div>
    </button>
  );
};

export default MetricBlock;
