/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LineEntry,
  ChecklistMap,
  TodoItem,
  ScheduleItem,
  LeanMethod,
  LeanAction,
  NotificationItem,
  RoleTier,
  UserProfile,
  DashboardLayout,
  SyncState
} from './types';

// The 12 Daily Control IE Checklist Tasks
export const IE_12_TASKS: { id: number; title: string; hint: string; category: string }[] = [
  { id: 1, title: 'Learning Curve Plan', hint: 'Verify day-wise ramp-up target and operator skill matrix', category: 'Planning' },
  { id: 2, title: 'Line Balancing Graph (1st day output - 2nd day compl)', hint: 'Audit cycle times and buffer balance across feeding stations', category: 'Balancing' },
  { id: 3, title: 'Learning Curve First 3 Days (Peak Target 70% Prod.)', hint: 'Monitor build-up progress to reach 70% standard efficiency', category: 'Efficiency' },
  { id: 4, title: 'Line Balancing Graph 4th Day', hint: 'Evaluate final balance graph and identify residual bottleneck stations', category: 'Balancing' },
  { id: 5, title: 'Line Estimate Report (6-7 Day)', hint: 'Generate mid-order output projection and shipping clearance run rate', category: 'Reporting' },
  { id: 6, title: 'Line Study & Bottleneck Flow Analysis', hint: 'Conduct stopwatch cycle observation on top 2 critical stations', category: 'Study' },
  { id: 7, title: 'Next Style Input Date File Submit (Before 10 Days)', hint: 'Submit machinery requirement, folder attachment list, and SMV mock', category: 'Preparation' },
  { id: 8, title: 'T.R Sample Make Follow-up Update', hint: 'Inspect technical run trial sample with QC and production managers', category: 'Quality' },
  { id: 9, title: 'Floor Status Update', hint: 'Audit hourly production board, WIP accumulation, and feeding delays', category: 'Floor Control' },
  { id: 10, title: 'Individual Operator Performance Tracking', hint: 'Review low-efficiency operators (<60%) and deploy training floaters', category: 'Manpower' },
  { id: 11, title: 'Kaizen Work / Continuous Improvement', hint: 'Implement physical workstation jig, guide, or visual shadow board', category: 'Lean CI' },
  { id: 12, title: 'Running Line Efficiency % & Production', hint: 'Calculate standard minutes produced against paid manpower minutes', category: 'KPI Recap' }
];

export const ROLE_TIERS: RoleTier[] = [
  {
    id: 'tier_0',
    level: 0,
    name: 'admin',
    shortCode: 'T0',
    color: '#0d7685',
    description: 'Full System Management',
    systemRole: 'ADMIN',
    systemEdit: 'Full',
    deletionReset: 'Authorized',
    checklistSignoff: 'Authorized',
    managesTiers: 'T1, T2, T3, T4',
    canManageLines: true,
    canEditLineData: true,
    canApproveChecklist: true,
    canCreateTodos: true,
    canExport: true
  },
  {
    id: 'tier_1',
    level: 1,
    name: 'IE Sr. Manager',
    shortCode: 'T1',
    color: '#7c3aed',
    description: 'Head of Industrial Engineering & Strategic Operations',
    systemRole: 'HOD',
    systemEdit: 'Full',
    deletionReset: 'Authorized',
    checklistSignoff: 'Authorized',
    managesTiers: 'T2, T3, T4',
    canManageLines: true,
    canEditLineData: true,
    canApproveChecklist: true,
    canCreateTodos: true,
    canExport: true
  },
  {
    id: 'tier_2',
    level: 2,
    name: 'IE Manager',
    shortCode: 'T2',
    color: '#0284c7',
    description: 'Unit IE Supervision & Production Floor Balancing Lead',
    systemRole: 'MANAGER',
    systemEdit: 'Full',
    deletionReset: 'Restricted',
    checklistSignoff: 'Authorized',
    managesTiers: 'T3, T4',
    canManageLines: true,
    canEditLineData: true,
    canApproveChecklist: true,
    canCreateTodos: true,
    canExport: true
  },
  {
    id: 'tier_3',
    level: 3,
    name: 'IE Assistant Manager',
    shortCode: 'T3',
    color: '#059669',
    description: 'Floor Execution, Production Line Balancing Lead',
    systemRole: 'IE_ASST_MANAGER',
    systemEdit: 'Full',
    deletionReset: 'Restricted',
    checklistSignoff: 'Submit Only',
    managesTiers: 'T4',
    canManageLines: false,
    canEditLineData: true,
    canApproveChecklist: false,
    canCreateTodos: true,
    canExport: true
  },
  {
    id: 'tier_4',
    level: 4,
    name: 'Jr / IE Executive',
    shortCode: 'T4',
    color: '#ea580c',
    description: 'Field Time Study Observer & Capacity Matrix Recorder',
    systemRole: 'LINE_IE',
    systemEdit: 'Read-Only',
    deletionReset: 'Restricted',
    checklistSignoff: 'Submit Only',
    managesTiers: 'Self Only',
    canManageLines: false,
    canEditLineData: false,
    canApproveChecklist: false,
    canCreateTodos: false,
    canExport: true
  }
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'MD. Ashikur Rahman',
  jobTitle: 'Senior Industrial Engineering Manager',
  role: 'admin',
  tierId: 'tier_0',
  email: 'ashikur.rahman@apparel-factory.com'
};

