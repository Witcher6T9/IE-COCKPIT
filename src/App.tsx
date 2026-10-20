/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DailyChecklist } from './components/DailyChecklist';
import { TodoSchedule } from './components/TodoSchedule';
import { LineData } from './components/LineData';
import { LeanToolkit } from './components/LeanToolkit';
import { MonthlySummary } from './components/MonthlySummary';
import { Reports } from './components/Reports';
import { IESimulator } from './components/IESimulator';
import { BottomNav } from './components/BottomNav';
import { SettingsModal } from './components/SettingsModal';
import { UserModal } from './components/UserModal';
import { NotificationsModal } from './components/NotificationsModal';
import { DatabaseModal } from './components/DatabaseModal';
import {
  LineEntry,
  ChecklistMap,
  ChecklistStatus,
  TodoItem,
  ScheduleItem,
  LeanActionItem,
  UserProfile,
  DashboardLayout,
  NotificationItem,
  SyncState
} from './types';
import {
  INITIAL_TODOS,
  INITIAL_SCHEDULES,
  INITIAL_LEAN_ACTIONS,
  DEFAULT_USER_PROFILE,
  DEFAULT_DASHBOARD_LAYOUT,
  INITIAL_NOTIFICATIONS
} from './mockData';
import {
  generateDefaultLineEntries,
  generateDefaultChecklists,
  getTodayDateStr
} from './utils';

