/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calendar, Layers, Info, CheckCircle2 } from 'lucide-react';
import { STYLE_PROGRESSION_TABLE } from '../data/learningCurveMatrix';

interface StyleProgressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSMVWeight?: 'light' | 'medium' | 'heavy';
  activeStyleNature?: 'new' | 'repeat';
}

export const StyleProgressionModal: React.FC<StyleProgressionModalProps> = ({
  isOpen,
  onClose,
  activeSMVWeight = 'light',
  activeStyleNature = 'new'
}) => {
  const [filterRange, setFilterRange] = useState<'6days' | 'all'>('6days');
  const [selectedWeight, setSelectedWeight] = useState<'all' | 'light' | 'medium' | 'heavy'>(activeSMVWeight);

  if (!isOpen) return null;

  const displayedRows = filterRange === '6days'
    ? STYLE_PROGRESSION_TABLE.slice(0, 6)
    : STYLE_PROGRESSION_TABLE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#fbfaf6] border border-[#d9d2c2] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#e7e1d5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#dceceb] text-[#176f78]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold uppercase text-[#17343a]">
                Style Progression Chart (Learning Curve)
              </h2>
              <p className="text-xs text-[#527078]">
                Garment Line Build-Up Target Standards (Day 1 - 40)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#527078] hover:bg-[#f1eee6] hover:text-[#17343a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Rule Banner */}
        <div className="p-4 bg-[#f1eee6] border-b border-[#e7e1d5] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#527078] uppercase text-[11px]">Period View:</span>
              <button
                type="button"
                onClick={() => setFilterRange('6days')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterRange === '6days'
                    ? 'bg-[#176f78] text-white shadow-xs'
                    : 'bg-white text-[#527078] border border-[#d9d2c2]'
                }`}
              >
                6-Day Build-Up Period (Primary)
              </button>
              <button
                type="button"
                onClick={() => setFilterRange('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterRange === 'all'
                    ? 'bg-[#176f78] text-white shadow-xs'
                    : 'bg-white text-[#527078] border border-[#d9d2c2]'
                }`}
              >
                Full 40-Day Progression
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#527078] uppercase text-[11px]">Weight:</span>
              {(['all', 'light', 'medium', 'heavy'] as const).map(w => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setSelectedWeight(w)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-all ${
                    selectedWeight === w
                      ? 'bg-[#17343a] text-white'
                      : 'bg-white text-[#527078] border border-[#d9d2c2]'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#e6f4ea] border border-[#ceead6] text-[11px] text-[#137333]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Rule 01:</strong> If any style input starts again within 3 months in the same line, it is classified as <strong>Repeat Style</strong> (higher initial day 1–5 ramp-up efficiency).
            </div>
          </div>
        </div>

        {/* Progression Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="overflow-x-auto border border-[#d9d2c2] rounded-xl bg-white shadow-xs">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="bg-[#f1eee6] border-b border-[#d9d2c2]">
                  <th rowSpan={2} className="p-2.5 border-r border-[#d9d2c2] font-bold text-[#17343a] w-16">
                    Day
                  </th>
                  <th colSpan={3} className="p-2.5 border-r border-[#d9d2c2] font-bold text-[#176f78] bg-[#eef7f7]">
                    New Style Target Efficiency %
                  </th>
                  <th colSpan={3} className="p-2.5 font-bold text-[#8c531b] bg-[#fdf5eb]">
                    Repeat Style (Within 3 Months in Same Line)
                  </th>
                </tr>
                <tr className="bg-[#fbfaf6] border-b border-[#d9d2c2] text-[11px] font-bold">
                  <th className={`p-2 border-r border-[#e7e1d5] ${selectedWeight === 'light' ? 'bg-[#dceceb]' : ''}`}>
                    Light<br /><span className="text-[10px] font-normal text-[#527078]">0 - 30 Min</span>
                  </th>
                  <th className={`p-2 border-r border-[#e7e1d5] ${selectedWeight === 'medium' ? 'bg-[#dceceb]' : ''}`}>
                    Medium<br /><span className="text-[10px] font-normal text-[#527078]">31 - 60 Min</span>
                  </th>
                  <th className={`p-2 border-r border-[#d9d2c2] ${selectedWeight === 'heavy' ? 'bg-[#dceceb]' : ''}`}>
                    Heavy<br /><span className="text-[10px] font-normal text-[#527078]">&gt;61 Min</span>
                  </th>

                  <th className={`p-2 border-r border-[#e7e1d5] ${selectedWeight === 'light' ? 'bg-[#faebd7]' : ''}`}>
                    Light<br /><span className="text-[10px] font-normal text-[#527078]">0 - 30 Min</span>
                  </th>
                  <th className={`p-2 border-r border-[#e7e1d5] ${selectedWeight === 'medium' ? 'bg-[#faebd7]' : ''}`}>
                    Medium<br /><span className="text-[10px] font-normal text-[#527078]">31 - 60 Min</span>
                  </th>
                  <th className={`p-2 ${selectedWeight === 'heavy' ? 'bg-[#faebd7]' : ''}`}>
                    Heavy<br /><span className="text-[10px] font-normal text-[#527078]">&gt;61 Min</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e1d5]">
                {displayedRows.map(row => {
                  const isDay6OrLess = row.day <= 6;
                  return (
                    <tr
                      key={row.day}
                      className={`hover:bg-[#f8f6f0] transition-colors ${
                        isDay6OrLess ? 'font-medium' : 'text-[#527078]'
                      } ${row.day === 6 ? 'bg-amber-50/50' : ''}`}
                    >
                      <td className="p-2 border-r border-[#d9d2c2] font-bold text-[#17343a] bg-[#fbfaf6]">
                        Day - {row.day}
                        {row.day === 6 && (
                          <span className="block text-[9px] text-amber-700 uppercase font-bold">Ramp End</span>
                        )}
                      </td>
                      <td className={`p-2 border-r border-[#e7e1d5] font-mono-numbers ${selectedWeight === 'light' ? 'bg-[#dceceb]/40 font-bold text-[#176f78]' : ''}`}>
                        {row.newStyle.light}%
                      </td>
                      <td className={`p-2 border-r border-[#e7e1d5] font-mono-numbers ${selectedWeight === 'medium' ? 'bg-[#dceceb]/40 font-bold text-[#176f78]' : ''}`}>
                        {row.newStyle.medium}%
                      </td>
                      <td className={`p-2 border-r border-[#d9d2c2] font-mono-numbers ${selectedWeight === 'heavy' ? 'bg-[#dceceb]/40 font-bold text-[#176f78]' : ''}`}>
                        {row.newStyle.heavy}%
                      </td>

                      <td className={`p-2 border-r border-[#e7e1d5] font-mono-numbers ${selectedWeight === 'light' ? 'bg-[#faebd7]/40 font-bold text-[#8c531b]' : ''}`}>
                        {row.repeatStyle.light}%
                      </td>
                      <td className={`p-2 border-r border-[#e7e1d5] font-mono-numbers ${selectedWeight === 'medium' ? 'bg-[#faebd7]/40 font-bold text-[#8c531b]' : ''}`}>
                        {row.repeatStyle.medium}%
                      </td>
                      <td className={`p-2 font-mono-numbers ${selectedWeight === 'heavy' ? 'bg-[#faebd7]/40 font-bold text-[#8c531b]' : ''}`}>
                        {row.repeatStyle.heavy}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#e7e1d5] bg-white flex items-center justify-between text-xs">
          <div className="text-[#527078]">
            SMV Weight Reference: Light (0-30 min) | Medium (31-60 min) | Heavy (&gt;61 min)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#176f78] text-white font-bold hover:bg-[#125860] transition-colors"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
