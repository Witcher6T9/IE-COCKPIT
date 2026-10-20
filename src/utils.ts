/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LineEntry, ChecklistMap, ChecklistStatus } from './types';
import { generateLineLearningCurve, calculateBalancingLossAnalysis } from './data/learningCurveMatrix';

// Format helper
export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetDateStr(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateLabel(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

// Generate realistic default line entries
export function generateDefaultLineEntries(): LineEntry[] {
  const today = getTodayDateStr();
  const yesterday = getOffsetDateStr(-1);
  const dayBefore = getOffsetDateStr(-2);

  return [
    {
      id: 1,
      date: today,
      lineNo: '18',
      floor: 'Floor 01 / Unit A',
      buyer: 'H&M',
      style: 'TS-2401 Crewneck',
      smv: 0.85,
      plannedMP: 40,
      workingHours: 8,
      targetEff: 85,
      targetProd: 1200,
      achievedProd: 1080,
      efficiency: 90,
      remarks: 'Smooth run, neckline attachment improved after method change',
      orderQty: 15000,
      dailyInput: 1150,
      dailyOutput: 1080,
      wip: 320,
      balancingGraph: 'day4',
      nextStyle: 'TS-2501 Winter Thermal',
      nextStyleDate: getOffsetDateStr(5),
      mp: {
        Operator: { present: 28, absent: 2 },
        Helper: { present: 8, absent: 1 },
        'Iron Man': { present: 3, absent: 0 }
      },
      balanceMethod: 'Overtime',
      balanceNotes: '2 operators worked 1 hr OT to absorb backlog',
      top5: {
        held: 'yes',
        attendance: 95,
        items: [
          'Rib attach thread tension check completed',
          'Needle break rate reduced to <0.5%',
          'Hourly output target 145 pcs aligned',
          'Helper bundle handling optimized',
          'End-line inspector feedback recorded'
        ],
        notes: 'Line supervisor confirmed all 5 actions acknowledged by batch chiefs'
      },
      bottleneck: {
        station: 'Cuff & Hem stitch',
        cycleTime: 48.5,
        targetCT: 45.0,
        status: 'ok',
        action: 'Guide attachment added to folder',
        notes: 'Within 7% of target cycle time'
      },
      timeStudy: {
        done: 'yes',
        type: 'time',
        observedRate: 142,
        standardRate: 150,
        findings: 'Operator motion efficiency 94.6%'
      },
      buildUp: {
        day: '4',
        plannedPct: 90,
        achievedPct: 90,
        operators: 39,
        notes: 'Learning curve peak achieved ahead of schedule'
      },
      lineIE: {
        name: 'Mahmudul Hoque',
        level: 'sr_executive',
        period: 'daily',
        weeklyNotes: 'On track to meet weekly shipping milestone',
        monthlyNotes: 'Consistent line efficiency >88%',
        additionalInfo: 'Line ready for upcoming audit inspection'
      },
      learningCurve: generateLineLearningCurve(0.85, 39, 8, 'repeat', 4, true),
      balancingAnalysis: calculateBalancingLossAnalysis(4590, 39, 48.5, 135, 150)
    },
    {
      id: 2,
      date: today,
      lineNo: '19',
      floor: 'Floor 01 / Unit A',
      buyer: 'Zara',
      style: 'JK-1180 Windbreaker',
      smv: 1.25,
      plannedMP: 45,
      workingHours: 8,
      targetEff: 80,
      targetProd: 900,
      achievedProd: 720,
      efficiency: 80,
      remarks: 'Zipper insertion bottleneck addressed with temporary helper',
      orderQty: 8500,
      dailyInput: 750,
      dailyOutput: 720,
      wip: 410,
      balancingGraph: 'day2',
      nextStyle: 'JK-1200 Bomber',
      nextStyleDate: getOffsetDateStr(2),
      mp: {
        Operator: { present: 24, absent: 4 },
        Helper: { present: 6, absent: 2 },
        'Iron Man': { present: 2, absent: 1 }
      },
      balanceMethod: 'Borrowed from other line',
      balanceNotes: '2 operators borrowed from training pool',
      top5: {
        held: 'yes',
        attendance: 90,
        items: [
          'Zipper slider test done with QC',
          'Interlining fusing heat calibrated at 140°C',
          'Pocket welt placement template deployed',
          'Helper sorting tags validated',
          'WIP buffer maintained at 30 pcs'
        ],
        notes: 'Supervisor instructed on continuous piece flow'
      },
      bottleneck: {
        station: 'Front zipper attach',
        cycleTime: 62.0,
        targetCT: 52.0,
        status: 'high',
        action: 'Assigned senior multi-skilled operator',
        notes: 'Cycle time dropped from 68s to 62s'
      },
      timeStudy: {
        done: 'yes',
        type: 'production',
        observedRate: 90,
        standardRate: 112,
        findings: 'Material handling delay accounts for 4.2s per garment'
      },
      buildUp: {
        day: '2',
        plannedPct: 75,
        achievedPct: 80,
        operators: 32,
        notes: 'Target achieved despite 4 absentees'
      },
      lineIE: {
        name: 'Mahmudul Hoque',
        level: 'sr_executive',
        period: 'daily',
        weeklyNotes: 'Focus on zipper station balancing',
        monthlyNotes: 'Targeting 85% stable efficiency by Friday',
        additionalInfo: 'Fabric lot change scheduled tomorrow morning'
      },
      learningCurve: generateLineLearningCurve(1.25, 32, 8, 'new', 2, false),
      balancingAnalysis: calculateBalancingLossAnalysis(4648, 32, 62.0, 90, 112)
    },
    {
      id: 3,
      date: today,
      lineNo: '20',
      floor: 'Floor 01 / Unit B',
      buyer: 'Gap',
      style: 'PL-3302 Pique Polo',
      smv: 0.95,
      plannedMP: 38,
      workingHours: 8,
      targetEff: 88,
      targetProd: 1100,
      achievedProd: 990,
      efficiency: 90,
      remarks: 'Placket folding accurate, collar rib tension stable',
      orderQty: 12000,
      dailyInput: 1050,
      dailyOutput: 990,
      wip: 180,
      balancingGraph: 'complete',
      nextStyle: 'PL-3305 Long Sleeve',
      nextStyleDate: getOffsetDateStr(8),
      mp: {
        Operator: { present: 26, absent: 1 },
        Helper: { present: 7, absent: 0 },
        'Iron Man': { present: 3, absent: 0 }
      },
      balanceMethod: 'Overtime',
      balanceNotes: 'Regular line balance maintained',
      top5: {
        held: 'yes',
        attendance: 100,
        items: [
          'Box placket stitch quality reviewed',
          'Collar point symmetry matched spec',
          'Buttons pull test passed at 90N',
          'Thread trim speed enhanced',
          'Operator fatigue reduction rest breaks'
        ],
        notes: 'Excellent teamwork and communication'
      },
      bottleneck: {
        station: 'Collar join & band',
        cycleTime: 44.0,
        targetCT: 43.5,
        status: 'ok',
        action: 'Standard gauge foot applied',
        notes: 'Very stable cycle'
      },
      timeStudy: {
        done: 'yes',
        type: 'both',
        observedRate: 128,
        standardRate: 135,
        findings: 'High pitch operator performance'
      },
      buildUp: {
        day: 'stable',
        plannedPct: 90,
        achievedPct: 90,
        operators: 36,
        notes: 'Stable production phase'
      },
      lineIE: {
        name: 'Mahmudul Hoque',
        level: 'sr_executive',
        period: 'daily',
        weeklyNotes: 'Consistently top performing line this week',
        monthlyNotes: 'Ready for lean benchmark showcase'
      }
    },
    {
      id: 4,
      date: today,
      lineNo: '21',
      floor: 'Floor 01 / Unit B',
      buyer: 'H&M',
      style: 'TS-2410 V-Neck',
      smv: 0.90,
      plannedMP: 36,
      workingHours: 8,
      targetEff: 85,
      targetProd: 1000,
      achievedProd: 850,
      efficiency: 85,
      remarks: 'V-neck center point alignment monitored hourly',
      orderQty: 10000,
      dailyInput: 900,
      dailyOutput: 850,
      wip: 250,
      balancingGraph: 'day1',
      nextStyle: 'TS-2420 Henley',
      nextStyleDate: getOffsetDateStr(9),
      mp: {
        Operator: { present: 25, absent: 3 },
        Helper: { present: 7, absent: 1 },
        'Iron Man': { present: 2, absent: 0 }
      },
      balanceMethod: 'Reduced target',
      balanceNotes: 'Adjusted target for first day run',
      top5: {
        held: 'yes',
        attendance: 88,
        items: [
          'V-neck tape binding tension fixed',
          'Shoulder stay tape position checked',
          'Bottom hem twin needle guide set',
          'Bundling sequence clarified',
          'Safety guard on overlock machines'
        ],
        notes: 'Day 1 setup complete'
      },
      bottleneck: {
        station: 'V-neck insert & topstitch',
        cycleTime: 54.0,
        targetCT: 48.0,
        status: 'high',
        action: 'Pre-creasing jig supplied',
        notes: 'Expect improvement tomorrow'
      },
      timeStudy: {
        done: 'partial',
        type: 'time',
        observedRate: 106,
        standardRate: 125,
        findings: 'First day learning curve underway'
      },
      buildUp: {
        day: '1',
        plannedPct: 60,
        achievedPct: 85,
        operators: 34,
        notes: 'Better than planned first day'
      },
      lineIE: {
        name: 'Sharmin Sultana',
        level: 'executive',
        period: 'daily',
        weeklyNotes: 'Style transition completed successfully',
        monthlyNotes: 'Expected to reach 85%+ in 2 days'
      }
    },
    {
      id: 5,
      date: today,
      lineNo: '24',
      floor: 'Floor 02 / Unit A',
      buyer: 'Uniqlo',
      style: 'PL-1100 Dry-Ex',
      smv: 0.80,
      plannedMP: 42,
      workingHours: 8,
      targetEff: 92,
      targetProd: 1300,
      achievedProd: 1200,
      efficiency: 92,
      remarks: 'Synthetic fabric handling optimal, zero static issues reported',
      orderQty: 20000,
      dailyInput: 1250,
      dailyOutput: 1200,
      wip: 90,
      balancingGraph: 'complete',
      nextStyle: 'PL-1150 Mesh Polo',
      nextStyleDate: getOffsetDateStr(5),
      mp: {
        Operator: { present: 30, absent: 0 },
        Helper: { present: 9, absent: 1 },
        'Iron Man': { present: 3, absent: 0 }
      },
      balanceMethod: 'Extra operators',
      balanceNotes: '1 extra floating helper deployed',
      top5: {
        held: 'yes',
        attendance: 100,
        items: [
          'Silicon spray applied to needle bars',
          'Mesh panel match points verified',
          'Heat seal brand label test approved',
          'Anti-snagging glove check enforced',
          'Inspection light intensity checked (1000 lux)'
        ],
        notes: 'Standard operating procedures fully complied'
      },
      bottleneck: {
        station: 'Raglan sleeve join',
        cycleTime: 39.0,
        targetCT: 38.0,
        status: 'ok',
        action: 'Differential feed fine-tuned',
        notes: 'Puckering eliminated'
      },
      timeStudy: {
        done: 'yes',
        type: 'time',
        observedRate: 152,
        standardRate: 160,
        findings: 'High consistency across all operators'
      },
      buildUp: {
        day: 'stable',
        plannedPct: 92,
        achievedPct: 92,
        operators: 42,
        notes: 'Target exceeded consistently'
      },
      lineIE: {
        name: 'Sharmin Sultana',
        level: 'executive',
        period: 'daily',
        weeklyNotes: 'Uniqlo auditor praised layout and visual management',
        monthlyNotes: 'Model line candidate'
      }
    },
    // Yesterday historical records
    {
      id: 101,
      date: yesterday,
      lineNo: '18',
      floor: 'Floor 01 / Unit A',
      buyer: 'H&M',
      style: 'TS-2401 Crewneck',
      smv: 0.85,
      plannedMP: 40,
      workingHours: 8,
      targetEff: 85,
      targetProd: 1200,
      achievedProd: 1044,
      efficiency: 87,
      remarks: 'Moderate run, minor machine needle downtime',
      orderQty: 15000,
      dailyInput: 1100,
      dailyOutput: 1044,
      wip: 350,
      balancingGraph: 'day2',
      nextStyle: 'TS-2501 Winter Thermal',
      nextStyleDate: getOffsetDateStr(6),
      mp: {
        Operator: { present: 27, absent: 3 },
        Helper: { present: 8, absent: 1 },
        'Iron Man': { present: 3, absent: 0 }
      },
      balanceMethod: 'Overtime',
      balanceNotes: '1 hr OT planned',
      top5: {
        held: 'yes',
        attendance: 90,
        items: ['Rib attach check', 'Needle inspection routine'],
        notes: 'Standard checks'
      },
      bottleneck: {
        station: 'Cuff stitch',
        cycleTime: 49.0,
        targetCT: 45.0,
        status: 'ok',
        action: 'Attachment adjusted'
      },
      timeStudy: {
        done: 'yes',
        type: 'time',
        observedRate: 135,
        standardRate: 150,
        findings: 'Standard pace'
      },
      buildUp: {
        day: '3',
        plannedPct: 85,
        achievedPct: 87,
        operators: 38,
        notes: 'Build-up progression'
      },
      lineIE: {
        name: 'Mahmudul Hoque',
        level: 'sr_executive',
        period: 'daily'
      }
    },
    {
      id: 102,
      date: yesterday,
      lineNo: '19',
      floor: 'Floor 01 / Unit A',
      buyer: 'Zara',
      style: 'JK-1180 Windbreaker',
      smv: 1.25,
      plannedMP: 45,
      workingHours: 8,
      targetEff: 80,
      targetProd: 900,
      achievedProd: 756,
      efficiency: 84,
      remarks: 'Zipper operator worked full shift without bottleneck',
      orderQty: 8500,
      dailyInput: 800,
      dailyOutput: 756,
      wip: 380,
      balancingGraph: 'day1',
      nextStyle: 'JK-1200 Bomber',
      nextStyleDate: getOffsetDateStr(3),
      mp: {
        Operator: { present: 26, absent: 2 },
        Helper: { present: 7, absent: 1 },
        'Iron Man': { present: 3, absent: 0 }
      },
      balanceMethod: 'Overtime',
      balanceNotes: 'Normal shift',
      top5: {
        held: 'yes',
        attendance: 92,
        items: ['Zipper verify'],
        notes: 'On target'
      },
      bottleneck: {
        station: 'Zipper install',
        cycleTime: 65.0,
        targetCT: 60.0,
        status: 'high',
        action: 'Support helper assigned'
      },
      timeStudy: {
        done: 'yes',
        type: 'time',
        observedRate: 95,
        standardRate: 110,
        findings: 'Acceptable speed'
      },
      buildUp: {
        day: '1',
        plannedPct: 70,
        achievedPct: 84,
        operators: 36,
        notes: 'Good initial start'
      },
      lineIE: {
        name: 'Mahmudul Hoque',
        level: 'sr_executive',
        period: 'daily'
      }
    }
  ];
}

// Generate realistic checklists for today and past 28 days
export function generateDefaultChecklists(): ChecklistMap {
  const map: ChecklistMap = {};
  const today = getTodayDateStr();
  
  // Today: 7 completed, 3 pending, 2 no
  map[today] = ['yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'pending', 'pending', 'pending', 'no', 'no'];

  // Past 28 days
  for (let i = 1; i <= 28; i++) {
    const dStr = getOffsetDateStr(-i);
    if (i % 5 === 0) {
      map[dStr] = ['yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes'];
    } else if (i % 3 === 0) {
      map[dStr] = ['yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'pending', 'yes', 'yes'];
    } else if (i % 2 === 0) {
      map[dStr] = ['yes', 'yes', 'yes', 'yes', 'pending', 'yes', 'yes', 'yes', 'pending', 'yes', 'no', 'yes'];
    } else {
      map[dStr] = ['yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'pending', 'yes', 'yes', 'yes', 'yes'];
    }
  }

  return map;
}

// IE Metrics calculations
export function calculateLineMetrics(line: LineEntry) {
  const totalPresentMP =
    line.mp.Operator.present + line.mp.Helper.present + line.mp['Iron Man'].present;
  const totalAbsentMP =
    line.mp.Operator.absent + line.mp.Helper.absent + line.mp['Iron Man'].absent;
  const totalAllocatedMP = totalPresentMP + totalAbsentMP;

  const totalWorkingMins = line.workingHours * 60;
  const availableMinutes = totalPresentMP * totalWorkingMins;
  const standardProducedMinutes = line.achievedProd * line.smv;

  const calculatedEff =
    availableMinutes > 0 ? (standardProducedMinutes / availableMinutes) * 100 : 0;

  const plannedProducedMins = line.targetProd * line.smv;
  const targetAvailableMins = line.plannedMP * totalWorkingMins;
  const calculatedTargetEff =
    targetAvailableMins > 0 ? (plannedProducedMins / targetAvailableMins) * 100 : 0;

  const variancePcs = line.achievedProd - line.targetProd;
  const absenteeismPct = totalAllocatedMP > 0 ? (totalAbsentMP / totalAllocatedMP) * 100 : 0;

  return {
    totalPresentMP,
    totalAbsentMP,
    totalAllocatedMP,
    availableMinutes: Math.round(availableMinutes),
    standardProducedMinutes: Math.round(standardProducedMinutes),
    efficiencyPct: Math.round(calculatedEff * 10) / 10,
    targetEffPct: Math.round(calculatedTargetEff * 10) / 10,
    variancePcs,
    absenteeismPct: Math.round(absenteeismPct * 10) / 10
  };
}

export function calculateFactoryOverall(lines: LineEntry[]) {
  let totalProducedMinutes = 0;
  let totalAvailableMinutes = 0;
  let totalAchievedProd = 0;
  let totalTargetProd = 0;
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalWip = 0;

  for (const line of lines) {
    const metrics = calculateLineMetrics(line);
    totalProducedMinutes += metrics.standardProducedMinutes;
    totalAvailableMinutes += metrics.availableMinutes;
    totalAchievedProd += line.achievedProd;
    totalTargetProd += line.targetProd;
    totalPresent += metrics.totalPresentMP;
    totalAbsent += metrics.totalAbsentMP;
    totalWip += line.wip;
  }

  const overallEfficiency =
    totalAvailableMinutes > 0 ? (totalProducedMinutes / totalAvailableMinutes) * 100 : 0;
  const targetVariance = totalAchievedProd - totalTargetProd;
  const attendanceRate =
    totalPresent + totalAbsent > 0 ? (totalPresent / (totalPresent + totalAbsent)) * 100 : 100;

  return {
    overallEfficiency: Math.round(overallEfficiency * 10) / 10,
    totalAchievedProd,
    totalTargetProd,
    targetVariance,
    totalPresent,
    totalAbsent,
    totalWip,
    attendanceRate: Math.round(attendanceRate * 10) / 10,
    totalProducedMinutes: Math.round(totalProducedMinutes),
    totalAvailableMinutes: Math.round(totalAvailableMinutes),
    activeLinesCount: lines.length
  };
}

// Export CSV string
export function exportReportToCSV(lines: LineEntry[], dateStr: string): string {
  const headers = [
    'Line No',
    'Floor',
    'Buyer',
    'Style',
    'SMV',
    'Working Hrs',
    'Present MP',
    'Absent MP',
    'Target Prod',
    'Achieved Prod',
    'Variance Pcs',
    'Produced Mins',
    'Available Mins',
    'Efficiency %',
    'Bottleneck Station',
    'Cycle Time (s)',
    'Remarks'
  ];

  const rows = lines.map(line => {
    const m = calculateLineMetrics(line);
    return [
      `Line ${line.lineNo}`,
      `"${line.floor}"`,
      `"${line.buyer}"`,
      `"${line.style}"`,
      line.smv.toFixed(2),
      line.workingHours,
      m.totalPresentMP,
      m.totalAbsentMP,
      line.targetProd,
      line.achievedProd,
      m.variancePcs,
      m.standardProducedMinutes,
      m.availableMinutes,
      `${m.efficiencyPct}%`,
      `"${line.bottleneck.station}"`,
      line.bottleneck.cycleTime,
      `"${line.remarks.replace(/"/g, '""')}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function downloadCSV(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