export default function App() {
  const todayStr = getTodayDateStr();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedLineNo, setSelectedLineNo] = useState<string>('18');
  const [selectedChecklistDate, setSelectedChecklistDate] = useState<string>(todayStr);

  // Core Data States with LocalStorage Persistence
  const [lines, setLines] = useState<LineEntry[]>(() => {
    try {
      const saved = localStorage.getItem('ie_lines_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaults = generateDefaultLineEntries();
          return parsed.map((item: any, idx: number) => {
            const fallback = defaults[idx] || defaults[0];
            return {
              ...fallback,
              ...item,
              orderQty: item.orderQty ?? fallback.orderQty ?? 10000,
              achievedProd: item.achievedProd ?? fallback.achievedProd ?? 0,
              targetProd: item.targetProd ?? fallback.targetProd ?? 1000,
              wip: item.wip ?? fallback.wip ?? 150,
              dailyInput: item.dailyInput ?? fallback.dailyInput ?? 1000,
              dailyOutput: item.dailyOutput ?? fallback.dailyOutput ?? item.achievedProd ?? 0,
              nextStyle: item.nextStyle ?? fallback.nextStyle ?? 'Basic Tee',
              nextStyleDate: item.nextStyleDate ?? fallback.nextStyleDate ?? todayStr,
              buyer: item.buyer ?? fallback.buyer ?? 'Global Brand',
              remarks: item.remarks ?? fallback.remarks ?? '',
              learningCurve: item.learningCurve ?? fallback.learningCurve,
              balancingAnalysis: item.balancingAnalysis ?? fallback.balancingAnalysis,
              mp: item.mp ?? fallback.mp,
              top5: item.top5 ?? fallback.top5,
              bottleneck: item.bottleneck ?? fallback.bottleneck,
              timeStudy: item.timeStudy ?? fallback.timeStudy,
              buildUp: item.buildUp ?? fallback.buildUp,
              lineIE: item.lineIE ?? fallback.lineIE
            };
          });
        }
      }
      return generateDefaultLineEntries();
    } catch {
      return generateDefaultLineEntries();
    }
  });

  const [checklists, setChecklists] = useState<ChecklistMap>(() => {
    try {
      const saved = localStorage.getItem('ie_checklists_data');
      return saved ? JSON.parse(saved) : generateDefaultChecklists();
    } catch {
      return generateDefaultChecklists();
    }
  });

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem('ie_todos_data');
      return saved ? JSON.parse(saved) : INITIAL_TODOS;
    } catch {
      return INITIAL_TODOS;
    }
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem('ie_schedules_data');
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
    } catch {
      return INITIAL_SCHEDULES;
    }
  });

  const [leanActions, setLeanActions] = useState<LeanActionItem[]>(() => {
    try {
      const saved = localStorage.getItem('ie_lean_actions');
      return saved ? JSON.parse(saved) : INITIAL_LEAN_ACTIONS;
    } catch {
      return INITIAL_LEAN_ACTIONS;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ie_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  const [theme, setTheme] = useState<string>(() => {
    try {
      return localStorage.getItem('ie_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  const [layout, setLayout] = useState<DashboardLayout>(() => {
    try {
      const saved = localStorage.getItem('ie_dashboard_layout');
      return saved ? JSON.parse(saved) : DEFAULT_DASHBOARD_LAYOUT;
    } catch {
      return DEFAULT_DASHBOARD_LAYOUT;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Sync state
  const [syncState, setSyncState] = useState<SyncState>({
    status: 'connected',
    latencyMs: 24,
    lastSyncTime: new Date().toISOString()
  });

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('ie_theme', theme);
    } catch {}
  }, [theme]);

  // Persist lines
  useEffect(() => {
    try {
      localStorage.setItem('ie_lines_data', JSON.stringify(lines));
    } catch {}
  }, [lines]);

  // Persist checklists
  useEffect(() => {
    try {
      localStorage.setItem('ie_checklists_data', JSON.stringify(checklists));
    } catch {}
  }, [checklists]);

  // Persist todos
  useEffect(() => {
    try {
      localStorage.setItem('ie_todos_data', JSON.stringify(todos));
    } catch {}
  }, [todos]);

  // Persist schedules
  useEffect(() => {
    try {
      localStorage.setItem('ie_schedules_data', JSON.stringify(schedules));
    } catch {}
  }, [schedules]);

  // Persist lean actions
  useEffect(() => {
    try {
      localStorage.setItem('ie_lean_actions', JSON.stringify(leanActions));
    } catch {}
  }, [leanActions]);

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('ie_user_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Persist layout
  useEffect(() => {
    try {
      localStorage.setItem('ie_dashboard_layout', JSON.stringify(layout));
    } catch {}
  }, [layout]);

  // Periodic simulated telemetry ping
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncState({
        status: 'connected',
        latencyMs: Math.floor(18 + Math.random() * 16),
        lastSyncTime: new Date().toISOString()
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Today checklist completion calculation
  const todayStatuses = checklists[todayStr] || Array(12).fill('pending');
  const todayDone = todayStatuses.filter(s => s === 'yes').length;
  const todayPending = todayStatuses.filter(s => s === 'pending').length;
  const todayNotDone = todayStatuses.filter(s => s === 'no').length;
  const checklistCompletionPct = Math.round((todayDone / 12) * 100);

  // Pending todos count
  const pendingTodosCount = todos.filter(t => t.status !== 'completed').length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Handlers
  const handleUpdateChecklistTask = (date: string, idx: number, status: ChecklistStatus) => {
    const current = checklists[date] || Array(12).fill('pending');
    const updated = [...current];
    updated[idx] = status;
    setChecklists(prev => ({ ...prev, [date]: updated }));
  };

  const handleBatchUpdateChecklist = (date: string, statuses: ChecklistStatus[]) => {
    setChecklists(prev => ({ ...prev, [date]: statuses }));
  };

  const handleSaveLine = (updatedLine: LineEntry) => {
    setLines(prev => prev.map(l => (l.id === updatedLine.id ? updatedLine : l)));
  };

  const handleAddNewLine = () => {
    const newLineNo = String(parseInt(lines[lines.length - 1]?.lineNo || '24') + 1);
    const newLine: LineEntry = {
      id: Date.now(),
      date: todayStr,
      lineNo: newLineNo,
      floor: 'Floor 02 / Unit B',
      buyer: 'Target',
      style: 'BS-100 Basic Tee',
      smv: 0.75,
      plannedMP: 35,
      workingHours: 8,
      targetEff: 85,
      targetProd: 1200,
      achievedProd: 1020,
      efficiency: 85,
      remarks: 'Newly commissioned line setup',
      orderQty: 10000,
      dailyInput: 1100,
      dailyOutput: 1020,
      wip: 200,
      balancingGraph: 'day1',
      nextStyle: 'BS-200 V-Neck',
      nextStyleDate: todayStr,
      mp: {
        Operator: { present: 26, absent: 2 },
        Helper: { present: 6, absent: 1 },
        'Iron Man': { present: 2, absent: 0 }
      },
      balanceMethod: 'Overtime',
      balanceNotes: 'New line ramp up',
      top5: {
        held: 'yes',
        attendance: 90,
        items: ['Initial machine inspection', 'Thread tension calibration'],
        notes: 'Shift kickoff meeting completed'
      },
      bottleneck: {
        station: 'Neckband attachment',
        cycleTime: 42.0,
        targetCT: 40.0,
        status: 'ok',
        action: 'Guide attachment aligned'
      },
      timeStudy: {
        done: 'yes',
        type: 'time',
        observedRate: 120,
        standardRate: 130
      },
      buildUp: {
        day: '1',
        plannedPct: 60,
        achievedPct: 85,
        operators: 34
      },
      lineIE: {
        name: profile.name,
        level: profile.role,
        period: 'daily'
      }
    };

    setLines(prev => [...prev, newLine]);
    setSelectedLineNo(newLineNo);
  };

  const handleApplySimulationToLine = (lineNo: string, updates: Partial<LineEntry>) => {
    setLines(prev =>
      prev.map(line => {
        if (line.lineNo === lineNo) {
          return {
            ...line,
            ...updates,
            mp: updates.mp ? { ...line.mp, ...updates.mp } : line.mp,
            bottleneck: updates.bottleneck ? { ...line.bottleneck, ...updates.bottleneck } : line.bottleneck
          };
        }
        return line;
      })
    );
    setSelectedLineNo(lineNo);
  };

  const handleAddNewLineWithSimulation = (lineData: Partial<LineEntry>) => {
    const newLineNo = lineData.lineNo || String(parseInt(lines[lines.length - 1]?.lineNo || '24') + 1);
    const newLine: LineEntry = {
      id: Date.now(),
      date: todayStr,
      lineNo: newLineNo,
      floor: lineData.floor || 'Floor 02 / Unit B',
      buyer: lineData.buyer || 'H&M',
      style: lineData.style || 'TS-2401 Crewneck Basic',
      smv: lineData.smv || 12.5,
      plannedMP: lineData.plannedMP || 36,
      workingHours: lineData.workingHours || 8,
      targetEff: lineData.targetEff || 85,
      targetProd: lineData.targetProd || 1200,
      achievedProd: 0,
      efficiency: 0,
      remarks: lineData.remarks || 'Commissioned via IE Simulator',
      orderQty: 15000,
      dailyInput: lineData.targetProd || 1200,
      dailyOutput: 0,
      wip: 120,
      balancingGraph: 'day1',
      nextStyle: '',
      nextStyleDate: '',
      mp: lineData.mp || {
        Operator: { present: 28, absent: 0 },
        Helper: { present: 6, absent: 0 },
        'Iron Man': { present: 2, absent: 0 }
      },
      balanceMethod: 'IE Workstation Balancing',
      balanceNotes: 'Balanced with simulated pitch time',
      top5: {
        held: 'yes',
        attendance: 100,
        items: ['Trial run approved', 'Attachments verified'],
        notes: 'Line setup complete'
      },
      bottleneck: lineData.bottleneck || {
        station: 'Critical Assembly',
        cycleTime: 28,
        targetCT: 26.8,
        status: 'ok',
        action: 'IE plan implemented'
      },
      timeStudy: {
        done: 'yes',
        type: 'time',
        observedRate: 150,
        standardRate: 160
      },
      buildUp: {
        day: '1',
        plannedPct: 55,
        achievedPct: 55,
        operators: lineData.plannedMP || 36
      },
      lineIE: {
        name: profile.name,
        level: 'executive',
        period: 'daily'
      }
    };
    setLines(prev => [...prev, newLine]);
    setSelectedLineNo(newLineNo);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleRestoreBackup = (data: any) => {
    if (data.lines) setLines(data.lines);
    if (data.checklists) setChecklists(data.checklists);
    if (data.todos) setTodos(data.todos);
    if (data.leanActions) setLeanActions(data.leanActions);
  };

  const handleResetFactoryDefaults = () => {
    setLines(generateDefaultLineEntries());
    setChecklists(generateDefaultChecklists());
    setTodos(INITIAL_TODOS);
    setSchedules(INITIAL_SCHEDULES);
    setLeanActions(INITIAL_LEAN_ACTIONS);
    localStorage.clear();
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAddTodoFromAudit = (item: Partial<TodoItem>) => {
    const fullItem: TodoItem = {
      id: item.id || `todo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: item.title || 'Kaizen Task',
      description: item.description || '',
      category: item.category || 'kaizen_ci',
      priority: item.priority || 'medium',
      status: item.status || 'pending',
      targetDate: item.targetDate || todayStr,
      dueTime: item.dueTime || '05:00 PM',
      lineNo: item.lineNo || selectedLineNo,
      assignedToRole: item.assignedToRole || 'Line IE',
      assignedToName: item.assignedToName || profile.name,
      assignedByRole: item.assignedByRole || 'AI IE Diagnostic Agent',
      assignedByName: item.assignedByName || 'IE System',
      subtasks: item.subtasks || [],
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [...prev, fullItem]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f3ec] text-[#17343a] antialiased">
      {/* Top Application Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onLogoClick={() => setCurrentTab('dashboard')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-3 sm:px-6 py-5 sm:py-7">
        {currentTab === 'dashboard' && (
          <Dashboard
            lines={lines}
            todayDate={todayStr}
            layout={layout}
            onNavigate={setCurrentTab}
            onSelectLine={setSelectedLineNo}
            checklistCompletion={checklistCompletionPct}
            checklistCounts={{
              done: todayDone,
              pending: todayPending,
              notDone: todayNotDone,
              total: 12
            }}
            profile={profile}
            onOpenUserModal={() => setIsUserModalOpen(true)}
          />
        )}

        {currentTab === 'checklist' && (
          <DailyChecklist
            checklists={checklists}
            selectedDate={selectedChecklistDate}
            onSelectDate={setSelectedChecklistDate}
            onUpdateTaskStatus={handleUpdateChecklistTask}
            onBatchUpdateChecklist={handleBatchUpdateChecklist}
            profile={profile}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'todo-schedule' && (
          <TodoSchedule
            todos={todos}
            schedules={schedules}
            onUpdateTodos={setTodos}
            onUpdateSchedules={setSchedules}
            profile={profile}
          />
        )}

        {currentTab === 'linedata' && (
          <LineData
            lines={lines}
            selectedLineNo={selectedLineNo}
            onSelectLineNo={setSelectedLineNo}
            onSaveLine={handleSaveLine}
            onAddNewLine={handleAddNewLine}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'simulator' && (
          <IESimulator
            lines={lines}
            selectedLineNo={selectedLineNo}
            onSelectLineNo={setSelectedLineNo}
            onApplyToLine={handleApplySimulationToLine}
            onAddNewLineWithSimulation={handleAddNewLineWithSimulation}
            onNavigate={setCurrentTab}
            profile={profile}
          />
        )}

        {currentTab === 'lean-toolkit' && (
          <LeanToolkit
            actions={leanActions}
            onUpdateActions={setLeanActions}
            profile={profile}
          />
        )}

        {currentTab === 'monthly' && (
          <MonthlySummary
            lines={lines}
            checklists={checklists}
            selectedDate={selectedChecklistDate}
            onSelectDate={setSelectedChecklistDate}
            onNavigate={setCurrentTab}
            profile={profile}
            onAddTodo={handleAddTodoFromAudit}
          />
        )}

        {currentTab === 'reports' && (
          <Reports lines={lines} todayDate={todayStr} profile={profile} />
        )}
      </main>

      {/* Industrial Engineering Footer */}
      <footer className="mt-auto border-t border-[#d9d2c2] bg-[#fbfaf6] py-4 pb-20 md:pb-18 text-xs text-[#527078]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#17343a]">IE Daily Control</span>
            <span>•</span>
            <span>Garment Sewing Line Efficiency System</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline font-mono-numbers">Release v2.4.0</span>
          </div>

          <div className="flex items-center gap-4 font-mono-numbers text-[11px]">
            <span>Active Unit: Plant #1 ({profile.assignedUnit})</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Cloud Sync 100% OK</span>
          </div>
        </div>
      </footer>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        checklistProgress={checklistCompletionPct}
        pendingTodosCount={pendingTodosCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenDatabase={() => setIsDatabaseOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        profile={profile}
      />

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onSelectTheme={setTheme}
        layout={layout}
        onUpdateLayout={setLayout}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        profile={profile}
        onUpdateProfile={setProfile}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onClearAll={handleClearNotifications}
      />

      <DatabaseModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
        lines={lines}
        checklists={checklists}
        todos={todos}
        leanActions={leanActions}
        onRestoreData={handleRestoreBackup}
        onResetFactoryData={handleResetFactoryDefaults}
      />
    </div>
  );
}
