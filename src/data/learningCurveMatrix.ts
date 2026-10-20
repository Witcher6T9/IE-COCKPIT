/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  StyleNature,
  SMVWeight,
  LineLearningCurve,
  LearningCurveDayRecord,
  BalancingLossAnalysis
} from '../types';

/**
 * Official Style Progression Chart Table (Days 1 - 40)
 * Derived from Debonair / Garment IE standards (Image 4):
 * Light weight: 0 - 30 Min
 * Medium weight: 31 - 60 Min
 * Heavy weight: 61 - >61 Min
 * Note: If any style input starts again within 3 months, it is considered a repeat style.
 */
export interface StyleProgressionDay {
  day: number;
  newStyle: {
    light: number;
    medium: number;
    heavy: number;
  };
  repeatStyle: {
    light: number;
    medium: number;
    heavy: number;
  };
}

export const STYLE_PROGRESSION_TABLE: StyleProgressionDay[] = [
  { day: 1, newStyle: { light: 20, medium: 15, heavy: 10 }, repeatStyle: { light: 25, medium: 20, heavy: 15 } },
  { day: 2, newStyle: { light: 30, medium: 25, heavy: 20 }, repeatStyle: { light: 35, medium: 30, heavy: 25 } },
  { day: 3, newStyle: { light: 40, medium: 35, heavy: 30 }, repeatStyle: { light: 45, medium: 40, heavy: 35 } },
  { day: 4, newStyle: { light: 50, medium: 45, heavy: 40 }, repeatStyle: { light: 55, medium: 50, heavy: 45 } },
  { day: 5, newStyle: { light: 55, medium: 50, heavy: 50 }, repeatStyle: { light: 60, medium: 55, heavy: 55 } },
  { day: 6, newStyle: { light: 60, medium: 55, heavy: 55 }, repeatStyle: { light: 60, medium: 60, heavy: 60 } },
  // Extended stabilization days up to day 40 (per chart)
  { day: 7, newStyle: { light: 61, medium: 60, heavy: 60 }, repeatStyle: { light: 61, medium: 60, heavy: 61 } },
  { day: 8, newStyle: { light: 61, medium: 61, heavy: 61 }, repeatStyle: { light: 61, medium: 61, heavy: 61 } },
  { day: 9, newStyle: { light: 61, medium: 61, heavy: 61 }, repeatStyle: { light: 62, medium: 61, heavy: 62 } },
  { day: 10, newStyle: { light: 62, medium: 61, heavy: 61 }, repeatStyle: { light: 62, medium: 62, heavy: 62 } },
  { day: 11, newStyle: { light: 62, medium: 62, heavy: 62 }, repeatStyle: { light: 63, medium: 62, heavy: 63 } },
  { day: 12, newStyle: { light: 62, medium: 62, heavy: 62 }, repeatStyle: { light: 63, medium: 63, heavy: 63 } },
  { day: 13, newStyle: { light: 63, medium: 62, heavy: 62 }, repeatStyle: { light: 64, medium: 63, heavy: 64 } },
  { day: 14, newStyle: { light: 63, medium: 63, heavy: 63 }, repeatStyle: { light: 64, medium: 64, heavy: 64 } },
  { day: 15, newStyle: { light: 63, medium: 63, heavy: 63 }, repeatStyle: { light: 65, medium: 64, heavy: 65 } },
  { day: 16, newStyle: { light: 64, medium: 63, heavy: 63 }, repeatStyle: { light: 65, medium: 65, heavy: 65 } },
  { day: 17, newStyle: { light: 64, medium: 64, heavy: 64 }, repeatStyle: { light: 66, medium: 65, heavy: 66 } },
  { day: 18, newStyle: { light: 64, medium: 64, heavy: 64 }, repeatStyle: { light: 66, medium: 66, heavy: 66 } },
  { day: 19, newStyle: { light: 65, medium: 64, heavy: 64 }, repeatStyle: { light: 67, medium: 66, heavy: 67 } },
  { day: 20, newStyle: { light: 65, medium: 65, heavy: 65 }, repeatStyle: { light: 67, medium: 67, heavy: 67 } },
  { day: 21, newStyle: { light: 65, medium: 65, heavy: 65 }, repeatStyle: { light: 68, medium: 67, heavy: 68 } },
  { day: 22, newStyle: { light: 66, medium: 65, heavy: 65 }, repeatStyle: { light: 68, medium: 68, heavy: 68 } },
  { day: 23, newStyle: { light: 66, medium: 66, heavy: 66 }, repeatStyle: { light: 69, medium: 68, heavy: 69 } },
  { day: 24, newStyle: { light: 66, medium: 66, heavy: 66 }, repeatStyle: { light: 69, medium: 69, heavy: 69 } },
  { day: 25, newStyle: { light: 67, medium: 66, heavy: 66 }, repeatStyle: { light: 70, medium: 69, heavy: 70 } },
  { day: 26, newStyle: { light: 67, medium: 67, heavy: 67 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 27, newStyle: { light: 67, medium: 67, heavy: 67 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 28, newStyle: { light: 68, medium: 67, heavy: 67 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 29, newStyle: { light: 68, medium: 68, heavy: 68 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 30, newStyle: { light: 68, medium: 68, heavy: 68 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 31, newStyle: { light: 69, medium: 68, heavy: 68 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 32, newStyle: { light: 69, medium: 69, heavy: 69 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 33, newStyle: { light: 69, medium: 69, heavy: 69 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 34, newStyle: { light: 70, medium: 69, heavy: 69 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 35, newStyle: { light: 70, medium: 70, heavy: 70 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 36, newStyle: { light: 70, medium: 70, heavy: 70 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 37, newStyle: { light: 70, medium: 70, heavy: 70 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 38, newStyle: { light: 70, medium: 70, heavy: 70 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 39, newStyle: { light: 70, medium: 70, heavy: 70 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } },
  { day: 40, newStyle: { light: 70, medium: 70, heavy: 70 }, repeatStyle: { light: 70, medium: 70, heavy: 70 } }
];

/**
 * Helper to determine SMV Weight Category
 */
export function getSMVWeight(smv: number): SMVWeight {
  if (smv <= 30) return 'light';
  if (smv <= 60) return 'medium';
  return 'heavy';
}

/**
 * Returns planned efficiency percentage from the Style Progression Chart for a specific day
 */
export function getProgressionTargetEff(
  day: number,
  styleNature: StyleNature,
  smvWeight: SMVWeight
): number {
  const clampedDay = Math.min(Math.max(day, 1), 40);
  const row = STYLE_PROGRESSION_TABLE.find(r => r.day === clampedDay) || STYLE_PROGRESSION_TABLE[clampedDay - 1];
  if (!row) return 60;

  const dataset = styleNature === 'repeat' ? row.repeatStyle : row.newStyle;
  return dataset[smvWeight];
}

/**
 * Generates the full 6-Day Learning Curve configuration and daily plan/actuals
 */
export function generateLineLearningCurve(
  smv: number,
  totalManpower: number,
  workingHours: number,
  styleNature: StyleNature = 'new',
  currentDay: number = 2,
  isRepeatWithin3Months: boolean = false
): LineLearningCurve {
  const smvWeight = getSMVWeight(smv);
  const totalAvailableMinutesPerDay = totalManpower * workingHours * 60;

  // Build Day 1 to 6 history records
  const history: LearningCurveDayRecord[] = [];

  for (let day = 1; day <= 6; day++) {
    const plannedEff = getProgressionTargetEff(day, styleNature, smvWeight);
    const plannedQty = Math.round((totalAvailableMinutesPerDay * (plannedEff / 100)) / (smv > 0 ? smv : 1));

    // Simulated achieved values for days up to currentDay
    let achievedEff = 0;
    let achievedQty = 0;

    if (day < currentDay) {
      // Completed day: slight realistic variance (+- 2% to 4%)
      const variance = (day % 2 === 0 ? 1.5 : -1.0);
      achievedEff = Math.max(5, plannedEff + variance);
      achievedQty = Math.round((totalAvailableMinutesPerDay * (achievedEff / 100)) / (smv > 0 ? smv : 1));
    } else if (day === currentDay) {
      // Current day in progress (e.g. 85-95% of target achieved so far)
      achievedEff = Math.round(plannedEff * 0.92);
      achievedQty = Math.round((totalAvailableMinutesPerDay * (achievedEff / 100)) / (smv > 0 ? smv : 1));
    }

    const variancePcs = day <= currentDay ? achievedQty - plannedQty : 0;
    const variancePct = plannedQty > 0 ? Math.round((variancePcs / plannedQty) * 100) : 0;

    history.push({
      day,
      plannedEff,
      achievedEff,
      plannedQty,
      achievedQty,
      variancePcs,
      variancePct,
      notes: day === currentDay ? 'Current production shift tracking' : undefined
    });
  }

  return {
    periodDays: 6,
    currentDay: Math.min(Math.max(currentDay, 1), 6),
    styleNature,
    smvWeight,
    isRepeatWithin3Months,
    history,
    notes: `6-Day learning curve generated for ${styleNature === 'repeat' ? 'Repeat Style' : 'New Style'} (${smvWeight} weight).`
  };
}

/**
 * Debonair Ltd. Unit - 02 Production Loss & Balancing Calculation Engine (Image 3)
 */
export function calculateBalancingLossAnalysis(
  tacctSeconds: number, // ΣT in seconds
  totalOperators: number, // N
  maxCTSeconds: number, // CTmax in seconds
  currentPrdnPcsPerHour: number = 0,
  estimatePcsPerHour?: number
): BalancingLossAnalysis {
  const safeOperators = Math.max(totalOperators, 1);
  const pitchTimeSeconds = tacctSeconds > 0 ? tacctSeconds / safeOperators : 0;

  // Balancing Loss % formula: [ (N * CTmax) - ΣT ] / (N * CTmax) * 100
  const capacityTotal = safeOperators * maxCTSeconds;
  let balancingLossPct = 0;
  if (capacityTotal > 0) {
    balancingLossPct = Math.round(((capacityTotal - tacctSeconds) / capacityTotal) * 100);
  }

  // Balancing Status classification matching Image 3:
  let balancingStatus: 'High Loss' | 'Overloaded/Verify Data' | 'Critical' | 'Stable' = 'Stable';
  if (maxCTSeconds > 0 && maxCTSeconds < pitchTimeSeconds * 0.92) {
    balancingStatus = 'Overloaded/Verify Data'; // Negative balancing loss or cycle time faster than pitch
  } else if (balancingLossPct >= 35) {
    balancingStatus = 'Critical';
  } else if (balancingLossPct >= 15) {
    balancingStatus = 'High Loss';
  } else {
    balancingStatus = 'Stable';
  }

  // Potential output (pcs / hour) = 3600 / CTmax
  const potential = maxCTSeconds > 0 ? Math.round(3600 / maxCTSeconds) : 0;
  // Estimate: target hourly output
  const estimate = estimatePcsPerHour !== undefined && estimatePcsPerHour > 0
    ? estimatePcsPerHour
    : Math.round(potential * 0.9);
  const minCap = Math.round(potential * 0.85);

  // Estimated loss % = (Current Prdn - Estimate) / Estimate * 100
  let estimatedLossPct = 0;
  if (estimate > 0) {
    estimatedLossPct = Math.round(((currentPrdnPcsPerHour - estimate) / estimate) * 100);
  }

  return {
    tacctSeconds,
    totalOperators: safeOperators,
    maxCTSeconds,
    pitchTimeSeconds: Math.round(pitchTimeSeconds * 10) / 10,
    balancingLossPct,
    balancingStatus,
    potentialPcsPerHour: potential,
    estimatePcsPerHour: estimate,
    minCapacityPcsPerHour: minCap,
    currentProductionPcsPerHour: currentPrdnPcsPerHour,
    estimatedLossPct,
    remarks: estimate === 0 ? 'Not Estimated' : undefined,
    // IE Standards (Image 2)
    theoreticalBalancePct: 96.2,
    balancingErrorPct: 3.8,
    capacityEstimatePct: 12.5,
    rightManInRightProcess: true,
    rightMachineForProcess: true,
    needleDowntimeMinutes: 18
  };
}
