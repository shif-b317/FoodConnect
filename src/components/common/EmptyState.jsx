import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ 
  icon: Icon = FiInbox, 
  title = "No items found", 
  description = "There are no records to display at this time.", 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-8 text-center my-6 max-w-md mx-auto">
      <div className="w-12 h-12 bg-[#F8EFE1] text-[#4A2523] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8D8C1]">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-serif font-bold text-[#4A2523] mb-1">{title}</h3>
      <p className="text-sm text-[#746B66] mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