export const LEAN_METHODS: LeanMethod[] = [
  {
    id: '5s-audit',
    title: '5S Audit',
    description: 'Workplace organisation scored by area',
    purpose: 'Create a consistent floor check for sort, set in order, shine, standardise, and sustain across each sewing work area.',
    category: 'point-of-work',
    icon: 'Sparkles',
    index: '01',
    accent: 'teal',
    walkTip: 'Touch the shadow boards and check red-tagged items within 30cm of the sewing needle.',
    focusMetric: '5S Index %'
  },
  {
    id: '7-wastes',
    title: '7 Wastes',
    description: 'TIMWOOD+T observations and Pareto',
    purpose: 'Capture the waste seen during a production walk and surface the few causes creating the most lost time on the line.',
    category: 'problem-solving',
    icon: 'Trash2',
    index: '02',
    accent: 'orange',
    walkTip: 'Tally minutes lost to Waiting and Motion — they represent 60% of sewing floor loss.',
    focusMetric: 'Lost Mins Today'
  },
  {
    id: 'kaizen-pdca',
    title: 'Kaizen PDCA',
    description: 'Improvement cards across Plan-Do-Check-Act',
    purpose: 'Keep improvement work visible from the first idea through the check that proves the method change on the floor.',
    category: 'problem-solving',
    icon: 'RotateCw',
    index: '03',
    accent: 'gold',
    walkTip: 'Never leave the floor without testing a 1-operator physical mock trial (Do).',
    focusMetric: 'Active Kaizens'
  },
  {
    id: 'smed-changeover',
    title: 'SMED Changeover',
    description: 'Internal vs external style-change time',
    purpose: 'Separate internal and external changeover work to reveal practical minutes that can be recovered between styles.',
    category: 'flow-pacing',
    icon: 'Timer',
    index: '04',
    accent: 'slate',
    walkTip: 'Ensure all folders, threads, and mock samples are pre-staged externally before line stops.',
    focusMetric: 'Changeover Mins'
  },
  {
    id: 'takt-yamazumi',
    title: 'Takt & Yamazumi',
    description: 'Takt time vs operator load stacks',
    purpose: 'Compare station work content with takt and make uneven operator load easy to spot before it becomes a bottleneck.',
    category: 'flow-pacing',
    icon: 'BarChart3',
    index: '05',
    accent: 'teal',
    walkTip: 'Look for bars taller than the Takt line — immediate work redistribution needed at point of work.',
    focusMetric: 'Takt Time (sec)'
  },
  {
    id: 'andon-board',
    title: 'Andon Board',
    description: 'Live line calls for quality, machine, material',
    purpose: 'Give quality, machine, and material calls one visible place so the right response can start without delay.',
    category: 'point-of-work',
    icon: 'AlertTriangle',
    index: '06',
    accent: 'orange',
    walkTip: 'If a yellow or red call exceeds 5 minutes, walk immediately to station to confirm containment.',
    focusMetric: 'Active Calls'
  },
  {
    id: 'oee-tpm',
    title: 'OEE / TPM',
    description: 'Availability × Performance × Quality',
    purpose: 'Frame equipment losses through availability, performance, and quality for a clearer maintenance conversation.',
    category: 'problem-solving',
    icon: 'Gauge',
    index: '07',
    accent: 'gold',
    walkTip: 'Check if machine bobbin cases and oil levels were inspected before shift start.',
    focusMetric: 'OEE Score %'
  },
  {
    id: 'a3-problem-solving',
    title: 'A3 Problem Solving',
    description: 'One-page root cause and countermeasures',
    purpose: 'Move from problem definition to root cause and countermeasure in one focused, reviewable problem-solving story.',
    category: 'problem-solving',
    icon: 'FileText',
    index: '08',
    accent: 'slate',
    walkTip: 'Enforce the 5 Whys rule: the fifth why must identify a system or process failure, not human error.',
    focusMetric: 'A3 Closure Rate'
  },
  {
    id: 'kanban-wip',
    title: 'Kanban / WIP',
    description: 'Pull system with WIP limits by process',
    purpose: 'Make work-in-process limits visible by process and support a steadier pull through the sewing floor.',
    category: 'flow-pacing',
    icon: 'Columns3',
    index: '09',
    accent: 'teal',
    walkTip: 'Count WIP bundles sitting between assembly and hemming — overflow triggers upstream pause.',
    focusMetric: 'Total WIP (pcs)'
  },
  {
    id: 'gemba-walk',
    title: 'Gemba Walk',
    description: 'Go to the floor, record what you see',
    purpose: 'Turn direct floor observation into a concise record of what is really happening at the point of work.',
    category: 'point-of-work',
    icon: 'Glasses',
    index: '10',
    accent: 'orange',
    walkTip: 'Stand in the Ohno circle for 10 minutes at the critical operation before writing any note.',
    focusMetric: 'Walk Findings'
  },
  {
    id: 'standard-work',
    title: 'Standard Work',
    description: 'Cycle, walk, wait vs takt',
    purpose: 'Compare cycle, walk, and wait against takt to make the current method and its gaps visible.',
    category: 'point-of-work',
    icon: 'ClipboardCheck',
    index: '11',
    accent: 'gold',
    walkTip: 'Watch operator hands and body: any walking or reaching > 2 seconds is pure elimination target.',
    focusMetric: 'Waste Ratio %'
  },
  {
    id: 'poka-yoke',
    title: 'Poka-Yoke',
    description: 'Error-proofing registry by station',
    purpose: 'Keep error-proofing methods connected to the station where they protect quality every day.',
    category: 'point-of-work',
    icon: 'ShieldCheck',
    index: '12',
    accent: 'slate',
    walkTip: 'Physically test one guide or sensor jig every morning with a defective part to ensure it halts operation.',
    focusMetric: 'Fixtures Active'
  }
];

