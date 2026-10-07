import React from 'react';

const Badge = ({ status, className = '' }) => {
  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
        return 'bg-[#F8EBCB] text-[#B98228] border-[#E8D8C1]';
      case 'ACCEPTED':
        return 'bg-[#E4EDF0] text-[#557A8A] border-[#C3D7DF]';
      case 'PICKUP_ASSIGNED':
      case 'PICKUP_IN_PROGRESS':
        return 'bg-[#F8EFE1] text-[#6B403C] border-[#E8D8C1]';
      case 'PICKED_UP':
      case 'DELIVERY_IN_PROGRESS':
        return 'bg-[#EAF0F6] text-[#4A6984] border-[#D1E0EE]';
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-[#E8F0E6] text-[#5F8F65] border-[#C7DFC4]';
      case 'CANCELLED':
      case 'EXPIRED':
        return 'bg-[#F5E3E0] text-[#B84C46] border-[#ECC9C5]';
      case 'VERIFIED':
        return 'bg-[#E8F0E6] text-[#5F8F65] border-[#C7DFC4]';
      case 'PENDING':
        return 'bg-[#F8EBCB] text-[#B98228] border-[#E8D8C1]';
      default:
        return 'bg-[#F2EBDD] text-[#746B66] border-[#E7DED1]';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE': return 'Available';
      case 'ACCEPTED': return 'Accepted by NGO';
      case 'PICKUP_ASSIGNED': return 'Pickup Assigned';
      case 'PICKUP_IN_PROGRESS': return 'Pickup In Progress';
      case 'PICKED_UP': return 'Picked Up';
      case 'DELIVERY_IN_PROGRESS': return 'En Route to NGO';
      case 'DELIVERED': return 'Delivered';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      case 'EXPIRED': return 'Expired';
      case 'VERIFIED': return 'Verified NGO';
      case 'PENDING': return 'Pending Verification';
      default: return status || 'Unknown';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full fill-current bg-current"></span>
      {getStatusLabel(status)}
    </span>
  );
};

export default Badge;
