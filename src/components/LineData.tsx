/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Save,
  Plus,
  TrendingUp,
  AlertTriangle,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  Sliders,
  ChevronDown,
  ChevronRight,
  Activity,
  Calendar,
  Info,
  Check,
  Flame,
  ArrowUpRight,
  Percent,
  Timer
} from 'lucide-react';
import { LineEntry, StyleNature, SMVWeight, LearningCurveDayRecord, BalancingLossAnalysis } from '../types';
import { calculateLineMetrics } from '../utils';
import {
  getSMVWeight,
  getProgressionTargetEff,
  generateLineLearningCurve,
  calculateBalancingLossAnalysis
} from '../data/learningCurveMatrix';
import { StyleProgressionModal } from './StyleProgressionModal';

interface LineDataProps {
  lines: LineEntry[];
  selectedLineNo: string;
  onSelectLineNo: (lineNo: string) => void;
  onSaveLine: (line: LineEntry) => void;
  onAddNewLine: () => void;
  onNavigate?: (tab: string) => void;
}

export const LineData: React.FC<LineDataProps> = ({
  lines,
  selectedLineNo,
  onSelectLineNo,
  onSaveLine,
  onAddNewLine,
  onNavigate
}) => {
  const currentLine = lines.find(l => l.lineNo === selectedLineNo) || lines[0];

  // Local draft state for editing
  const [formData, setFormData] = useState<LineEntry>(() => initializeLineData(currentLine));
  const [saveToast, setSaveToast] = useState(false);
  const [showProgressionModal, setShowProgressionModal] = useState(false);

  // Accordion open states for the 7 sections from Image 1
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    section1: true, // Line Setup & IE Planning
    section2: false, // Production Flow & Handoff
    section3: false, // Manpower Allocation & Absenteeism Balancing
    section4: false, // Top 5 Meeting Monitoring
    section5: false, // Bottleneck Flow Analysis & Cycle Time Checking
    section6: false, // Time / Production Study
    section7: true   // Line Build-Up & Learning Curve Tracking (6 Days)
  });

  // Sync draft when selected line changes
  useEffect(() => {
    if (currentLine) {
      setFormData(initializeLineData(currentLine));
    }
  }, [currentLine?.lineNo, currentLine?.id]);

  function initializeLineData(entry: LineEntry): LineEntry {
    const smv = entry.smv || 1.0;
    const totalMP =
      (entry.mp?.Operator?.present ?? 28) +
      (entry.mp?.Helper?.present ?? 8) +
      (entry.mp?.['Iron Man']?.present ?? 3);

    const learningCurve = entry.learningCurve || generateLineLearningCurve(
      smv,
      totalMP || 40,
      entry.workingHours || 8,
      'new',
      2,
      false
    );

    const tacct = Math.round(smv * 60 * 60); // Default total cycle seconds
    const maxCT = entry.bottleneck?.cycleTime || 55.0;
    const balancingAnalysis = entry.balancingAnalysis || calculateBalancingLossAnalysis(
      tacct,
      totalMP || 40,
      maxCT,
      entry.achievedProd ? Math.round(entry.achievedProd / (entry.workingHours || 8)) : 90,
      entry.targetProd ? Math.round(entry.targetProd / (entry.workingHours || 8)) : 110
    );

    return {
      ...entry,
      learningCurve,
      balancingAnalysis
    };
  }

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const toggleAllSections = (expand: boolean) => {
    setOpenSections({
      section1: expand,
      section2: expand,
      section3: expand,
      section4: expand,
      section5: expand,
      section6: expand,
      section7: expand
    });
  };

  const metrics = calculateLineMetrics(formData);
  const smvWeight = getSMVWeight(formData.smv);

  // Learning curve safe accessor
  const lc = formData.learningCurve || generateLineLearningCurve(
    formData.smv,
    metrics.totalPresentMP || 40,
    formData.workingHours || 8,
    'new',
    2,
    false
  );

  // Balancing analysis safe accessor
  const ba = formData.balancingAnalysis || calculateBalancingLossAnalysis(
    Math.round(formData.smv * 60 * 60),
    metrics.totalPresentMP || 40,
    formData.bottleneck?.cycleTime || 55.0,
    Math.round(formData.achievedProd / (formData.workingHours || 8)),
    Math.round(formData.targetProd / (formData.workingHours || 8))
  );

  // Update learning curve parameter
  const handleUpdateLearningCurve = (
    updates: Partial<typeof lc>
  ) => {
    const updatedLC = { ...lc, ...updates };
    setFormData(prev => ({
      ...prev,
      learningCurve: updatedLC
    }));
  };

  // Update day output in 6-day curve
  const handleUpdateDayRecord = (
    dayIndex: number,
    achievedQty: number,
    notes?: string
  ) => {
    const totalAvailMin = metrics.totalPresentMP * formData.workingHours * 60;
    const smv = formData.smv > 0 ? formData.smv : 1;
    const newHistory = [...lc.history];
    const record = newHistory[dayIndex];
    if (record) {
      const producedMinutes = achievedQty * smv;
      const achievedEff = totalAvailMin > 0 ? Math.round((producedMinutes / totalAvailMin) * 100) : 0;
      const variancePcs = achievedQty - record.plannedQty;
      const variancePct = record.plannedQty > 0 ? Math.round((variancePcs / record.plannedQty) * 100) : 0;

      newHistory[dayIndex] = {
        ...record,
        achievedQty,
        achievedEff,
        variancePcs,
        variancePct,
        notes: notes ?? record.notes
      };

      setFormData(prev => ({
        ...prev,
        learningCurve: {
          ...lc,
          history: newHistory
        }
      }));
    }
  };

  // Re-generate curve when Style Nature changes
  const handleStyleNatureChange = (nature: StyleNature) => {
    const isRepeat = nature === 'repeat';
    const newLC = generateLineLearningCurve(
      formData.smv,
      metrics.totalPresentMP || 40,
      formData.workingHours || 8,
      nature,
      lc.currentDay,
      isRepeat
    );
    setFormData(prev => ({
      ...prev,
      learningCurve: newLC
    }));
  };

  // Balancing Analysis update
  const handleBalancingParamChange = (field: 'tacctSeconds' | 'totalOperators' | 'maxCTSeconds' | 'currentProductionPcsPerHour' | 'estimatePcsPerHour', val: number) => {
    const updated = { ...ba, [field]: val };
    const recalculated = calculateBalancingLossAnalysis(
      field === 'tacctSeconds' ? val : ba.tacctSeconds,
      field === 'totalOperators' ? val : ba.totalOperators,
      field === 'maxCTSeconds' ? val : ba.maxCTSeconds,
      field === 'currentProductionPcsPerHour' ? val : ba.currentProductionPcsPerHour,
      field === 'estimatePcsPerHour' ? val : ba.estimatePcsPerHour
    );
    setFormData(prev => ({
      ...prev,
      balancingAnalysis: {
        ...recalculated,
        theoreticalBalancePct: ba.theoreticalBalancePct,
        balancingErrorPct: ba.balancingErrorPct,
        capacityEstimatePct: ba.capacityEstimatePct,
        rightManInRightProcess: ba.rightManInRightProcess,
        rightMachineForProcess: ba.rightMachineForProcess,
        needleDowntimeMinutes: ba.needleDowntimeMinutes
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: LineEntry = {
      ...formData,
      efficiency: metrics.efficiencyPct,
      learningCurve: lc,
      balancingAnalysis: ba
    };
    onSaveLine(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card matching Image 1 */}
      <div className="rounded-3xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#dceceb] text-[#176f78]">
                <Activity className="w-3 h-3" />
                Garment IE Floor Telemetry
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#17343a] tracking-tight">
              Line Data Collection
            </h1>
            <p className="text-xs sm:text-sm text-[#527078] mt-0.5 max-w-xl">
              Record hourly output, SMV, manpower absents, bottleneck takt cycle times, and Top 5 monitoring.
            </p>
          </div>

          {/* Line Selection Buttons & Action */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {lines.map(line => (
              <button
                key={line.id}
                onClick={() => onSelectLineNo(line.lineNo)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  line.lineNo === selectedLineNo
                    ? 'bg-[#176f78] text-white shadow-xs'
                    : 'bg-[#f1eee6] text-[#527078] hover:bg-[#e7e1d5] border border-[#d9d2c2]'
                }`}
              >
                Line {line.lineNo}
              </button>
            ))}
            <button
              onClick={onAddNewLine}
              title="Add New Sewing Line"
              className="p-1.5 rounded-xl bg-[#f1eee6] text-[#176f78] hover:bg-[#dceceb] border border-[#d9d2c2] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('simulator')}
                className="px-3 py-1.5 rounded-xl bg-[#176f78] text-white hover:bg-[#125860] text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer ml-1"
                title="Open IE Simulator"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate Setup</span>
              </button>
            )}
          </div>
        </div>

        {/* Capture Line Record Banner (Image 1 Header Banner) */}
        <div className="mt-5 p-4 rounded-2xl bg-white border border-[#e7e1d5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <div className="font-display text-base font-bold uppercase text-[#17343a]">
                Capture Line Record — Line {formData.lineNo}
              </div>
              <div className="text-xs text-[#527078]">
                {formData.floor} • Style: <strong className="text-[#17343a]">{formData.style}</strong> ({formData.buyer}) • SMV: <strong className="text-[#176f78]">{formData.smv} min</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="px-3.5 py-1.5 rounded-full bg-[#eef7f7] border border-[#b2d8d8] flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#527078] uppercase">Efficiency:</span>
              <span className="font-display text-lg font-bold text-[#176f78] font-mono-numbers">
                {metrics.efficiencyPct}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => toggleAllSections(true)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#527078] hover:bg-[#f1eee6] border border-[#d9d2c2] cursor-pointer"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={() => toggleAllSections(false)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#527078] hover:bg-[#f1eee6] border border-[#d9d2c2] cursor-pointer"
              >
                Collapse
              </button>
            </div>
          </div>
        </div>

        {/* Real-time KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
            <span className="text-[10px] text-[#527078] font-bold uppercase block">Efficiency</span>
            <div className="font-display text-xl sm:text-2xl font-bold text-[#176f78] font-mono-numbers">
              {metrics.efficiencyPct}%
            </div>
            <span className="text-[10px] text-[#527078]">Target: {formData.targetEff}%</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
            <span className="text-[10px] text-[#527078] font-bold uppercase block">Output vs Target</span>
            <div className="font-display text-xl sm:text-2xl font-bold text-[#17343a] font-mono-numbers">
              {formData.achievedProd}
              <span className="text-xs text-[#527078] font-sans font-normal"> / {formData.targetProd}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">
              {metrics.variancePcs >= 0 ? `+${metrics.variancePcs} pcs` : `${metrics.variancePcs} pcs`}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
            <span className="text-[10px] text-[#527078] font-bold uppercase block">Present Manpower</span>
            <div className="font-display text-xl sm:text-2xl font-bold text-[#17343a] font-mono-numbers">
              {metrics.totalPresentMP}
              <span className="text-xs text-[#527078] font-sans font-normal"> MP</span>
            </div>
            <span className="text-[10px] text-rose-600 font-bold">
              {metrics.totalAbsentMP} Absent ({metrics.absenteeismPct}%)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
            <span className="text-[10px] text-[#527078] font-bold uppercase block">Produced Minutes</span>
            <div className="font-display text-xl sm:text-2xl font-bold text-[#17343a] font-mono-numbers">
              {metrics.standardProducedMinutes}
            </div>
            <span className="text-[10px] text-[#527078]">Avail: {metrics.availableMinutes} min</span>
          </div>
        </div>
      </div>

      {/* Main 7 Sections from Image 1 */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* ================= SECTION 1: Line Setup & IE Planning ================= */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('section1')}
            className="w-full p-4 flex items-center justify-between bg-white hover:bg-[#f8f6f0] transition-colors border-b border-[#e7e1d5] text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#eef7f7] text-[#176f78] border border-[#c4e5e5]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold uppercase text-[#17343a]">
                  Line Setup &amp; IE Planning
                </h2>
                <p className="text-xs text-[#527078]">
                  SMV, working hours, planned manpower, buyer style specifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-numbers px-2.5 py-1 rounded-full bg-[#f1eee6] text-[#527078] font-bold">
                SMV {formData.smv}m • {smvWeight}
              </span>
              {openSections.section1 ? <ChevronDown className="w-5 h-5 text-[#527078]" /> : <ChevronRight className="w-5 h-5 text-[#527078]" />}
            </div>
          </button>

          {openSections.section1 && (
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Line Number
                  </label>
                  <input
                    type="text"
                    value={formData.lineNo}
                    onChange={e => setFormData({ ...formData, lineNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-bold text-[#17343a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Floor Location
                  </label>
                  <input
                    type="text"
                    value={formData.floor}
                    onChange={e => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] text-[#17343a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Buyer / Customer
                  </label>
                  <input
                    type="text"
                    value={formData.buyer}
                    onChange={e => setFormData({ ...formData, buyer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] text-[#17343a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Running Style Name
                  </label>
                  <input
                    type="text"
                    value={formData.style}
                    onChange={e => setFormData({ ...formData, style: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] text-[#17343a] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Standard Allowed Minutes (SMV)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.smv}
                      onChange={e => setFormData({ ...formData, smv: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold text-[#176f78]"
                    />
                    <span className="absolute right-3 top-2 text-[10px] font-bold uppercase text-[#527078]">
                      {smvWeight}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Planned Shift Hours
                  </label>
                  <input
                    type="number"
                    value={formData.workingHours}
                    onChange={e => setFormData({ ...formData, workingHours: parseInt(e.target.value) || 8 })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Planned Target Eff %
                  </label>
                  <input
                    type="number"
                    value={formData.targetEff}
                    onChange={e => setFormData({ ...formData, targetEff: parseInt(e.target.value) || 80 })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers text-[#176f78] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Planned Target Output (Pcs)
                  </label>
                  <input
                    type="number"
                    value={formData.targetProd}
                    onChange={e => setFormData({ ...formData, targetProd: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#e7e1d5]">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">Order Qty</label>
                  <input
                    type="number"
                    value={formData.orderQty}
                    onChange={e => setFormData({ ...formData, orderQty: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">Daily Input</label>
                  <input
                    type="number"
                    value={formData.dailyInput}
                    onChange={e => setFormData({ ...formData, dailyInput: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">Daily Output</label>
                  <input
                    type="number"
                    value={formData.dailyOutput}
                    onChange={e => setFormData({ ...formData, dailyOutput: parseInt(e.target.value) || 0, achievedProd: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold text-[#176f78]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">Current WIP (Pcs)</label>
                  <input
                    type="number"
                    value={formData.wip}
                    onChange={e => setFormData({ ...formData, wip: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 2: Production Flow & Handoff (Images 2 & 3) ================= */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('section2')}
            className="w-full p-4 flex items-center justify-between bg-white hover:bg-[#f8f6f0] transition-colors border-b border-[#e7e1d5] text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold uppercase text-[#17343a]">
                  Production Flow &amp; Handoff
                </h2>
                <p className="text-xs text-[#527078]">
                  Line potential, balancing loss, Debonair Unit-02 standards &amp; handoff audit
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono-numbers ${
                ba.balancingStatus === 'Stable'
                  ? 'bg-[#e6f4ea] text-[#137333]'
                  : ba.balancingStatus === 'Critical'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {ba.balancingStatus} • Loss {ba.balancingLossPct}%
              </span>
              {openSections.section2 ? <ChevronDown className="w-5 h-5 text-[#527078]" /> : <ChevronRight className="w-5 h-5 text-[#527078]" />}
            </div>
          </button>

          {openSections.section2 && (
            <div className="p-5 space-y-5 text-xs">
              {/* Debonair Ltd. Unit - 02 Production Flow & Loss Engine (Image 3) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-[#17343a]">
                      Debonair Ltd. Unit - 02 Balancing &amp; Estimated Loss Analysis
                    </h3>
                    <p className="text-[11px] text-[#527078]">
                      Takt, total operators, maximum cycle time &amp; hourly production capacity
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f1eee6] text-[#527078] uppercase">
                    Ref: Image 3 Standard
                  </span>
                </div>

                {/* Table representation matching Image 3 */}
                <div className="overflow-x-auto border border-[#d9d2c2] rounded-xl bg-white shadow-xs">
                  <table className="w-full text-center text-xs border-collapse">
                    <thead className="bg-[#f1eee6] border-b border-[#d9d2c2] text-[11px] font-bold text-[#17343a]">
                      <tr>
                        <th className="p-2 border-r border-[#e7e1d5]">Line</th>
                        <th className="p-2 border-r border-[#e7e1d5]">Buyer</th>
                        <th className="p-2 border-r border-[#e7e1d5]">Running Style</th>
                        <th className="p-2 border-r border-[#e7e1d5] bg-[#fff2e0]">TACCT (ΣT)s</th>
                        <th className="p-2 border-r border-[#e7e1d5] bg-[#fff2e0]">TTL OPTR (N)</th>
                        <th className="p-2 border-r border-[#e7e1d5] bg-[#fff2e0]">Max CT (CTmax)</th>
                        <th className="p-2 border-r border-[#e7e1d5] bg-[#fff8e8]">Balancing Loss %</th>
                        <th className="p-2 border-r border-[#e7e1d5] bg-[#fff8e8]">Balancing Status</th>
                        <th className="p-2 border-r border-[#e7e1d5]">Potential</th>
                        <th className="p-2 border-r border-[#e7e1d5]">Estimate</th>
                        <th className="p-2 border-r border-[#e7e1d5]">Min Cap</th>
                        <th className="p-2 border-r border-[#e7e1d5]">Current Prdn</th>
                        <th className="p-2">Est. Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[#fbfaf6]">
                        <td className="p-2.5 border-r border-[#e7e1d5] font-bold text-[#17343a]">{formData.lineNo}</td>
                        <td className="p-2.5 border-r border-[#e7e1d5]">{formData.buyer}</td>
                        <td className="p-2.5 border-r border-[#e7e1d5] font-medium">{formData.style}</td>
                        <td className="p-2.5 border-r border-[#e7e1d5] font-mono-numbers bg-[#fff2e0]/40 font-bold">
                          {ba.tacctSeconds}s
                        </td>
                        <td className="p-2.5 border-r border-[#e7e1d5] font-mono-numbers bg-[#fff2e0]/40">
                          {ba.totalOperators}
                        </td>
                        <td className="p-2.5 border-r border-[#e7e1d5] font-mono-numbers bg-[#fff2e0]/40 font-bold text-rose-600">
                          {ba.maxCTSeconds}s
                        </td>
                        <td className={`p-2.5 border-r border-[#e7e1d5] font-mono-numbers font-bold bg-[#fff8e8]/40 ${
                          ba.balancingLossPct < 0 ? 'text-amber-700' : ba.balancingLossPct > 25 ? 'text-rose-600' : 'text-emerald-700'
                        }`}>
                          {ba.balancingLossPct}%
                        </td>
                        <td className="p-2.5 border-r border-[#e7e1d5] bg-[#fff8e8]/40">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            ba.balancingStatus === 'Stable'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ba.balancingStatus === 'Critical'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ba.balancingStatus}
                          </span>
                        </td>
                        <td className="p-2.5 border-r border-[#e7e1d5] font-mono-numbers font-bold text-[#176f78]">{ba.potentialPcsPerHour}</td>
                        <td className="p-2.5 border-r border-[#e7e1d5] font-mono-numbers">{ba.estimatePcsPerHour}</td>
                        <td className="p-2.5 border-r border-[#e7e1d5] font-mono-numbers text-[#527078]">{ba.minCapacityPcsPerHour}</td>
                        <td className="p-2.5 border-r border-[#e7e1d5] font-mono-numbers font-bold text-[#17343a]">{ba.currentProductionPcsPerHour}</td>
                        <td className={`p-2.5 font-mono-numbers font-bold ${
                          ba.estimatedLossPct >= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}>
                          {ba.estimatedLossPct}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Edit Engine Parameters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 p-3 rounded-xl bg-white border border-[#e7e1d5]">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#527078] mb-1">
                      TACCT (ΣT) in Seconds
                    </label>
                    <input
                      type="number"
                      value={ba.tacctSeconds}
                      onChange={e => handleBalancingParamChange('tacctSeconds', parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d2c2] font-mono-numbers font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#527078] mb-1">
                      Max CT (CTmax) in Sec
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={ba.maxCTSeconds}
                      onChange={e => handleBalancingParamChange('maxCTSeconds', parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d2c2] font-mono-numbers font-bold text-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#527078] mb-1">
                      Current Hourly Output (Pcs/Hr)
                    </label>
                    <input
                      type="number"
                      value={ba.currentProductionPcsPerHour}
                      onChange={e => handleBalancingParamChange('currentProductionPcsPerHour', parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d2c2] font-mono-numbers font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#527078] mb-1">
                      Estimated Hourly Target (Pcs/Hr)
                    </label>
                    <input
                      type="number"
                      value={ba.estimatePcsPerHour}
                      onChange={e => handleBalancingParamChange('estimatePcsPerHour', parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d2c2] font-mono-numbers"
                    />
                  </div>
                </div>
              </div>

              {/* Industrial Engineering Standards Targets (Image 2) */}
              <div className="pt-3 border-t border-[#e7e1d5]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-xs font-bold uppercase text-[#17343a] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>IE Balancing &amp; Floor Execution Activity Targets (Ref: Image 2)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-[#d9d2c2] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#527078] font-bold uppercase">SEQ 01 • Theoretical Balance</div>
                      <div className="font-display text-base font-bold text-[#17343a] font-mono-numbers">
                        {ba.theoreticalBalancePct}%
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Target &gt; 95%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#d9d2c2] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#527078] font-bold uppercase">SEQ 02 • Balancing Error</div>
                      <div className="font-display text-base font-bold text-[#17343a] font-mono-numbers">
                        {ba.balancingErrorPct}%
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Target &lt; 5%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#d9d2c2] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#527078] font-bold uppercase">SEQ 03 • Capacity Estimate</div>
                      <div className="font-display text-base font-bold text-[#17343a] font-mono-numbers">
                        +{ba.capacityEstimatePct}%
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Target &gt; 10%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#d9d2c2] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#527078] font-bold uppercase">SEQ 04.1 • Right Man in Process</div>
                      <div className="text-xs font-bold text-emerald-700">100% Assigned</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        balancingAnalysis: { ...ba, rightManInRightProcess: !ba.rightManInRightProcess }
                      })}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                        ba.rightManInRightProcess ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {ba.rightManInRightProcess ? 'Verified' : 'Pending'}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#d9d2c2] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#527078] font-bold uppercase">SEQ 04.2 • Right Machine Setup</div>
                      <div className="text-xs font-bold text-emerald-700">100% Configured</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        balancingAnalysis: { ...ba, rightMachineForProcess: !ba.rightMachineForProcess }
                      })}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                        ba.rightMachineForProcess ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {ba.rightMachineForProcess ? 'Verified' : 'Pending'}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#d9d2c2] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#527078] font-bold uppercase">SEQ 05 • Needle Downtime</div>
                      <div className="font-display text-base font-bold text-[#17343a] font-mono-numbers">
                        {ba.needleDowntimeMinutes} Min
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Target 18 Min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 3: Manpower Allocation & Absenteeism Balancing ================= */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('section3')}
            className="w-full p-4 flex items-center justify-between bg-white hover:bg-[#f8f6f0] transition-colors border-b border-[#e7e1d5] text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#fef7e0] text-[#b06000] border border-[#feefa3]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold uppercase text-[#17343a]">
                  Manpower Allocation &amp; Absenteeism Balancing
                </h2>
                <p className="text-xs text-[#527078]">
                  Operators, helpers, iron men, absenteeism rate &amp; balance method
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-numbers px-2.5 py-1 rounded-full bg-[#fef7e0] text-[#8c4600] font-bold">
                Present: {metrics.totalPresentMP} • Absent: {metrics.totalAbsentMP}
              </span>
              {openSections.section3 ? <ChevronDown className="w-5 h-5 text-[#527078]" /> : <ChevronRight className="w-5 h-5 text-[#527078]" />}
            </div>
          </button>

          {openSections.section3 && (
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Operator */}
                <div className="p-3.5 rounded-xl bg-white border border-[#d9d2c2] space-y-2">
                  <div className="font-bold text-[#17343a] text-xs uppercase flex items-center justify-between">
                    <span>Machine Operators</span>
                    <span className="text-[10px] text-[#527078]">Core Sewing</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#527078] block font-bold uppercase">Present</span>
                      <input
                        type="number"
                        value={formData.mp.Operator.present}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            mp: {
                              ...formData.mp,
                              Operator: {
                                ...formData.mp.Operator,
                                present: parseInt(e.target.value) || 0
                              }
                            }
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d2c2] font-mono-numbers font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-600 block font-bold uppercase">Absent</span>
                      <input
                        type="number"
                        value={formData.mp.Operator.absent}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            mp: {
                              ...formData.mp,
                              Operator: {
                                ...formData.mp.Operator,
                                absent: parseInt(e.target.value) || 0
                              }
                            }
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d2c2] font-mono-numbers text-rose-600 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Helper */}
                <div className="p-3.5 rounded-xl bg-white border border-[#d9d2c2] space-y-2">
                  <div className="font-bold text-[#17343a] text-xs uppercase flex items-center justify-between">
                    <span>Floor Helpers</span>
                    <span className="text-[10px] text-[#527078]">Bundles &amp; Trimming</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#527078] block font-bold uppercase">Present</span>
                      <input
                        type="number"
                        value={formData.mp.Helper.present}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            mp: {
                              ...formData.mp,
                              Helper: {
                                ...formData.mp.Helper,
                                present: parseInt(e.target.value) || 0
                              }
                            }
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d2c2] font-mono-numbers font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-600 block font-bold uppercase">Absent</span>
                      <input
                        type="number"
                        value={formData.mp.Helper.absent}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            mp: {
                              ...formData.mp,
                              Helper: {
                                ...formData.mp.Helper,
                                absent: parseInt(e.target.value) || 0
                              }
                            }
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d2c2] font-mono-numbers text-rose-600 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Iron Man */}
                <div className="p-3.5 rounded-xl bg-white border border-[#d9d2c2] space-y-2">
                  <div className="font-bold text-[#17343a] text-xs uppercase flex items-center justify-between">
                    <span>Iron Men / Pressers</span>
                    <span className="text-[10px] text-[#527078]">Intermediate Press</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#527078] block font-bold uppercase">Present</span>
                      <input
                        type="number"
                        value={formData.mp['Iron Man'].present}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            mp: {
                              ...formData.mp,
                              'Iron Man': {
                                ...formData.mp['Iron Man'],
                                present: parseInt(e.target.value) || 0
                              }
                            }
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d2c2] font-mono-numbers font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-600 block font-bold uppercase">Absent</span>
                      <input
                        type="number"
                        value={formData.mp['Iron Man'].absent}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            mp: {
                              ...formData.mp,
                              'Iron Man': {
                                ...formData.mp['Iron Man'],
                                absent: parseInt(e.target.value) || 0
                              }
                            }
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d2c2] font-mono-numbers text-rose-600 font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Balancing Method & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#e7e1d5]">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Absenteeism Mitigation Method
                  </label>
                  <select
                    value={formData.balanceMethod}
                    onChange={e => setFormData({ ...formData, balanceMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] text-xs font-bold"
                  >
                    <option value="Overtime">Overtime (OT for critical stations)</option>
                    <option value="Borrowed from other line">Borrowed from Other Line / Training Pool</option>
                    <option value="Re-allocated from non-bottleneck">Re-allocated from Non-Bottleneck Process</option>
                    <option value="Float operator assigned">Multi-skilled Float Operator Assigned</option>
                    <option value="Buffer stock consumption">WIP Buffer Consumption</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Balancing Action Notes
                  </label>
                  <input
                    type="text"
                    value={formData.balanceNotes}
                    onChange={e => setFormData({ ...formData, balanceNotes: e.target.value })}
                    placeholder="e.g. 2 operators worked 1 hr OT to absorb backlog"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 4: Top 5 Meeting Monitoring ================= */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('section4')}
            className="w-full p-4 flex items-center justify-between bg-white hover:bg-[#f8f6f0] transition-colors border-b border-[#e7e1d5] text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#f3e8fd] text-[#7627bb] border border-[#e9d5ff]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold uppercase text-[#17343a]">
                  Top 5 Meeting Monitoring
                </h2>
                <p className="text-xs text-[#527078]">
                  Daily floor alignment, critical defect resolutions &amp; team attendance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                formData.top5.held === 'yes' ? 'bg-[#f3e8fd] text-[#7627bb]' : 'bg-rose-100 text-rose-700'
              }`}>
                Status: {formData.top5.held.toUpperCase()}
              </span>
              {openSections.section4 ? <ChevronDown className="w-5 h-5 text-[#527078]" /> : <ChevronRight className="w-5 h-5 text-[#527078]" />}
            </div>
          </button>

          {openSections.section4 && (
            <div className="p-5 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-white border border-[#d9d2c2]">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#17343a] uppercase">Meeting Conducted?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, top5: { ...formData.top5, held: 'yes' } })}
                      className={`px-3 py-1 rounded-lg font-bold ${
                        formData.top5.held === 'yes'
                          ? 'bg-[#176f78] text-white shadow-xs'
                          : 'bg-[#f1eee6] text-[#527078]'
                      }`}
                    >
                      YES
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, top5: { ...formData.top5, held: 'no' } })}
                      className={`px-3 py-1 rounded-lg font-bold ${
                        formData.top5.held === 'no'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-[#f1eee6] text-[#527078]'
                      }`}
                    >
                      NO
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#527078] uppercase">Attendance %:</span>
                  <input
                    type="number"
                    value={formData.top5.attendance}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        top5: { ...formData.top5, attendance: parseInt(e.target.value) || 0 }
                      })
                    }
                    className="w-20 px-2.5 py-1 rounded-lg border border-[#d9d2c2] font-mono-numbers font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1.5">
                  Top 5 Floor Review Items Discussed
                </label>
                <div className="space-y-1.5">
                  {formData.top5.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#f1eee6] text-[#17343a] font-bold flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item}
                        onChange={e => {
                          const newItems = [...formData.top5.items];
                          newItems[idx] = e.target.value;
                          setFormData({
                            ...formData,
                            top5: { ...formData.top5, items: newItems }
                          });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#d9d2c2] text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                  Meeting Resolution &amp; Supervisor Acknowledgement
                </label>
                <input
                  type="text"
                  value={formData.top5.notes || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      top5: { ...formData.top5, notes: e.target.value }
                    })
                  }
                  placeholder="Supervisor confirmed all actions acknowledged by batch chiefs"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 5: Bottleneck Flow Analysis & Cycle Time Checking ================= */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('section5')}
            className="w-full p-4 flex items-center justify-between bg-white hover:bg-[#f8f6f0] transition-colors border-b border-[#e7e1d5] text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold uppercase text-[#17343a]">
                  Bottleneck Flow Analysis &amp; Cycle Time Checking
                </h2>
                <p className="text-xs text-[#527078]">
                  Pacing station study, takt vs observed cycle times &amp; line balancing action
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-numbers px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold">
                {formData.bottleneck.station || 'Critical'} • {formData.bottleneck.cycleTime}s
              </span>
              {openSections.section5 ? <ChevronDown className="w-5 h-5 text-[#527078]" /> : <ChevronRight className="w-5 h-5 text-[#527078]" />}
            </div>
          </button>

          {openSections.section5 && (
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Critical Bottleneck Station Name
                  </label>
                  <input
                    type="text"
                    value={formData.bottleneck.station}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        bottleneck: { ...formData.bottleneck, station: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-bold text-[#17343a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Observed Cycle Time (sec)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bottleneck.cycleTime}
                    onChange={e => {
                      const ct = parseFloat(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        bottleneck: { ...formData.bottleneck, cycleTime: ct }
                      });
                      handleBalancingParamChange('maxCTSeconds', ct);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold text-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Target Cycle Time (sec)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bottleneck.targetCT}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        bottleneck: {
                          ...formData.bottleneck,
                          targetCT: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold text-[#176f78]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                  Corrective Action Taken at Station
                </label>
                <input
                  type="text"
                  value={formData.bottleneck.action}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      bottleneck: { ...formData.bottleneck, action: e.target.value }
                    })
                  }
                  placeholder="e.g. Assigned senior multi-skilled operator & added guide attachment"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 6: Time / Production Study ================= */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('section6')}
            className="w-full p-4 flex items-center justify-between bg-white hover:bg-[#f8f6f0] transition-colors border-b border-[#e7e1d5] text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold uppercase text-[#17343a]">
                  Time / Production Study
                </h2>
                <p className="text-xs text-[#527078]">
                  Stopwatch audit, standard vs observed output rate &amp; operator rating
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-numbers px-2.5 py-1 rounded-full bg-[#e0f2fe] text-[#0369a1] font-bold">
                Study: {formData.timeStudy.done.toUpperCase()} • {formData.timeStudy.observedRate} pcs/h
              </span>
              {openSections.section6 ? <ChevronDown className="w-5 h-5 text-[#527078]" /> : <ChevronRight className="w-5 h-5 text-[#527078]" />}
            </div>
          </button>

          {openSections.section6 && (
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Study Conducted
                  </label>
                  <select
                    value={formData.timeStudy.done}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        timeStudy: { ...formData.timeStudy, done: e.target.value as any }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-bold"
                  >
                    <option value="yes">YES - Full Study Completed</option>
                    <option value="partial">PARTIAL - Sample Audit Only</option>
                    <option value="no">NO - Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Study Type
                  </label>
                  <select
                    value={formData.timeStudy.type}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        timeStudy: { ...formData.timeStudy, type: e.target.value as any }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2]"
                  >
                    <option value="time">Time Study (Snap-back / Continuous)</option>
                    <option value="production">Production Study (Output Log)</option>
                    <option value="both">Both (Time &amp; Motion Analysis)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Observed Rate (Pcs / Hr)
                  </label>
                  <input
                    type="number"
                    value={formData.timeStudy.observedRate}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        timeStudy: {
                          ...formData.timeStudy,
                          observedRate: parseInt(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Standard Target Rate (Pcs / Hr)
                  </label>
                  <input
                    type="number"
                    value={formData.timeStudy.standardRate}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        timeStudy: {
                          ...formData.timeStudy,
                          standardRate: parseInt(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold text-[#176f78]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                  IE Findings &amp; Motion Waste Observations
                </label>
                <input
                  type="text"
                  value={formData.timeStudy.findings || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      timeStudy: { ...formData.timeStudy, findings: e.target.value }
                    })
                  }
                  placeholder="e.g. Material handling delay accounts for 4.2s per garment"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 7: Line Build-Up & Learning Curve Tracking (6-Day Period) ================= */}
        <div className="rounded-2xl border-2 border-[#176f78]/30 bg-[#fbfaf6] overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection('section7')}
            className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-[#eef7f7] to-white hover:bg-[#eef7f7]/70 transition-colors border-b border-[#d9d2c2] text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#176f78] text-white shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-base sm:text-lg font-bold uppercase text-[#17343a]">
                    Line Build-Up &amp; Learning Curve Tracking
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#176f78] text-white">
                    Period: 6 Days
                  </span>
                </div>
                <p className="text-xs text-[#527078]">
                  Style progression targets, ramp-up efficiency by weight class &amp; daily actuals
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-numbers px-2.5 py-1 rounded-full bg-[#dceceb] text-[#176f78] font-bold">
                Day {lc.currentDay} of 6 • Target {getProgressionTargetEff(lc.currentDay, lc.styleNature, smvWeight)}%
              </span>
              {openSections.section7 ? <ChevronDown className="w-5 h-5 text-[#527078]" /> : <ChevronRight className="w-5 h-5 text-[#527078]" />}
            </div>
          </button>

          {openSections.section7 && (
            <div className="p-5 space-y-6 text-xs">
              {/* Style Nature & Weight Configuration Banner */}
              <div className="p-4 rounded-2xl bg-white border border-[#d9d2c2] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-[#17343a]">
                      Garment Style Classification &amp; 6-Day Period Rule
                    </h3>
                    <p className="text-[11px] text-[#527078]">
                      Automatically looks up efficiency targets from the Style Progression Chart (Image 4)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowProgressionModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#176f78] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-[#125860] cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>View Full 40-Day Chart</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Style Nature Selector */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                      Style Nature
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleStyleNatureChange('new')}
                        className={`p-2.5 rounded-xl text-center font-bold transition-all ${
                          lc.styleNature === 'new'
                            ? 'bg-[#176f78] text-white shadow-xs'
                            : 'bg-[#f1eee6] text-[#527078] hover:bg-[#e7e1d5] border border-[#d9d2c2]'
                        }`}
                      >
                        New Style
                        <span className="block text-[10px] font-normal opacity-80">Initial Run</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStyleNatureChange('repeat')}
                        className={`p-2.5 rounded-xl text-center font-bold transition-all ${
                          lc.styleNature === 'repeat'
                            ? 'bg-[#8c531b] text-white shadow-xs'
                            : 'bg-[#f1eee6] text-[#527078] hover:bg-[#e7e1d5] border border-[#d9d2c2]'
                        }`}
                      >
                        Repeat Style
                        <span className="block text-[10px] font-normal opacity-80">&le; 3 Months</span>
                      </button>
                    </div>
                  </div>

                  {/* SMV Weight Classification */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                      SMV Weight Category
                    </label>
                    <div className="p-2.5 rounded-xl bg-[#f1eee6] border border-[#d9d2c2] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#17343a] capitalize">{smvWeight} weight</div>
                        <div className="text-[10px] text-[#527078]">
                          {smvWeight === 'light' ? '0 - 30 Min' : smvWeight === 'medium' ? '31 - 60 Min' : '>61 Min'}
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-md text-[11px] font-mono-numbers font-bold bg-white text-[#176f78] border border-[#d9d2c2]">
                        {formData.smv} min SMV
                      </span>
                    </div>
                  </div>

                  {/* Current Learning Curve Day */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                      Current Period Day (1 to 6)
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5, 6].map(dayNum => (
                        <button
                          key={dayNum}
                          type="button"
                          onClick={() => handleUpdateLearningCurve({ currentDay: dayNum })}
                          className={`flex-1 py-2 rounded-xl font-mono-numbers font-bold text-center transition-all ${
                            lc.currentDay === dayNum
                              ? 'bg-[#17343a] text-white shadow-xs ring-2 ring-[#176f78]'
                              : 'bg-[#f1eee6] text-[#527078] hover:bg-[#e7e1d5] border border-[#d9d2c2]'
                          }`}
                        >
                          D{dayNum}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Important Rule Banner from Image 4 */}
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#fff8e8] border border-[#f5e0b0] text-[11px] text-[#8c531b]">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Standard Rule:</strong> If any style input starts again within 3 months in the same line, it is considered a <strong>Repeat Style</strong> (higher target curve on Days 1-5). Learning curve ramp-up period is standardized to <strong>6 days</strong> before reaching normal operations.
                  </div>
                </div>
              </div>

              {/* 6-Day Period Progression Visual Comparison Bar Chart */}
              <div className="p-4 rounded-2xl bg-white border border-[#d9d2c2] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-xs font-bold uppercase text-[#17343a] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#176f78]" />
                    <span>6-Day Learning Curve Progression (Planned vs Achieved Efficiency)</span>
                  </h4>
                  <div className="flex items-center gap-3 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-[#176f78]" />
                      <span className="text-[#527078]">Planned Target</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                      <span className="text-[#527078]">Achieved Output</span>
                    </div>
                  </div>
                </div>

                {/* Bar Grid for the 6 Days */}
                <div className="grid grid-cols-6 gap-2 pt-2 border-t border-[#e7e1d5]">
                  {lc.history.slice(0, 6).map((item, idx) => {
                    const isCurrent = lc.currentDay === item.day;
                    const maxPercent = 75; // scale height up to 75%
                    const plannedHeight = Math.min(100, (item.plannedEff / maxPercent) * 100);
                    const achievedHeight = Math.min(100, ((item.achievedEff || 0) / maxPercent) * 100);

                    return (
                      <div
                        key={item.day}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-[#eef7f7] border-[#176f78] shadow-xs'
                            : 'bg-[#fbfaf6] border-[#d9d2c2]'
                        }`}
                      >
                        <div className="text-center w-full">
                          <span className={`text-[10px] font-bold block ${
                            isCurrent ? 'text-[#176f78]' : 'text-[#527078]'
                          }`}>
                            Day {item.day}
                          </span>
                          {isCurrent && (
                            <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-[#176f78] text-white uppercase inline-block">
                              Active
                            </span>
                          )}
                        </div>

                        {/* Dual Bar Display */}
                        <div className="w-full h-24 flex items-end justify-center gap-1.5 py-1">
                          {/* Planned Bar */}
                          <div
                            style={{ height: `${plannedHeight}%` }}
                            className="w-3.5 sm:w-4 bg-[#176f78] rounded-t-sm transition-all relative group cursor-pointer"
                            title={`Planned: ${item.plannedEff}%`}
                          />
                          {/* Achieved Bar */}
                          <div
                            style={{ height: `${achievedHeight}%` }}
                            className={`w-3.5 sm:w-4 rounded-t-sm transition-all cursor-pointer ${
                              item.achievedEff >= item.plannedEff
                                ? 'bg-emerald-500'
                                : item.achievedEff > 0
                                ? 'bg-amber-500'
                                : 'bg-slate-200'
                            }`}
                            title={`Achieved: ${item.achievedEff}%`}
                          />
                        </div>

                        {/* Efficiency Labels */}
                        <div className="text-center text-[10px] font-mono-numbers">
                          <span className="text-[#176f78] font-bold block">{item.plannedEff}%</span>
                          <span className={`${
                            item.achievedEff >= item.plannedEff
                              ? 'text-emerald-700 font-bold'
                              : item.achievedEff > 0
                              ? 'text-amber-700'
                              : 'text-slate-400'
                          }`}>
                            {item.achievedEff > 0 ? `${item.achievedEff}%` : '—'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day-by-Day Interactive Telemetry & Logging Table */}
              <div className="overflow-x-auto border border-[#d9d2c2] rounded-xl bg-white shadow-xs">
                <table className="w-full text-center text-xs border-collapse">
                  <thead className="bg-[#f1eee6] border-b border-[#d9d2c2] text-[11px] font-bold text-[#17343a]">
                    <tr>
                      <th className="p-2.5 border-r border-[#e7e1d5] w-20">Period Day</th>
                      <th className="p-2.5 border-r border-[#e7e1d5] bg-[#eef7f7]">Planned Eff %</th>
                      <th className="p-2.5 border-r border-[#e7e1d5] bg-[#eef7f7]">Target Pcs</th>
                      <th className="p-2.5 border-r border-[#e7e1d5] bg-[#e6f4ea]">Achieved Pcs (Log)</th>
                      <th className="p-2.5 border-r border-[#e7e1d5] bg-[#e6f4ea]">Achieved Eff %</th>
                      <th className="p-2.5 border-r border-[#e7e1d5]">Variance (Pcs)</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7e1d5]">
                    {lc.history.slice(0, 6).map((item, idx) => {
                      const isCurrent = lc.currentDay === item.day;
                      const isAhead = (item.variancePcs || 0) >= 0;

                      return (
                        <tr
                          key={item.day}
                          className={`hover:bg-[#fbfaf6] ${isCurrent ? 'bg-[#f0f9f9]' : ''}`}
                        >
                          <td className="p-2.5 border-r border-[#e7e1d5] font-bold text-[#17343a]">
                            Day - {item.day}
                            {isCurrent && (
                              <span className="block text-[9px] text-[#176f78] uppercase font-bold">Today</span>
                            )}
                          </td>
                          <td className="p-2.5 border-r border-[#e7e1d5] font-mono-numbers font-bold text-[#176f78] bg-[#eef7f7]/30">
                            {item.plannedEff}%
                          </td>
                          <td className="p-2.5 border-r border-[#e7e1d5] font-mono-numbers font-bold text-[#17343a] bg-[#eef7f7]/30">
                            {item.plannedQty} pcs
                          </td>
                          <td className="p-2 border-r border-[#e7e1d5] bg-[#e6f4ea]/30">
                            <input
                              type="number"
                              value={item.achievedQty || ''}
                              onChange={e => handleUpdateDayRecord(idx, parseInt(e.target.value) || 0)}
                              placeholder="Log output"
                              className="w-24 px-2 py-1 rounded-lg border border-[#d9d2c2] font-mono-numbers font-bold text-center bg-white text-[#17343a] focus:ring-1 focus:ring-emerald-500"
                            />
                          </td>
                          <td className="p-2.5 border-r border-[#e7e1d5] font-mono-numbers font-bold text-emerald-800 bg-[#e6f4ea]/30">
                            {item.achievedEff > 0 ? `${item.achievedEff}%` : '—'}
                          </td>
                          <td className={`p-2.5 border-r border-[#e7e1d5] font-mono-numbers font-bold ${
                            item.achievedQty === 0 ? 'text-slate-400' : isAhead ? 'text-emerald-700' : 'text-rose-600'
                          }`}>
                            {item.achievedQty === 0 ? '—' : isAhead ? `+${item.variancePcs}` : `${item.variancePcs}`}
                          </td>
                          <td className="p-2.5">
                            {item.achievedQty === 0 ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                Pending
                              </span>
                            ) : isAhead ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                On Track
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                                Behind
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* General Remarks & Save Actions */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-xs space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
              General Line Remarks &amp; IE Lead Handover Summary
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] text-xs text-[#17343a] focus:outline-hidden focus:ring-1 focus:ring-[#176f78]"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#e7e1d5]">
            <div className="text-xs text-[#527078]">
              {saveToast && (
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold animate-bounce">
                  <CheckCircle2 className="w-4 h-4" />
                  Line {formData.lineNo} telemetry &amp; 6-day learning curve saved successfully!
                </span>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#176f78] text-white hover:bg-[#12555c] transition-colors text-xs font-bold shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Line Data</span>
            </button>
          </div>
        </div>
      </form>

      {/* Full 40-Day Style Progression Chart Modal */}
      <StyleProgressionModal
        isOpen={showProgressionModal}
        onClose={() => setShowProgressionModal(false)}
        activeSMVWeight={smvWeight}
        activeStyleNature={lc.styleNature}
      />
    </div>
  );
};
