/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, Sun, Moon, Gauge } from 'lucide-react';

interface HeaderProps {
  theme: string;
  onToggleTheme: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  unreadCount,
  onOpenNotifications,
  onLogoClick
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      id="app-top-header"
      className="sticky top-0 z-40 border-b border-[#d9d2c2] bg-[#fbfaf6]/95 backdrop-blur-md transition-colors"
    >
      <div className="mx-auto max-w-[1500px] px-3 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              id="top-brand-logo-btn"
              onClick={onLogoClick}
              title="IE Daily Control - Home"
              aria-label="IE Daily Control Home"
              className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#0c4a60] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:bg-[#083647] transition-colors">
                <Gauge className="w-4.5 h-4.5 stroke-[2]" />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="font-extrabold text-xs sm:text-sm tracking-tight text-[#17343a] leading-none uppercase">
                    IE / DAILY
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm tracking-tight text-[#17343a] leading-none uppercase mt-0.5">
                    CONTROL
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                  PROD
                </span>
              </div>
            </button>
          </div>

          {/* Right Action Icons: Theme Toggle & Notifications */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              id="top-theme-toggle-btn"
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="w-9 h-9 rounded-xl border border-[#d9d2c2] bg-white text-slate-700 hover:text-[#176f78] hover:border-[#176f78] flex items-center justify-center transition-colors shadow-2xs cursor-pointer focus:outline-hidden"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Notifications Button */}
            <button
              id="top-notifications-btn"
              onClick={onOpenNotifications}
              title="Notifications & Floor Alerts"
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-xl border border-[#d9d2c2] bg-white text-slate-700 hover:text-[#176f78] hover:border-[#176f78] flex items-center justify-center transition-colors shadow-2xs cursor-pointer focus:outline-hidden"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
