/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { LineEntry, UserProfile } from '../types';
import { calculateLineMetrics, calculateFactoryOverall, exportReportToCSV, downloadCSV, formatDateLabel } from '../utils';

interface ReportsProps {
  lines: LineEntry[];
  todayDate: string;
  profile: UserProfile;
}

export const Reports: React.FC<ReportsProps> = ({ lines, todayDate, profile }) => {
  const [reportDate, setReportDate] = useState(todayDate);
  const [floorFilter, setFloorFilter] = useState('all');

  const factory = calculateFactoryOverall(lines);

  const handleExportCSV = () => {
    const csv = exportReportToCSV(lines, reportDate);
    downloadCSV(`IE_Daily_Control_Report_${reportDate}.csv`, csv);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredLines = lines.filter(l => {
    if (floorFilter === 'all') return true;
    return l.floor.toLowerCase().includes(floorFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#dceceb] text-[#176f78]">
                Audit-Ready Floor Export
              </span>
              <span className="text-xs text-[#527078]">Factory IE Daily Control Matrix</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#17343a] tracking-tight">
              Daily IE Production & Efficiency Report
            </h1>
            <p className="text-xs sm:text-sm text-[#527078] mt-1">
              Official shift summary covering SMV, operator absenteeism, bottleneck mitigation, and line balancing scores.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#176f78] text-white hover:bg-[#12555c] transition-colors text-xs font-bold shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f1eee6] border border-[#d9d2c2] text-[#17343a] hover:bg-[#e7e1d5] transition-colors text-xs font-bold"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 pt-4 border-t border-[#e7e1d5] flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-[#f1eee6] px-3 py-1.5 rounded-xl border border-[#d9d2c2]">
            <Calendar className="w-3.5 h-3.5 text-[#176f78]" />
            <input
              type="date"
              value={reportDate}
              onChange={e => e.target.value && setReportDate(e.target.value)}
              className="bg-transparent font-bold font-mono-numbers text-[#17343a] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#f1eee6] px-3 py-1.5 rounded-xl border border-[#d9d2c2]">
            <Filter className="w-3.5 h-3.5 text-[#176f78]" />
            <select
              value={floorFilter}
              onChange={e => setFloorFilter(e.target.value)}
              className="bg-transparent font-bold text-[#17343a] focus:outline-hidden"
            >
              <option value="all">All Sewing Floors</option>
              <option value="Floor 01">Floor 01 Only</option>
              <option value="Floor 02">Floor 02 Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="rounded-2xl border border-[#d9d2c2] bg-white p-6 shadow-xs space-y-6">
        {/* Formal Document Header */}
        <div className="border-b border-black/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#176f78]">
              Industrial Engineering Department • Quality & Floor Control
            </div>
            <h2 className="font-display text-2xl font-bold uppercase text-black">
              Garment Line Efficiency & Shift Telemetry Log
            </h2>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Shift Date: <strong>{formatDateLabel(reportDate)}</strong> • Factory Unit: Plant #1
            </div>
          </div>

          <div className="text-right text-xs font-mono-numbers text-slate-600">
            <div>Doc Ref: <strong>#IE-CR-{reportDate.replace(/-/g, '')}</strong></div>
            <div>Sign-off: <strong>{profile.name} ({profile.jobTitle})</strong></div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr className="border-b border-slate-300">
                <th className="py-2.5 px-2.5 border-r border-slate-200">Line</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200">Floor</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200">Buyer</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200">Style</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200">SMV</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200">MP (P/A)</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200">Target</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200">Achieved</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200">Variance</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200">Prod. Min</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200">Avail. Min</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 font-black">Eff %</th>
                <th className="py-2.5 px-2.5">Bottleneck Station & Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredLines.map(line => {
                const m = calculateLineMetrics(line);
                const isOverTarget = m.efficiencyPct >= line.targetEff;

                return (
                  <tr key={line.id} className="hover:bg-slate-50">
                    <td className="py-2 px-2.5 font-bold border-r border-slate-200">
                      Line {line.lineNo}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200 text-[11px]">
                      {line.floor}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200 font-medium">
                      {line.buyer}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200 text-[11px] truncate max-w-[120px]">
                      {line.style}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200 font-mono-numbers">
                      {line.smv.toFixed(2)}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200 font-mono-numbers">
                      <strong>{m.totalPresentMP}</strong> / <span className="text-rose-600">{m.totalAbsentMP}</span>
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200 font-mono-numbers">
                      {line.targetProd}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200 font-mono-numbers font-bold">
                      {line.achievedProd}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200 font-mono-numbers font-bold">
                      <span className={m.variancePcs >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                        {m.variancePcs >= 0 ? `+${m.variancePcs}` : m.variancePcs}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200 font-mono-numbers">
                      {(m.standardProducedMinutes ?? 0).toLocaleString()}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200 font-mono-numbers">
                      {(m.availableMinutes ?? 0).toLocaleString()}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-200 font-display text-sm font-bold">
                      <span className={isOverTarget ? 'text-emerald-700' : 'text-amber-700'}>
                        {m.efficiencyPct}%
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-[11px]">
                      <strong>{line.bottleneck.station}</strong> ({line.bottleneck.cycleTime}s vs {line.bottleneck.targetCT}s)
                      {line.bottleneck.action && (
                        <div className="text-[10px] text-slate-500">{line.bottleneck.action}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Total Footer Row */}
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
              <tr>
                <td colSpan={4} className="py-2.5 px-2.5 border-r border-slate-200 uppercase text-slate-700">
                  Total Plant Summary
                </td>
                <td className="py-2.5 px-2.5 border-r border-slate-200 font-mono-numbers">-</td>
                <td className="py-2.5 px-2.5 border-r border-slate-200 font-mono-numbers">
                  {factory.totalPresent} / <span className="text-rose-600">{factory.totalAbsent}</span>
                </td>
                <td className="py-2.5 px-2.5 border-r border-slate-200 font-mono-numbers">
                  {(factory.totalTargetProd ?? 0).toLocaleString()}
                </td>
                <td className="py-2.5 px-2.5 border-r border-slate-200 font-mono-numbers">
                  {(factory.totalAchievedProd ?? 0).toLocaleString()}
                </td>
                <td className="py-2.5 px-2.5 border-r border-slate-200 font-mono-numbers">
                  {factory.targetVariance >= 0 ? `+${factory.targetVariance}` : factory.targetVariance}
                </td>
                <td className="py-2.5 px-2.5 border-r border-slate-200 font-mono-numbers">
                  {(factory.totalProducedMinutes ?? 0).toLocaleString()}
                </td>
                <td className="py-2.5 px-2.5 border-r border-slate-200 font-mono-numbers">
                  {(factory.totalAvailableMinutes ?? 0).toLocaleString()}
                </td>
                <td className="py-2.5 px-2.5 border-r border-slate-200 font-display text-base text-[#176f78]">
                  {factory.overallEfficiency}%
                </td>
                <td className="py-2.5 px-2.5 text-[11px] text-slate-600">
                  Attendance Rate: {factory.attendanceRate}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Verification Footer Signatures */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          <div>
            <div className="font-bold uppercase text-[10px] text-slate-400">Prepared By</div>
            <div className="mt-4 pt-2 border-t border-slate-300 font-medium">
              Industrial Engineering Officer
            </div>
          </div>
          <div>
            <div className="font-bold uppercase text-[10px] text-slate-400">Verified By</div>
            <div className="mt-4 pt-2 border-t border-slate-300 font-medium">
              {profile.name} ({profile.jobTitle})
            </div>
          </div>
          <div>
            <div className="font-bold uppercase text-[10px] text-slate-400">Approved By</div>
            <div className="mt-4 pt-2 border-t border-slate-300 font-medium">
              Head of Production / General Manager
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
