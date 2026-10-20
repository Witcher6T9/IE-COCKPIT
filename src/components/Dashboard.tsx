/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Layers,
  ArrowRight,
  Clock,
  PlusCircle,
  ExternalLink,
  Zap,
  Target,
  CheckSquare,
  CheckCircle2,
  XCircle,
  RotateCw,
  Gauge,
  Sliders
} from 'lucide-react';
import { LineEntry, DashboardLayout, UserProfile } from '../types';
import { calculateFactoryOverall, calculateLineMetrics, formatDateLabel } from '../utils';
import { DailyProductivityInsights } from './DailyProductivityInsights';
import { ROLE_TIERS } from '../mockData';

interface DashboardProps {
  lines: LineEntry[];
  todayDate: string;
  layout: DashboardLayout;
  onNavigate: (tab: string) => void;
  onSelectLine: (lineNo: string) => void;
  checklistCompletion: number;
  checklistCounts?: {
    done: number;
    pending: number;
    notDone: number;
    total: number;
  };
  profile?: UserProfile;
  onOpenUserModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  lines,
  todayDate,
  layout,
  onNavigate,
  onSelectLine,
  checklistCompletion,
  checklistCounts = { done: 0, pending: 12, notDone: 0, total: 12 },
  profile,
  onOpenUserModal
}) => {
  const currentTier =
    ROLE_TIERS.find(t => t.id === (profile?.tierId || 'tier_0')) || ROLE_TIERS[0];

  const factory = calculateFactoryOverall(lines);

  // Sync state & live timer for the 30s auto-update card
  const [syncTime, setSyncTime] = React.useState('07:22:20 AM');
  const [isSyncing, setIsSyncing] = React.useState(false);

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSyncTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date();
      setSyncTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
      setIsSyncing(false);
    }, 600);
  };

  const formattedEyebrowDate = React.useMemo(() => {
    try {
      const d = new Date(todayDate);
      if (!isNaN(d.getTime())) {
        const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const day = d.getDate();
        const year = d.getFullYear();
        return `${month} ${day}, ${year}`;
      }
    } catch {}
    return 'SEP 17, 2026';
  }, [todayDate]);

  // Circular gauge calculations
  const gaugeTheta = ((Math.min(checklistCompletion, 100) / 100) * 360 - 90) * (Math.PI / 180);
  const gaugeDotX = 50 + 38 * Math.cos(gaugeTheta);
  const gaugeDotY = 50 + 38 * Math.sin(gaugeTheta);

  // Hourly production simulation data
  const hourlyData = [
    { hour: '08-09', actual: 480, target: 550 },
    { hour: '09-10', actual: 560, target: 600 },
    { hour: '10-11', actual: 610, target: 600 },
    { hour: '11-12', actual: 630, target: 620 },
    { hour: '12-13', actual: 350, target: 400 }, // Lunch break shift transition
    { hour: '13-14', actual: 640, target: 620 },
    { hour: '14-15', actual: 670, target: 650 },
    { hour: '15-16', actual: 690, target: 660 },
    { hour: '16-17', actual: 210, target: 200 }
  ];

  return (
    <div className="space-y-6">
      {/* ────────────────────────────────────────────────────────── */}
      {/* SCREENSHOT HERO: Industrial Engineering Daily Dashboard */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        {/* Title Header */}
        <div className="space-y-1">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#738287]">
            {formattedEyebrowDate} • OPERATIONAL CONTROL
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17343a] tracking-tight leading-tight">
            Industrial Engineering
            <br />
            Daily Dashboard
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-xs sm:text-sm text-[#527078] font-medium">
              {profile?.name || 'Ashikur Rahman'}
            </span>
            <span className="text-[#527078] hidden sm:inline">•</span>
            <button
              onClick={onOpenUserModal}
              title="Click to view or switch Active System Role & Operational Tiers"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#d9d2c2] bg-white hover:bg-[#f1eee6] hover:border-[#0e7490] text-[#17343a] font-bold text-[11px] transition-colors shadow-2xs cursor-pointer"
            >
              <span
                className="w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center shrink-0"
                style={{ backgroundColor: currentTier.color }}
              >
                {currentTier.shortCode}
              </span>
              <span>
                Active Role: <strong className="font-mono text-[#0e7490]">{currentTier.systemRole}</strong> ({currentTier.name})
              </span>
            </button>
          </div>
        </div>

        {/* Auto-Update Sync Card */}
        <div className="rounded-3xl bg-white/70 border border-[#e7e1d5] p-4 shadow-2xs space-y-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1eee6] border border-[#e7e1d5] text-xs font-semibold text-[#17343a]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Auto-Update: 30s Sync</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#527078] font-mono-numbers">
              Last synced: {syncTime}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleManualSync}
                title="Sync floor telemetry"
                className="w-8 h-8 rounded-xl bg-[#f1eee6] border border-[#d9d2c2] flex items-center justify-center text-[#527078] hover:text-[#17343a] hover:bg-[#e7e1d5] transition-colors"
              >
                <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#176f78]' : ''}`} />
              </button>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Daily Checklist Attention Required Banner */}
        <div className="rounded-2xl bg-[#fef9ec] border border-[#fde68a] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#d97706] border border-[#fde68a] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#17343a] leading-tight">
                Daily Checklist
              </div>
              <div className="font-bold text-sm text-[#17343a] leading-tight">
                Attention Required
              </div>
              <p className="text-xs text-[#785c34] mt-0.5 font-medium">
                {checklistCounts.pending + checklistCounts.notDone} of {checklistCounts.total} standard IE tasks still pending or unverified for today.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('checklist')}
            className="px-5 py-2.5 rounded-xl bg-[#d96b27] hover:bg-[#c2591b] text-white font-bold text-xs shadow-xs transition-colors shrink-0 self-start sm:self-center"
          >
            Review Now
          </button>
        </div>

        {/* Today's IE Protocol Compliance Navy Hero Card */}
        <div className="rounded-3xl bg-gradient-to-b from-[#0a3866] via-[#072a4c] to-[#041a30] text-white p-6 sm:p-7 shadow-md relative overflow-hidden space-y-5">
          {/* Ambient subtle light glow */}
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold tracking-wider uppercase text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>TODAY'S IE PROTOCOL COMPLIANCE</span>
          </div>

          {/* Overall Standard Completion Headline */}
          <div className="space-y-1">
            <div className="text-sm font-medium text-sky-100/90">
              Overall Standard Completion
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl sm:text-7xl font-extrabold font-mono-numbers tracking-tight text-white leading-none">
                {checklistCompletion}
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono-numbers leading-none">
                %
              </span>
            </div>
            <div className="text-xs text-sky-200/80 font-medium pt-1">
              {checklistCounts.done} Completed • {checklistCounts.pending} Pending • {checklistCounts.notDone} Marked No
            </div>
          </div>

          {/* Horizontal Line Progress */}
          <div className="h-2 w-full bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-700 ease-out"
              style={{ width: `${Math.max(checklistCompletion, 0)}%` }}
            />
          </div>

          {/* Circular Radial Gauge */}
          <div className="pt-2 flex justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Track circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-white/15"
                  strokeWidth="7"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-amber-400 transition-all duration-700 ease-out"
                  strokeWidth="7"
                  strokeDasharray={238.76}
                  strokeDashoffset={238.76 * (1 - Math.min(checklistCompletion, 100) / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Glowing dot on arc */}
                <circle
                  cx={gaugeDotX}
                  cy={gaugeDotY}
                  r="3.5"
                  className="fill-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]"
                />
              </svg>

              {/* Center percentage label */}
              <div className="absolute flex flex-col items-center justify-center text-center select-none pointer-events-none">
                <span className="text-2xl font-extrabold font-mono-numbers text-white leading-none">
                  {checklistCompletion}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200/70 mt-1">
                  SCORE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Three Status Cards at the Bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: DONE */}
          <div className="rounded-2xl bg-white border border-[#e7e1d5] border-l-[5px] border-l-emerald-500 p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wide">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span>DONE</span>
            </div>
            <div className="text-4xl font-extrabold font-mono-numbers text-[#17343a] mt-2">
              {checklistCounts.done}
            </div>
            <div className="text-xs text-[#527078] mt-1 font-medium">
              of {checklistCounts.total} IE tasks
            </div>
          </div>

          {/* Card 2: PENDING */}
          <div className="rounded-2xl bg-white border border-[#e7e1d5] border-l-[5px] border-l-amber-500 p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wide">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span>PENDING</span>
            </div>
            <div className="text-4xl font-extrabold font-mono-numbers text-[#17343a] mt-2">
              {checklistCounts.pending}
            </div>
            <div className="text-xs text-[#527078] mt-1 font-medium">
              in review / progress
            </div>
          </div>

          {/* Card 3: NOT DONE */}
          <div className="rounded-2xl bg-white border border-[#e7e1d5] border-l-[5px] border-l-rose-500 p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wide">
              <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <span>NOT DONE</span>
            </div>
            <div className="text-4xl font-extrabold font-mono-numbers text-[#17343a] mt-2">
              {checklistCounts.notDone}
            </div>
            <div className="text-xs text-[#527078] mt-1 font-medium">
              marked non-compliant
            </div>
          </div>
        </div>
      </section>

      {/* 4 Key Metrics Cards */}
      {layout.showStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Overall Efficiency */}
          <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#527078] font-bold uppercase tracking-wider mb-2">
              <span>Factory Efficiency</span>
              <div className="w-8 h-8 rounded-xl bg-[#dceceb] text-[#176f78] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#17343a] tracking-tight">
                {factory.overallEfficiency}%
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                +2.4% vs 85.0% Target
              </span>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-[#f1eee6] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#176f78] transition-all duration-500"
                  style={{ width: `${Math.min(factory.overallEfficiency, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-[#527078] mt-1 font-mono-numbers">
                <span>Produced: {(factory.totalProducedMinutes ?? 0).toLocaleString()} min</span>
                <span>Available: {(factory.totalAvailableMinutes ?? 0).toLocaleString()} min</span>
              </div>
            </div>
          </div>

          {/* 2. Total Achieved Production */}
          <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#527078] font-bold uppercase tracking-wider mb-2">
              <span>Total Production Output</span>
              <div className="w-8 h-8 rounded-xl bg-[#f8e5d7] text-[#e6813e] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#17343a] tracking-tight">
                {(factory.totalAchievedProd ?? 0).toLocaleString()}
              </span>
              <span className="text-xs text-[#527078] font-mono-numbers">
                / {(factory.totalTargetProd ?? 0).toLocaleString()} Pcs
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#527078]">
              <span className="font-medium">Target Achievement</span>
              <span className="font-bold font-mono-numbers text-[#17343a]">
                {Math.round((factory.totalAchievedProd / factory.totalTargetProd) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#f1eee6] overflow-hidden mt-1">
              <div
                className="h-full rounded-full bg-[#e6813e] transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (factory.totalAchievedProd / factory.totalTargetProd) * 100,
                    100
                  )}%`
                }}
              ></div>
            </div>
          </div>

          {/* 3. Manpower & Attendance */}
          <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#527078] font-bold uppercase tracking-wider mb-2">
              <span>Sewing Manpower Attendance</span>
              <div className="w-8 h-8 rounded-xl bg-[#f5e9c8] text-[#c9982f] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#17343a] tracking-tight">
                {factory.attendanceRate}%
              </span>
              <span className="text-xs text-[#527078]">Present Rate</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[#527078]">
                Present: <strong className="text-[#17343a] font-mono-numbers">{factory.totalPresent}</strong>
              </span>
              <span className="text-rose-600 font-bold">
                Absent: <span className="font-mono-numbers">{factory.totalAbsent}</span>
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#f1eee6] overflow-hidden mt-1 flex">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${factory.attendanceRate}%` }}
              ></div>
              <div
                className="h-full bg-rose-400"
                style={{ width: `${100 - factory.attendanceRate}%` }}
              ></div>
            </div>
          </div>

          {/* 4. Active Sewing Lines */}
          <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#527078] font-bold uppercase tracking-wider mb-2">
              <span>Active Sewing Lines</span>
              <div className="w-8 h-8 rounded-xl bg-[#e5eaeb] text-[#3f5a60] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#17343a] tracking-tight">
                {factory.activeLinesCount}
              </span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                100% Running
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#527078]">
              <span>In-Line Buffer WIP:</span>
              <span className="font-mono-numbers font-bold text-[#17343a]">
                {(factory.totalWip ?? 0).toLocaleString()} pcs
              </span>
            </div>
            <div className="text-[10px] text-[#527078] mt-1">
              Lines: {lines.map(l => `L${l.lineNo}`).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Daily Productivity Insights: Shift Target vs Actual Gap Progress Indicator */}
      <DailyProductivityInsights
        lines={lines}
        onSelectLine={onSelectLine}
        onNavigate={onNavigate}
      />

      {/* Real-time Running Lines Table */}
      <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-[#17343a] tracking-tight">
              Running Sewing Lines Status & Telemetry
            </h2>
            <p className="text-xs text-[#527078]">
              Current shift output, SMV ratings, manpower balance, and bottleneck stations
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onNavigate('simulator')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#dceceb] text-[#176f78] hover:bg-[#cde4e3] text-xs font-bold transition-colors shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>IE Simulator</span>
            </button>
            <button
              onClick={() => onNavigate('linedata')}
              className="flex items-center gap-1 text-xs font-bold text-[#176f78] hover:text-[#12555c] transition-colors py-1.5 px-2"
            >
              <span>Manage Lines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e7e1d5] text-[#527078] uppercase text-[10px] font-bold tracking-wider">
                <th className="py-2.5 px-3">Line & Floor</th>
                <th className="py-2.5 px-3">Buyer & Style</th>
                <th className="py-2.5 px-3">SMV</th>
                <th className="py-2.5 px-3">Manpower</th>
                <th className="py-2.5 px-3">Target / Achieved</th>
                <th className="py-2.5 px-3">Efficiency %</th>
                <th className="py-2.5 px-3">Curve / Balance</th>
                <th className="py-2.5 px-3">Bottleneck Station</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e1d5]">
              {lines.map(line => {
                const metrics = calculateLineMetrics(line);
                const isOverTarget = metrics.efficiencyPct >= line.targetEff;

                return (
                  <tr
                    key={line.id}
                    className="hover:bg-[#f1eee6]/60 transition-colors group cursor-pointer"
                    onClick={() => {
                      onSelectLine(line.lineNo);
                      onNavigate('linedata');
                    }}
                  >
                    {/* Line & Floor */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#17343a] text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Line {line.lineNo}
                      </div>
                      <div className="text-[10px] text-[#527078]">{line.floor}</div>
                    </td>

                    {/* Buyer & Style */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#17343a]">{line.buyer}</div>
                      <div className="text-[11px] text-[#527078] truncate max-w-[140px]" title={line.style}>
                        {line.style}
                      </div>
                    </td>

                    {/* SMV */}
                    <td className="py-3 px-3 font-mono-numbers font-medium text-[#17343a]">
                      {line.smv.toFixed(2)} min
                    </td>

                    {/* Manpower */}
                    <td className="py-3 px-3">
                      <div className="font-mono-numbers text-[#17343a]">
                        <strong>{metrics.totalPresentMP}</strong> Present
                      </div>
                      <div className="text-[10px] text-rose-600 font-mono-numbers">
                        {metrics.totalAbsentMP > 0 ? `${metrics.totalAbsentMP} Absent` : 'Full MP'}
                      </div>
                    </td>

                    {/* Target / Achieved */}
                    <td className="py-3 px-3 font-mono-numbers">
                      <div className="font-bold text-[#17343a]">
                        {(line.achievedProd ?? 0).toLocaleString()} pcs
                      </div>
                      <div className="text-[10px] text-[#527078]">
                        Target: {(line.targetProd ?? 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Efficiency % */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-display text-base font-bold px-2 py-0.5 rounded-md ${
                            isOverTarget
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {metrics.efficiencyPct}%
                        </span>
                      </div>
                      <div className="text-[10px] text-[#527078] mt-0.5">
                        Target: {line.targetEff}%
                      </div>
                    </td>

                    {/* Curve / Balance */}
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#dceceb] text-[#176f78]">
                        {line.buildUp.day === 'stable' ? 'Stable Run' : `Day ${line.buildUp.day}`}
                      </span>
                      <div className="text-[10px] text-[#527078] mt-0.5 truncate max-w-[110px]" title={line.balanceNotes}>
                        {line.balanceMethod}
                      </div>
                    </td>

                    {/* Bottleneck Station */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-[#17343a]">
                        {line.bottleneck.status === 'high' && (
                          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                        )}
                        <span className="truncate max-w-[130px]" title={line.bottleneck.station}>
                          {line.bottleneck.station}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#527078] font-mono-numbers">
                        CT: {line.bottleneck.cycleTime}s (Target: {line.bottleneck.targetCT}s)
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#176f78] group-hover:underline">
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Line Balancing Graph & Hour-by-Hour Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Balancing Graph / Learning Curve */}
        {layout.showBalancingGraph && (
          <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-[#17343a] tracking-tight">
                    Line Balancing & Learning Curve Ramp-Up
                  </h3>
                  <p className="text-xs text-[#527078]">
                    Planned vs achieved ramp-up progression across style start days
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase bg-[#dceceb] text-[#176f78] px-2 py-0.5 rounded">
                  IE Standard
                </span>
              </div>

              {/* Learning Curve Stage Cards */}
              <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                <div className="p-2 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
                  <div className="text-[10px] text-[#527078] uppercase font-bold">Day 01</div>
                  <div className="font-display text-lg font-bold text-[#17343a]">60%</div>
                  <div className="text-[9px] text-emerald-600 font-bold">L21 on Day 1</div>
                </div>
                <div className="p-2 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
                  <div className="text-[10px] text-[#527078] uppercase font-bold">Day 02</div>
                  <div className="font-display text-lg font-bold text-[#17343a]">75%</div>
                  <div className="text-[9px] text-emerald-600 font-bold">L19 on Day 2</div>
                </div>
                <div className="p-2 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
                  <div className="text-[10px] text-[#527078] uppercase font-bold">Day 03</div>
                  <div className="font-display text-lg font-bold text-[#17343a]">85%</div>
                  <div className="text-[9px] text-[#527078]">Build-up</div>
                </div>
                <div className="p-2 rounded-xl bg-[#dceceb] border border-[#176f78]/30">
                  <div className="text-[10px] text-[#176f78] uppercase font-bold">Day 04+</div>
                  <div className="font-display text-lg font-bold text-[#176f78]">90-95%</div>
                  <div className="text-[9px] text-[#176f78] font-bold">L18, L20, L24</div>
                </div>
              </div>

              {/* Visual SVG Curve */}
              <div className="h-44 w-full relative pt-2">
                <svg viewBox="0 0 400 130" className="w-full h-full overflow-visible">
                  {/* Grid lines */}
                  <line x1="40" y1="15" x2="380" y2="15" stroke="#e7e1d5" strokeDasharray="3 3" />
                  <line x1="40" y1="45" x2="380" y2="45" stroke="#e7e1d5" strokeDasharray="3 3" />
                  <line x1="40" y1="75" x2="380" y2="75" stroke="#e7e1d5" strokeDasharray="3 3" />
                  <line x1="40" y1="105" x2="380" y2="105" stroke="#e7e1d5" strokeDasharray="3 3" />

                  {/* Y Axis labels */}
                  <text x="10" y="20" fontSize="9" fill="#527078" fontFamily="IBM Plex Mono">100%</text>
                  <text x="10" y="50" fontSize="9" fill="#527078" fontFamily="IBM Plex Mono">80%</text>
                  <text x="10" y="80" fontSize="9" fill="#527078" fontFamily="IBM Plex Mono">60%</text>
                  <text x="10" y="110" fontSize="9" fill="#527078" fontFamily="IBM Plex Mono">40%</text>

                  {/* Planned Target Line (Dashed Orange) */}
                  <path
                    d="M 60 80 Q 150 45, 240 30 T 360 22"
                    fill="none"
                    stroke="#e6813e"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />

                  {/* Achieved Curve (Solid Teal) */}
                  <path
                    d="M 60 76 Q 150 38, 240 26 T 360 18"
                    fill="none"
                    stroke="#176f78"
                    strokeWidth="3.5"
                  />

                  {/* Points */}
                  <circle cx="60" cy="76" r="4.5" fill="#176f78" />
                  <circle cx="150" cy="38" r="4.5" fill="#176f78" />
                  <circle cx="240" cy="26" r="4.5" fill="#176f78" />
                  <circle cx="360" cy="18" r="5" fill="#176f78" />

                  {/* X Axis labels */}
                  <text x="50" y="125" fontSize="10" fill="#527078" fontWeight="bold">Day 1</text>
                  <text x="140" y="125" fontSize="10" fill="#527078" fontWeight="bold">Day 2</text>
                  <text x="230" y="125" fontSize="10" fill="#527078" fontWeight="bold">Day 3</text>
                  <text x="345" y="125" fontSize="10" fill="#176f78" fontWeight="bold">Peak (D4)</text>
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#e7e1d5] text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs text-[#17343a] font-medium">
                  <span className="w-3 h-1 bg-[#176f78] rounded"></span> Actual Output Curve
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#527078]">
                  <span className="w-3 h-1 bg-[#e6813e] rounded border-b border-dashed"></span> Planned Ramp-up
                </span>
              </div>
              <button
                onClick={() => onNavigate('linedata')}
                className="text-xs font-bold text-[#176f78] hover:underline"
              >
                View Balancing Graphs →
              </button>
            </div>
          </div>
        )}

        {/* Hour-by-Hour Production */}
        {layout.showIO && (
          <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-[#17343a] tracking-tight">
                    Hourly Factory Output (Hour-by-Hour)
                  </h3>
                  <p className="text-xs text-[#527078]">
                    Tracking hourly piece output against 620 pcs/hr standard pace
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>On Pace</span>
                </div>
              </div>

              {/* Hour bars */}
              <div className="space-y-2 mt-4">
                {hourlyData.map(h => {
                  const pct = Math.min((h.actual / h.target) * 100, 100);
                  const isMet = h.actual >= h.target;

                  return (
                    <div key={h.hour} className="flex items-center gap-3 text-xs">
                      <span className="w-14 font-mono-numbers text-[11px] text-[#527078] font-bold">
                        {h.hour}
                      </span>
                      <div className="flex-1 h-3.5 rounded-md bg-[#f1eee6] overflow-hidden relative">
                        <div
                          className={`h-full rounded-md transition-all duration-300 ${
                            isMet ? 'bg-[#176f78]' : 'bg-[#e6813e]'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <div className="w-24 text-right font-mono-numbers text-[11px]">
                        <strong className="text-[#17343a]">{h.actual}</strong>
                        <span className="text-[#527078]">/{h.target}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#e7e1d5] text-xs mt-3">
              <span className="text-[#527078]">Cumulative today: <strong className="text-[#17343a] font-mono-numbers">{(factory.totalAchievedProd ?? 0).toLocaleString()} pcs</strong></span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Current rate: 642 pcs/hr</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottlenecks & Style Changeovers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Bottlenecks */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-[#17343a] tracking-tight">
                Floor Bottlenecks & Cycle Time Watchlist
              </h3>
              <p className="text-xs text-[#527078]">
                Stations with observed cycle time exceeding takt/target pace
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
              Live Audited
            </span>
          </div>

          <div className="space-y-3">
            {lines.map(line => (
              <div
                key={line.id}
                className="p-3 rounded-xl border border-[#e7e1d5] bg-[#f1eee6]/50 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#176f78] bg-[#dceceb] px-1.5 py-0.5 rounded">
                      L{line.lineNo}
                    </span>
                    <span className="font-bold text-xs text-[#17343a]">
                      {line.bottleneck.station}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        line.bottleneck.status === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {line.bottleneck.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#527078] mt-1">
                    <strong>Action:</strong> {line.bottleneck.action || 'Standard operation monitored'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono-numbers font-bold text-xs text-[#17343a]">
                    {line.bottleneck.cycleTime}s
                  </div>
                  <div className="text-[10px] text-[#527078] font-mono-numbers">
                    Target: {line.bottleneck.targetCT}s
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Style Changeovers */}
        {layout.showUpcoming && (
          <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-[#17343a] tracking-tight">
                  Upcoming Style Changeovers & T.R Samples
                </h3>
                <p className="text-xs text-[#527078]">
                  Critical 10-day style input schedules and technical sample readiness
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#dceceb] text-[#176f78]">
                10-Day File
              </span>
            </div>

            <div className="space-y-3">
              {lines.map(line => (
                <div
                  key={line.id}
                  className="p-3 rounded-xl border border-[#e7e1d5] bg-[#f1eee6]/50 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#176f78]">Line {line.lineNo}</span>
                      <span className="font-bold text-xs text-[#17343a]">{line.nextStyle}</span>
                    </div>
                    <div className="text-[11px] text-[#527078] mt-0.5">
                      Order Qty: {(line.orderQty ?? 0).toLocaleString()} pcs • Buyer: {line.buyer || 'General'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold font-mono-numbers bg-[#f1eee6] border border-[#d9d2c2] text-[#17343a]">
                      {line.nextStyleDate}
                    </span>
                    <div className="text-[10px] text-[#176f78] font-bold mt-0.5">
                      T.R Sample Ready
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