export const INITIAL_LEAN_ACTIONS: LeanAction[] = [
  {
    id: 'act-01',
    methodId: '5s-audit',
    methodTitle: '5S Audit',
    lineNo: '18',
    stationOrLocation: 'Station 12 (Neck Rib Stitch)',
    actionText: 'Install magnetic shadow tray for extra looper needles and tweezers within 25cm reach.',
    assignee: 'Engr. Rezaul Karim',
    urgency: 'immediate',
    status: 'in_progress',
    createdAt: '2026-09-16 08:30'
  },
  {
    id: 'act-02',
    methodId: 'takt-yamazumi',
    methodTitle: 'Takt & Yamazumi',
    lineNo: '19',
    stationOrLocation: 'Station 04 (Front Placket)',
    actionText: 'Cycle time is 28.5s against 24.0s Takt. Shift button mark notch step to Station 03.',
    assignee: 'MD. Ashikur Rahman',
    urgency: 'immediate',
    status: 'pending',
    createdAt: '2026-09-16 09:15'
  },
  {
    id: 'act-03',
    methodId: 'andon-board',
    methodTitle: 'Andon Board',
    lineNo: '20',
    stationOrLocation: 'Station 08 (Overlock Hemming)',
    actionText: 'Replace faulty thread tension disc causing recurrent yellow needle stop calls.',
    assignee: 'Maintenance Dept',
    urgency: 'shift_end',
    status: 'completed',
    createdAt: '2026-09-16 10:05'
  },
  {
    id: 'act-04',
    methodId: 'smed-changeover',
    methodTitle: 'SMED Changeover',
    lineNo: '21',
    stationOrLocation: 'Line 21 Feeding Infeed',
    actionText: 'Pre-fuse pocket interlining rolls in sample room 2 hours prior to scheduled line clearance.',
    assignee: 'Farhana Chowdhury',
    urgency: 'next_day',
    status: 'pending',
    createdAt: '2026-09-16 11:20'
  }
];

