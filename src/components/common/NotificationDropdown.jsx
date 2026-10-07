import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiCheck, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userNotifications = notifications.filter(n => !user || n.role === user.role || n.role === 'all');
  const unreadCount = userNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    setIsOpen(false);
    if (notif.donationId) {
      if (user?.role === 'donor') navigate(`/donor/donations/${notif.donationId}`);
      else if (user?.role === 'ngo') navigate(`/ngo/donations/${notif.donationId}`);
      else if (user?.role === 'volunteer') navigate(`/volunteer/tracking/${notif.donationId}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#4A2523] hover:bg-[#F8EFE1] rounded-fc-md transition-colors"
        aria-label="Notifications"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#B84C46] rounded-full ring-2 ring-[#FFFDF8]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg shadow-xl z-50 overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between p-3.5 bg-[#F8EFE1] border-b border-[#E7DED1]">
            <div className="flex items-center space-x-2">
              <FiBell className="w-4 h-4 text-[#4A2523]" />
              <span className="font-serif font-bold text-sm text-[#4A2523]">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-[#4A2523] text-[#FFF9F0] rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-medium text-[#4A2523] hover:underline flex items-center space-x-1"
              >
                <FiCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#E7DED1]">
            {userNotifications.length === 0 ? (
              <div className="p-6 text-center text-[#746B66] text-xs">
                No notifications right now.
              </div>
            ) : (
              userNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 cursor-pointer hover:bg-[#F7F2E9] transition-colors flex items-start space-x-3 ${
                    !n.read ? 'bg-[#FFFDF8] font-medium' : 'bg-[#FFFDF8]/60 opacity-80'
                  }`}
                >
                  <div className="p-1.5 rounded-full bg-[#F8EFE1] text-[#4A2523] mt-0.5">
                    <FiInfo className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#4A2523] truncate">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[#D7A94C]" />}
                    </div>
                    <p className="text-xs text-[#2D2422] mt-0.5 line-clamp-2">{n.message}</p>
                    <span className="text-[10px] text-[#958B85] mt-1 block">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
