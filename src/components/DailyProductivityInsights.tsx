/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Zap,
  Gauge,
  HelpCircle,
  Filter
} from 'lucide-react';
import { LineEntry } from '../types';
import { calculateLineMetrics } from '../utils';

interface DailyProductivityInsightsProps {
  lines: LineEntry[];
  onSelectLine?: (lineNo: string) => void;
  onNavigate?: (tab: string) => void;
}

export const DailyProductivityInsights: React.FC<DailyProductivityInsightsProps> = ({
  lines,
  onSelectLine,
  onNavigate
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'gap' | 'ahead'>('all');

  // Aggregated totals across all active sewing lines
  const totalTargetProd = lines.reduce((sum, l) => sum + l.targetProd, 0);
  const totalAchievedProd = lines.reduce((sum, l) => sum + l.achievedProd, 0);
  const totalGapUnits = totalAchievedProd - totalTargetProd; // negative = shortfall, positive = surplus
  const gapPercentage = totalTargetProd > 0 ? (totalGapUnits / totalTargetProd) * 100 : 0;
  const progressRatio = totalTargetProd > 0 ? Math.min((totalAchievedProd / totalTargetProd) * 100, 100) : 0;

  // Shift timing metrics (Standard 8.0 hr sewing shift, currently simulated at 6.5 hours elapsed)
  const shiftHoursTotal = 8.0;
  const shiftHoursElapsed = 6.5;
  const shiftHoursRemaining = Math.max(0, shiftHoursTotal - shiftHoursElapsed);
  const shiftTimeElapsedPct = (shiftHoursElapsed / shiftHoursTotal) * 100; // 81.25%

  // Current pace vs pace required to eliminate the gap
  const currentRunRatePerHour = shiftHoursElapsed > 0 ? Math.round(totalAchievedProd / shiftHoursElapsed) : 0;
  const targetStandardPacePerHour = Math.round(totalTargetProd / shiftHoursTotal);
  const unitsRemainingToTarget = Math.max(0, totalTargetProd - totalAchievedProd);
  const requiredRunRatePerHour =
    shiftHoursRemaining > 0 ? Math.round(unitsRemainingToTarget / shiftHoursRemaining) : 0;

  // Projected output at current pace
  const projectedShiftOutput = Math.round(totalAchievedProd + currentRunRatePerHour * shiftHoursRemaining);
  const projectedVsTargetPct = totalTargetProd > 0 ? Math.round((projectedShiftOutput / totalTargetProd) * 100) : 0;

  // Pace Delta: output % vs time elapsed %
  const paceDeltaPct = Math.round((progressRatio - shiftTimeElapsedPct) * 10) / 10;
  const isAheadOfTimePace = paceDeltaPct >= 0;

  // Filter lines
  const filteredLines = lines.filter(line => {
    const gap = line.achievedProd - line.targetProd;
    if (filterMode === 'gap') return gap < 0;
    if (filterMode === 'ahead') return gap >= 0;
    return true;
  });

  const linesWithGapCount = lines.filter(l => l.achievedProd < l.targetProd).length;
  const linesAheadCount = lines.filter(l => l.achievedProd >= l.targetProd).length;

  return (
    <section className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 sm:p-6 shadow-xs space-y-6">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e7e1d5] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#dceceb] text-[#176f78] flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Shift Telemetry & Variance</span>
            </span>
            <span className="text-xs text-[#527078] font-medium">
              Hour 6.5 of 8.0 • Shift A
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-[#17343a] tracking-tight flex items-center gap-2">
            <span>Daily Productivity Insights</span>
          </h2>
          <p className="text-xs text-[#527078] mt-0.5">
            Real-time variance analysis between shift target quotas and floor outputs with dynamic recovery pace forecasting.
          </p>
        </div>

        {/* Status Pill Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
              totalGapUnits >= 0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : Math.abs(totalGapUnits) < 500
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {totalGapUnits >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-600" />
            )}
            <span>
              {totalGapUnits >= 0
                ? `+${(totalGapUnits ?? 0).toLocaleString()} Pcs Above Target`
                : `${Math.abs(totalGapUnits ?? 0).toLocaleString()} Pcs Production Gap`}
            </span>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. MAIN PRODUCTION GAP PROGRESS INDICATOR */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white border border-[#e7e1d5] p-5 shadow-2xs space-y-4">
        {/* Top Numbers Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#527078] mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#176f78]" />
              <span>Shift Target vs Actual Output Progress</span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#17343a] font-mono-numbers">
                  {(totalAchievedProd ?? 0).toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-[#527078]">
                  / {(totalTargetProd ?? 0).toLocaleString()} pcs
                </span>
              </div>

              <div
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono-numbers ${
                  progressRatio >= shiftTimeElapsedPct
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {progressRatio.toFixed(1)}% Completed
              </div>
            </div>
          </div>

          {/* Variance & Remaining Quota */}
          <div className="flex items-center gap-4 text-right">
            <div className="p-2.5 rounded-xl bg-[#fbfaf6] border border-[#e7e1d5]">
              <div className="text-[10px] font-bold uppercase text-[#527078]">Net Variance</div>
              <div
                className={`text-base font-extrabold font-mono-numbers ${
                  totalGapUnits >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {totalGapUnits >= 0 ? `+${(totalGapUnits ?? 0).toLocaleString()}` : `${(totalGapUnits ?? 0).toLocaleString()}`} pcs
              </div>
              <div className="text-[10px] text-[#738287] font-medium font-mono-numbers">
                ({gapPercentage > 0 ? `+${gapPercentage.toFixed(1)}` : gapPercentage.toFixed(1)}%)
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#fbfaf6] border border-[#e7e1d5]">
              <div className="text-[10px] font-bold uppercase text-[#527078]">Remaining To Quota</div>
              <div className="text-base font-extrabold font-mono-numbers text-[#17343a]">
                {(unitsRemainingToTarget ?? 0).toLocaleString()} pcs
              </div>
              <div className="text-[10px] text-[#527078] font-medium">
                in 1.5 hrs remaining
              </div>
            </div>
          </div>
        </div>

        {/* The Multi-Segment Visual Progress Indicator */}
        <div className="space-y-2 pt-2">
          {/* Progress Bar Container */}
          <div className="relative h-6 w-full rounded-xl bg-[#f1eee6] border border-[#d9d2c2] overflow-hidden p-0.5">
            {/* Achieved Units Bar */}
            <div
              className={`h-full rounded-lg transition-all duration-700 flex items-center justify-end px-2 text-[10px] font-bold text-white font-mono-numbers ${
                progressRatio >= 100
                  ? 'bg-emerald-600'
                  : progressRatio >= 80
                  ? 'bg-[#176f78]'
                  : 'bg-amber-600'
              }`}
              style={{ width: `${progressRatio}%` }}
            >
              {progressRatio >= 18 && `${progressRatio.toFixed(1)}%`}
            </div>

            {/* Shift Time Elapsed Marker (Vertical Line Pin) */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#d96b27] z-10 pointer-events-none"
              style={{ left: `${shiftTimeElapsedPct}%` }}
              title={`Shift Time Elapsed: ${shiftTimeElapsedPct.toFixed(1)}%`}
            >
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#d96b27] rotate-45" />
            </div>
          </div>

          {/* Scale Labels & Time Pace Marker Note */}
          <div className="flex items-center justify-between text-[11px] text-[#527078]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#176f78] inline-block" />
              <span>
                Actual Production: <strong className="text-[#17343a] font-mono-numbers">{(totalAchievedProd ?? 0).toLocaleString()} pcs</strong> ({progressRatio.toFixed(1)}%)
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[#d96b27] font-semibold">
              <Clock className="w-3 h-3" />
              <span>
                Shift Elapsed Marker: <strong className="font-mono-numbers">{shiftTimeElapsedPct.toFixed(1)}%</strong> ({shiftHoursElapsed}h of {shiftHoursTotal}h)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#f1eee6] border border-[#d9d2c2] inline-block" />
              <span>
                Shift Target: <strong className="text-[#17343a] font-mono-numbers">{(totalTargetProd ?? 0).toLocaleString()} pcs</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic IE Pace Recommendation Banner */}
        <div className="rounded-xl bg-[#fbfaf6] border border-[#e7e1d5] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isAheadOfTimePace ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-[#17343a]">
                {isAheadOfTimePace
                  ? `Floor Output is +${paceDeltaPct}% Ahead of Elapsed Shift Time`
                  : `Floor Output is Lagging Shift Time by ${Math.abs(paceDeltaPct)}%`}
              </div>
              <div className="text-[#527078] text-[11px]">
                Current speed: <strong className="text-[#17343a] font-mono-numbers">{currentRunRatePerHour} pcs/hr</strong> •
                Required speed to clear gap: <strong className="text-[#17343a] font-mono-numbers">{requiredRunRatePerHour} pcs/hr</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-[#527078] uppercase font-bold">Projected Shift Output</span>
              <div className="font-display font-bold text-sm text-[#17343a] font-mono-numbers">
                ~{(projectedShiftOutput ?? 0).toLocaleString()} pcs ({projectedVsTargetPct}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. LINE-BY-LINE GAP BREAKDOWN MATRIX */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold uppercase text-[#17343a] tracking-tight">
              Line-by-Line Production Gap & Recovery Breakdown
            </h3>
            <p className="text-[11px] text-[#527078]">
              Inspect variance for each sewing line to isolate bottleneck drivers and balance offsets.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#f1eee6] p-1 rounded-xl border border-[#d9d2c2] text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-[#17343a] shadow-xs'
                  : 'text-[#527078] hover:text-[#17343a]'
              }`}
            >
              All Lines ({lines.length})
            </button>
            <button
              onClick={() => setFilterMode('gap')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                filterMode === 'gap'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-[#527078] hover:text-rose-600'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>With Gap ({linesWithGapCount})</span>
            </button>
            <button
              onClick={() => setFilterMode('ahead')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                filterMode === 'ahead'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-[#527078] hover:text-emerald-600'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>On Target / Ahead ({linesAheadCount})</span>
            </button>
          </div>
        </div>

        {/* Lines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLines.map(line => {
            const metrics = calculateLineMetrics(line);
            const lineGap = line.achievedProd - line.targetProd;
            const linePct = line.targetProd > 0 ? (line.achievedProd / line.targetProd) * 100 : 0;
            const isAhead = lineGap >= 0;
            const isCritical = linePct < 80;

            return (
              <div
                key={line.id}
                className="rounded-2xl border border-[#e7e1d5] bg-white p-4 shadow-2xs hover:border-[#176f78]/50 transition-all cursor-pointer group"
                onClick={() => {
                  if (onSelectLine) onSelectLine(line.lineNo);
                  if (onNavigate) onNavigate('linedata');
                }}
              >
                {/* Top Row: Line & Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-[#dceceb] text-[#176f78] font-mono-numbers">
                      Line {line.lineNo}
                    </span>
                    <span className="text-[11px] font-medium text-[#527078] truncate max-w-[120px]">
                      {line.buyer} • {line.style}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono-numbers ${
                      isAhead
                        ? 'bg-emerald-100 text-emerald-800'
                        : isCritical
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isAhead ? `+${lineGap} pcs` : `${lineGap} pcs`}
                  </span>
                </div>

                {/* Numbers */}
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono-numbers text-[#17343a]">
                      {(line.achievedProd ?? 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-[#527078] font-mono-numbers">
                      / {(line.targetProd ?? 0).toLocaleString()} pcs
                    </span>
                  </div>
                  <div className="text-xs font-bold font-mono-numbers text-[#17343a]">
                    {linePct.toFixed(1)}%
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="h-2 w-full rounded-full bg-[#f1eee6] overflow-hidden relative mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAhead
                        ? 'bg-emerald-500'
                        : isCritical
                        ? 'bg-rose-500'
                        : 'bg-[#e6813e]'
                    }`}
                    style={{ width: `${Math.min(linePct, 100)}%` }}
                  />
                </div>

                {/* Details Footer */}
                <div className="flex items-center justify-between text-[10px] text-[#527078] pt-2 border-t border-[#f1eee6]">
                  <div className="truncate max-w-[180px]">
                    <span className="font-semibold text-[#17343a]">Bottleneck:</span>{' '}
                    <span>{line.bottleneck.station}</span>
                  </div>

                  <span className="inline-flex items-center gap-0.5 font-bold text-[#176f78] group-hover:underline shrink-0">
                    <span>Inspect</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