export const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'todo-pow-0',
    title: 'Mount needle tray shadow board on Station 04 by 2 PM',
    description: 'Immediate point-of-work visual management countermeasure from Gemba walk. Station 04 - Collar join.',
    category: 'kaizen_ci',
    priority: 'urgent',
    status: 'pending',
    targetDate: '2026-09-16',
    dueTime: '14:00',
    lineNo: '18',
    assignedToRole: 'Line Supervisor',
    assignedToName: 'Engr. Rezaul Karim',
    assignedByRole: 'senior_ie',
    assignedByName: 'Ashikur Rahman',
    subtasks: [
      { id: 'st-pow-1', title: 'Mount shadow board within 30cm of operator needle zone', completed: false },
      { id: 'st-pow-2', title: 'Verify operator ergonomics & motion economy', completed: false }
    ],
    notes: 'Originated from 10. Gemba Walk routine observation.',
    isPointOfWork: true,
    leanMethod: '10. Gemba Walk',
    stationLocation: 'Station 04 - Collar join',
    urgencyLevel: 'Immediate (Next 30 mins)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo-1',
    title: 'Review Line 18-20 Balancing Graph & Authorize OT Floaters',
    description: 'Verify if 2 extra operators absorbed the collar attachment backlog and approve 1hr overtime.',
    category: 'line_balancing',
    priority: 'high',
    status: 'in_progress',
    targetDate: '2026-09-16',
    dueTime: '11:00',
    lineNo: '18',
    assignedToRole: 'assistant_manager',
    assignedToName: 'Farhana Chowdhury',
    assignedByRole: 'manager',
    assignedByName: 'Tanvir Hasan',
    subtasks: [
      { id: 'st-1', title: 'Check day 4 line balancing graph on Line 18', completed: true },
      { id: 'st-2', title: 'Review cycle times at bottleneck operation #12', completed: true },
      { id: 'st-3', title: 'Sign off overtime balancing authorization', completed: false }
    ],
    notes: 'Target peak production is 1,200 pcs/day for H&M Crewneck.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo-2',
    title: 'Conduct Cycle Time Study on Neck Rib Attaching Station',
    description: 'Take 10 cycle observations on machine #18-09 and identify operator motion loss.',
    category: 'time_study',
    priority: 'urgent',
    status: 'pending',
    targetDate: '2026-09-16',
    dueTime: '10:00',
    lineNo: '18',
    assignedToRole: 'officer',
    assignedToName: 'Mahmudul Hoque',
    assignedByRole: 'manager',
    assignedByName: 'Tanvir Hasan',
    subtasks: [
      { id: 'st-4', title: 'Record 10 cycles with digital stopwatch', completed: false },
      { id: 'st-5', title: 'Calculate observed vs standard rating (SMV 0.85)', completed: false },
      { id: 'st-6', title: 'Submit bottleneck flow report to Asst. Manager', completed: false }
    ],
    notes: 'High priority due to 12% variance against target SMV.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo-3',
    title: 'Floor WIP Count & Bottleneck Flow Audit at Unit A',
    description: 'Audit in-line bundles between sewing and end-line inspection across Lines 19 & 20.',
    category: 'bottleneck_study',
    priority: 'high',
    status: 'pending',
    targetDate: '2026-09-16',
    dueTime: '13:30',
    lineNo: '19',
    assignedToRole: 'officer',
    assignedToName: 'Mahmudul Hoque',
    assignedByRole: 'assistant_manager',
    assignedByName: 'Farhana Chowdhury',
    subtasks: [
      { id: 'st-7', title: 'Count pieces at sleeve hem station', completed: false },
      { id: 'st-8', title: 'Flag WIP accumulation exceeding 200 pcs', completed: false }
    ],
    notes: 'Ensure balance buffer is maintained.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo-4',
    title: 'Verify T.R Sample Readiness for Next Style TS-2501',
    description: 'Coordinate with sample room for technical run sample before style changeover in 5 days.',
    category: 'tr_sample',
    priority: 'medium',
    status: 'in_progress',
    targetDate: '2026-09-16',
    dueTime: '15:00',
    lineNo: '21',
    assignedToRole: 'officer',
    assignedToName: 'Sharmin Sultana',
    assignedByRole: 'assistant_manager',
    assignedByName: 'Farhana Chowdhury',
    subtasks: [
      { id: 'st-9', title: 'Inspect sample seams and critical attachments', completed: true },
      { id: 'st-10', title: 'Confirm critical machine attachments available', completed: false },
      { id: 'st-11', title: 'File 10-day style input date document', completed: false }
    ],
    notes: 'Follow up with pattern maker for updated mock-up.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo-5',
    title: 'Kaizen 5S Line Audit & Visual Shadow Board Check',
    description: 'Implement continuous improvement standard on Line 22 tools and thread stands.',
    category: 'kaizen_ci',
    priority: 'low',
    status: 'completed',
    targetDate: '2026-09-16',
    dueTime: '16:00',
    lineNo: '22',
    assignedToRole: 'officer',
    assignedToName: 'Sharmin Sultana',
    assignedByRole: 'assistant_manager',
    assignedByName: 'Farhana Chowdhury',
    subtasks: [
      { id: 'st-12', title: 'Audit scissor and clipper placement', completed: true },
      { id: 'st-13', title: 'Label bobbin color codes', completed: true }
    ],
    notes: 'Line 22 completed 5S audit with 94% score.',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString()
  }
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: 'sched-1',
    title: 'Morning Line Walk, Attendance & Absenteeism Check',
    description: 'Audit present operators vs planned line allocations on Unit A & B.',
    startTime: '08:00',
    endTime: '08:30',
    targetDate: '2026-09-16',
    lineNo: 'All Lines',
    category: 'Line Audit',
    assignedToRole: 'assistant_manager',
    assignedToName: 'Farhana Chowdhury',
    assignedByRole: 'manager',
    assignedByName: 'Tanvir Hasan',
    status: 'completed',
    alertMinutesBefore: 5,
    locationOrFloor: 'Floors 01 & 02'
  },
  {
    id: 'sched-2',
    title: 'Top 5 Quality & Process Meetings at Lines 18, 19, 20',
    description: 'Review previous day quality defects, needle breakage, and hourly pace.',
    startTime: '08:30',
    endTime: '09:00',
    targetDate: '2026-09-16',
    lineNo: '18',
    category: 'Top 5 Meeting',
    assignedToRole: 'officer',
    assignedToName: 'Mahmudul Hoque',
    assignedByRole: 'assistant_manager',
    assignedByName: 'Farhana Chowdhury',
    status: 'completed',
    alertMinutesBefore: 5,
    locationOrFloor: 'Floor 01 / Unit A'
  },
  {
    id: 'sched-3',
    title: 'Line 18 Manpower Balancing & Backlog Absorption',
    description: 'Check floater re-allocation and verify target hourly output 145 pcs.',
    startTime: '09:15',
    endTime: '10:30',
    targetDate: '2026-09-16',
    lineNo: '18',
    category: 'Line Balancing',
    assignedToRole: 'officer',
    assignedToName: 'Mahmudul Hoque',
    assignedByRole: 'manager',
    assignedByName: 'Tanvir Hasan',
    status: 'in_progress',
    alertMinutesBefore: 10,
    locationOrFloor: 'Line 18 Station 12'
  },
  {
    id: 'sched-4',
    title: 'Critical Bottleneck Cycle Time & Motion Studies',
    description: 'Observe 10 cycles with stopwatch on neck attachment and hem folds.',
    startTime: '10:45',
    endTime: '12:00',
    targetDate: '2026-09-16',
    lineNo: '19',
    category: 'Time Study',
    assignedToRole: 'officer',
    assignedToName: 'Sharmin Sultana',
    assignedByRole: 'assistant_manager',
    assignedByName: 'Farhana Chowdhury',
    status: 'upcoming',
    alertMinutesBefore: 10,
    locationOrFloor: 'Line 19 Station 08'
  },
  {
    id: 'sched-5',
    title: 'Floor WIP Flow Audit & Hour-by-Hour Output Check',
    description: 'Monitor feeding station WIP balance and pitch time uniformity.',
    startTime: '13:15',
    endTime: '14:30',
    targetDate: '2026-09-16',
    lineNo: '20',
    category: 'WIP Flow',
    assignedToRole: 'assistant_manager',
    assignedToName: 'Farhana Chowdhury',
    assignedByRole: 'manager',
    assignedByName: 'Tanvir Hasan',
    status: 'upcoming',
    alertMinutesBefore: 15,
    locationOrFloor: 'Floor 01 / Unit B'
  },
  {
    id: 'sched-6',
    title: 'Continuous Improvement / Kaizen Follow-up',
    description: 'Inspect fixture enhancements and folder guide adjustments.',
    startTime: '14:45',
    endTime: '15:45',
    targetDate: '2026-09-16',
    lineNo: '21',
    category: 'Kaizen',
    assignedToRole: 'officer',
    assignedToName: 'Sharmin Sultana',
    assignedByRole: 'assistant_manager',
    assignedByName: 'Farhana Chowdhury',
    status: 'upcoming',
    alertMinutesBefore: 5,
    locationOrFloor: 'Floor 02 / Unit A'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Line 18 Efficiency Spike',
    message: 'Line 18 reached 90.0% efficiency on Day 4 build-up. Bottleneck cycle time reduced to 48.5s.',
    type: 'line',
    timestamp: '10 mins ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Shift Task Assigned',
    message: 'New Time Study task assigned on Line 18 Neck Rib Station to IE Officer Mahmudul Hoque.',
    type: 'todo',
    timestamp: '15 mins ago',
    read: true
  },
  {
    id: 'notif-3',
    title: 'Daily Checklist Audit',
    message: 'Checklist for today is 7/12 completed. Morning line walk and attendance audit verified.',
    type: 'alert',
    timestamp: '1 hour ago',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Floor Telemetry Sync',
    message: 'Cloud sync active with factory telemetry node wss://cloud.ie-apparel-systems.io.',
    type: 'sync',
    timestamp: '2 hours ago',
    read: true
  }
];

export const DEFAULT_LAYOUT: DashboardLayout = {
  showHero: true,
  showStats: true,
  showQuickActions: true,
  showAbsents: true,
  showBalancingGraph: true,
  showIO: true,
  showUpcoming: true
};

export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayout = DEFAULT_LAYOUT;
export const DEFAULT_USER_PROFILE: UserProfile = DEFAULT_PROFILE;

export const DEFAULT_SYNC_STATE: SyncState = {
  status: 'live',
  latencyMs: 38,
  lastSyncTime: 'Just now',
  cloudEndpoint: 'factory-node-01.asia'
};
