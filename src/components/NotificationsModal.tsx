/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fbfaf6] border border-[#d9d2c2] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#e7e1d5] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#176f78]" />
            <h3 className="font-display text-xl font-bold uppercase text-[#17343a]">
              Floor Alerts & IE Notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl hover:bg-[#e7e1d5] text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#527078]">
              No active floor alerts at this time.
            </div>
          ) : (
            notifications.map(item => {
              const isAlert = item.type === 'alert';
              const isWarning = item.type === 'warning';

              return (
                <div
                  key={item.id}
                  onClick={() => onMarkAsRead(item.id)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                    item.read
                      ? 'border-[#e7e1d5] bg-white opacity-70'
                      : isAlert
                      ? 'border-rose-300 bg-rose-50/40'
                      : isWarning
                      ? 'border-amber-300 bg-amber-50/40'
                      : 'border-[#176f78]/30 bg-[#dceceb]/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {isAlert ? (
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-[#176f78] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#17343a]">{item.title}</span>
                          {item.lineNo && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#f1eee6] text-[#176f78]">
                              Line {item.lineNo}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#527078] mt-1">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#176f78] shrink-0 mt-1"></span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 text-right font-mono-numbers">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-[#e7e1d5]">
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-rose-600 hover:underline font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#176f78] text-white text-xs font-bold hover:bg-[#12555c]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
