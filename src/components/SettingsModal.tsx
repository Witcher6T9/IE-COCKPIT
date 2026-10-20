/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Palette, Layout, Sliders, Check } from 'lucide-react';
import { DashboardLayout } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onSelectTheme: (theme: string) => void;
  layout: DashboardLayout;
  onUpdateLayout: (layout: DashboardLayout) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  layout,
  onUpdateLayout
}) => {
  if (!isOpen) return null;

  const themes = [
    { id: 'light', name: 'Warm Linen', desc: 'Craft paper & warm teal palette' },
    { id: 'industrial', name: 'Industrial Steel', desc: 'Cool slate & engineering navy' },
    { id: 'forest', name: 'Forest Mill', desc: 'Deep sage & botanical emerald' },
    { id: 'sunset', name: 'Sunset Loom', desc: 'Warm amber & rich terracotta' },
    { id: 'dark', name: 'Dark Workshop', desc: 'High-contrast charcoal & neon teal' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fbfaf6] border border-[#d9d2c2] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#e7e1d5] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#176f78]" />
            <h3 className="font-display text-xl font-bold uppercase text-[#17343a]">
              Preferences & Display Controls
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#e7e1d5] text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Options */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#527078]">
            <Palette className="w-4 h-4 text-[#176f78]" />
            <span>Color Theme Archetype</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {themes.map(t => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTheme(t.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#176f78] bg-[#dceceb]/30 ring-1 ring-[#176f78]'
                      : 'border-[#d9d2c2] bg-white hover:bg-[#f1eee6]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#17343a]">{t.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#176f78]" />}
                  </div>
                  <p className="text-[10px] text-[#527078] mt-0.5">{t.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Sections Toggle */}
        <div className="space-y-3 pt-3 border-t border-[#e7e1d5]">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#527078]">
            <Layout className="w-4 h-4 text-[#176f78]" />
            <span>Dashboard Layout Visibility</span>
          </div>

          <div className="space-y-2">
            {[
              { key: 'showHero', label: 'Factory Telemetry Hero Banner' },
              { key: 'showStats', label: 'Overall Efficiency & Output Stats Grid' },
              { key: 'showBalancingGraph', label: 'Learning Curve Ramp-Up Graph' },
              { key: 'showIO', label: 'Hourly Output Telemetry Bar' },
              { key: 'showUpcoming', label: 'Upcoming Style Changeover 10-Day File' }
            ].map(item => (
              <label
                key={item.key}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#e7e1d5] text-xs font-medium cursor-pointer hover:bg-[#f1eee6]"
              >
                <span className="text-[#17343a]">{item.label}</span>
                <input
                  type="checkbox"
                  checked={(layout as any)[item.key]}
                  onChange={e =>
                    onUpdateLayout({
                      ...layout,
                      [item.key]: e.target.checked
                    })
                  }
                  className="w-4 h-4 rounded text-[#176f78] focus:ring-[#176f78]"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#176f78] text-white font-bold text-xs hover:bg-[#12555c] transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
