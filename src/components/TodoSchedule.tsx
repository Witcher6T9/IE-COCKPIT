/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Plus,
  Filter,
  CheckCircle2,
  Circle,
  AlertCircle,
  User,
  MapPin,
  Calendar,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { TodoItem, ScheduleItem, Subtask, UserProfile } from '../types';

interface TodoScheduleProps {
  todos: TodoItem[];
  schedules: ScheduleItem[];
  onUpdateTodos: (todos: TodoItem[]) => void;
  onUpdateSchedules: (schedules: ScheduleItem[]) => void;
  profile: UserProfile;
}

export const TodoSchedule: React.FC<TodoScheduleProps> = ({
  todos,
  schedules,
  onUpdateTodos,
  onUpdateSchedules,
  profile
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'todos' | 'schedules'>('todos');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPoW, setFilterPoW] = useState<'all' | 'pow'>('all');
  const [isPointOfWorkModalOpen, setIsPointOfWorkModalOpen] = useState(false);

  // Unified Point-of-Work & IE Action form state (from screenshot)
  const [powAction, setPowAction] = useState('');
  const [powLeanMethod, setPowLeanMethod] = useState('10. Gemba Walk');
  const [powUrgency, setPowUrgency] = useState('Immediate (Next 30 mins)');
  const [powLine, setPowLine] = useState('Line 18');
  const [powStation, setPowStation] = useState('');
  const [powAssignedRole, setPowAssignedRole] = useState('');
  const [powAssigneeName, setPowAssigneeName] = useState('');
  const [powSubtasks, setPowSubtasks] = useState('');

  const handleSavePointOfWorkAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!powAction.trim()) return;

    const lineClean = powLine.replace(/[^0-9]/g, '') || '18';
    const urgencyPriorityMap: Record<string, 'urgent' | 'high' | 'medium' | 'low'> = {
      'Immediate (Next 30 mins)': 'urgent',
      'High (Today / Shift A)': 'high',
      'Medium (Next 24h)': 'medium',
      'Low (Continuous / Routine)': 'low'
    };

    const parsedSubtasks: Subtask[] = powSubtasks.trim()
      ? powSubtasks
          .split('\n')
          .filter(s => s.trim().length > 0)
          .map((title, idx) => ({
            id: `st-pow-${Date.now()}-${idx}`,
            title: title.trim(),
            completed: false
          }))
      : [
          { id: `st-pow-1`, title: 'Execute immediate containment / countermeasure on floor', completed: false },
          { id: `st-pow-2`, title: 'Verify operator standard work & ergonomics adherence', completed: false }
        ];

    const isPoW = powLeanMethod !== 'General IE Task / Routine Work';

    const newPowTask: TodoItem = {
      id: `pow-${Date.now()}`,
      title: powAction.trim(),
      description: `Point-of-Work action originated from ${powLeanMethod}. Location: ${powStation.trim() || 'Floor Station'}.`,
      category: 'kaizen_ci',
      priority: urgencyPriorityMap[powUrgency] || 'urgent',
      status: 'pending',
      targetDate: new Date().toISOString().split('T')[0],
      dueTime: powUrgency.includes('Immediate') ? 'Immediate' : '15:00',
      lineNo: lineClean,
      assignedToRole: powAssignedRole || 'Line Supervisor',
      assignedToName: powAssigneeName.trim() || profile.name,
      assignedByRole: profile.role,
      assignedByName: profile.name,
      subtasks: parsedSubtasks,
      isPointOfWork: isPoW,
      leanMethod: powLeanMethod,
      stationLocation: powStation.trim() || undefined,
      urgencyLevel: powUrgency,
      createdAt: new Date().toISOString()
    };

    onUpdateTodos([newPowTask, ...todos]);
    setIsPointOfWorkModalOpen(false);
    // Reset form
    setPowAction('');
    setPowStation('');
    setPowAssigneeName('');
    setPowAssignedRole('');
    setPowSubtasks('');
  };

  const toggleSubtask = (todoId: string, subtaskId: string) => {
    const updated = todos.map(todo => {
      if (todo.id !== todoId) return todo;
      const newSub = todo.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      // If all subtasks completed, mark todo completed
      const allDone = newSub.length > 0 && newSub.every(s => s.completed);
      return {
        ...todo,
        subtasks: newSub,
        status: allDone ? ('completed' as const) : ('in_progress' as const)
      };
    });
    onUpdateTodos(updated);
  };

  const toggleTodoStatus = (todoId: string) => {
    const updated = todos.map(todo => {
      if (todo.id !== todoId) return todo;
      const nextStatus =
        todo.status === 'completed'
          ? ('pending' as const)
          : ('completed' as const);
      return {
        ...todo,
        status: nextStatus,
        completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
        subtasks: todo.subtasks.map(st => ({
          ...st,
          completed: nextStatus === 'completed'
        }))
      };
    });
    onUpdateTodos(updated);
  };

  const filteredTodos = todos.filter(t => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPoW === 'pow' && !t.isPointOfWork) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Sub-tabs */}
      <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#dceceb] text-[#176f78]">
                Point-of-Work Actions & Shift Timetable
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#17343a] tracking-tight">
              IE Tasks, Point-of-Work & Shift Schedules
            </h1>
            <p className="text-xs sm:text-sm text-[#527078] mt-1">
              Log point-of-work immediate countermeasures, assign time studies and balancing audits, and coordinate shift walks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-[#f1eee6] p-1 rounded-xl border border-[#d9d2c2]">
              <button
                onClick={() => setActiveSubTab('todos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeSubTab === 'todos'
                    ? 'bg-[#176f78] text-white shadow-2xs'
                    : 'text-[#527078] hover:text-[#17343a]'
                }`}
              >
                Action To-Dos & Point-of-Work ({todos.length})
              </button>
              <button
                onClick={() => setActiveSubTab('schedules')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeSubTab === 'schedules'
                    ? 'bg-[#176f78] text-white shadow-2xs'
                    : 'text-[#527078] hover:text-[#17343a]'
                }`}
              >
                Shift Timetable ({schedules.length})
              </button>
            </div>

            {activeSubTab === 'todos' && (
              <button
                onClick={() => setIsPointOfWorkModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#176f78] text-white hover:bg-[#12555c] transition-colors text-xs font-bold shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Record Point-of-Work Action</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters if in Todos tab */}
        {activeSubTab === 'todos' && (
          <div className="mt-5 pt-4 border-t border-[#e7e1d5] flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#527078]">
              <Filter className="w-3.5 h-3.5" />
              <span>Priority:</span>
            </div>
            {['all', 'urgent', 'high', 'medium', 'low'].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors ${
                  filterPriority === p
                    ? 'bg-[#176f78] text-white'
                    : 'bg-[#f1eee6] text-[#527078] hover:bg-[#e7e1d5]'
                }`}
              >
                {p}
              </button>
            ))}

            <div className="h-4 w-px bg-[#d9d2c2] mx-1"></div>

            <div className="flex items-center gap-1.5 text-xs text-[#527078]">
              <span>Status:</span>
            </div>
            {['all', 'pending', 'in_progress', 'completed'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors ${
                  filterStatus === s
                    ? 'bg-[#176f78] text-white'
                    : 'bg-[#f1eee6] text-[#527078] hover:bg-[#e7e1d5]'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}

            <div className="h-4 w-px bg-[#d9d2c2] mx-1"></div>

            <div className="flex items-center gap-1.5 text-xs text-[#527078]">
              <span>Scope:</span>
            </div>
            <button
              onClick={() => setFilterPoW('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors ${
                filterPoW === 'all'
                  ? 'bg-[#176f78] text-white'
                  : 'bg-[#f1eee6] text-[#527078] hover:bg-[#e7e1d5]'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilterPoW(filterPoW === 'pow' ? 'all' : 'pow')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors ${
                filterPoW === 'pow'
                  ? 'bg-[#176f78] text-white'
                  : 'bg-[#f1eee6] text-[#527078] hover:bg-[#e7e1d5]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Point-of-Work Only</span>
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      {activeSubTab === 'todos' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTodos.map(todo => {
            const isCompleted = todo.status === 'completed';
            const doneSubtasks = todo.subtasks.filter(st => st.completed).length;

            return (
              <div
                key={todo.id}
                className={`rounded-2xl border p-5 transition-all bg-[#fbfaf6] ${
                  isCompleted
                    ? 'border-emerald-200 opacity-80'
                    : todo.isPointOfWork
                    ? 'border-[#176f78]/40 shadow-xs ring-1 ring-[#176f78]/10'
                    : todo.priority === 'urgent'
                    ? 'border-rose-300 shadow-xs'
                    : 'border-[#d9d2c2] shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 w-full">
                    <button
                      onClick={() => toggleTodoStatus(todo.id)}
                      className="mt-0.5 text-slate-400 hover:text-[#176f78] transition-colors shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        {todo.isPointOfWork && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#176f78] text-white shadow-2xs">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Point-of-Work</span>
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#dceceb] text-[#176f78]">
                          Line {todo.lineNo}
                        </span>
                        {todo.leanMethod && (
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            {todo.leanMethod}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            todo.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : todo.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {todo.urgencyLevel || todo.priority}
                        </span>
                        <span className="text-[10px] text-[#527078] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due {todo.dueTime}
                        </span>
                        {todo.stationLocation && (
                          <span className="text-[10px] text-[#176f78] font-medium flex items-center gap-1 bg-[#f1eee6] px-2 py-0.5 rounded border border-[#d9d2c2]">
                            <MapPin className="w-3 h-3 text-[#176f78]" /> {todo.stationLocation}
                          </span>
                        )}
                      </div>
                      <h3
                        className={`font-bold text-sm text-[#17343a] ${
                          isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <p className="text-xs text-[#527078] mt-1 leading-relaxed">
                        {todo.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subtasks checklist */}
                {todo.subtasks.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#e7e1d5] space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#527078]">
                      <span className="font-bold">Subtasks ({doneSubtasks}/{todo.subtasks.length})</span>
                      <span className="font-mono-numbers">
                        {Math.round((doneSubtasks / todo.subtasks.length) * 100)}%
                      </span>
                    </div>
                    {todo.subtasks.map(st => (
                      <label
                        key={st.id}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#f1eee6] cursor-pointer text-xs transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => toggleSubtask(todo.id, st.id)}
                          className="w-3.5 h-3.5 rounded text-[#176f78] focus:ring-[#176f78]"
                        />
                        <span
                          className={`${
                            st.completed ? 'line-through text-slate-400' : 'text-[#17343a]'
                          }`}
                        >
                          {st.title}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Footer metadata */}
                <div className="mt-4 pt-3 border-t border-[#e7e1d5] flex items-center justify-between text-[11px] text-[#527078]">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <strong>{todo.assignedToName}</strong>
                    {todo.assignedToRole && <span className="text-[10px] text-[#527078]">({todo.assignedToRole})</span>}
                  </span>
                  <span>From: {todo.assignedByName}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Shift Timetable Schedules */
        <div className="space-y-3">
          {schedules.map(sched => {
            const isCompleted = sched.status === 'completed';
            const isInProgress = sched.status === 'in_progress';

            return (
              <div
                key={sched.id}
                className={`rounded-2xl border p-4 sm:p-5 bg-[#fbfaf6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isInProgress
                    ? 'border-[#176f78] shadow-xs'
                    : isCompleted
                    ? 'border-emerald-200'
                    : 'border-[#d9d2c2]'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Time Badge */}
                  <div className="shrink-0 text-center p-2 rounded-xl bg-[#f1eee6] border border-[#d9d2c2] min-w-[70px]">
                    <div className="text-xs font-mono-numbers font-bold text-[#17343a]">
                      {sched.startTime}
                    </div>
                    <div className="text-[10px] text-[#527078] font-mono-numbers">
                      {sched.endTime}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase bg-[#dceceb] text-[#176f78]">
                        {sched.category}
                      </span>
                      <span className="text-[11px] text-[#527078] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#176f78]" />
                        {sched.locationOrFloor}
                      </span>
                      {isInProgress && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 animate-pulse">
                          Active Now
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-[#17343a]">
                      {sched.title}
                    </h3>
                    <p className="text-xs text-[#527078] mt-0.5">
                      {sched.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right text-[11px] text-[#527078]">
                    <div>Assigned: <strong className="text-[#17343a]">{sched.assignedToName}</strong></div>
                    <div className="text-[10px] text-[#527078]">Lead: {sched.assignedByName}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* RECORD POINT-OF-WORK ACTION MODAL (MERGED IE ACTION) */}
      {/* ────────────────────────────────────────────────────────── */}
      {isPointOfWorkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-[#fbfaf6] border border-[#d9d2c2] shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#176f78] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="font-display font-extrabold text-base sm:text-lg uppercase tracking-tight text-[#17343a]">
                  RECORD POINT-OF-WORK ACTION
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPointOfWorkModalOpen(false)}
                className="text-[#738287] hover:text-[#17343a] p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePointOfWorkAction} className="space-y-4">
              {/* POINT-OF-WORK IMMEDIATE ACTION * */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#527078] mb-1.5">
                  POINT-OF-WORK IMMEDIATE ACTION *
                </label>
                <textarea
                  required
                  rows={3}
                  value={powAction}
                  onChange={e => setPowAction(e.target.value)}
                  placeholder="e.g. Mount needle tray shadow board on Station 04 by 2 PM"
                  className="w-full rounded-2xl border border-[#d9d2c2] bg-white px-4 py-3 text-xs text-[#17343a] placeholder:text-[#94a3b8] focus:outline-hidden focus:border-[#176f78] focus:ring-1 focus:ring-[#176f78] resize-none"
                />
              </div>

              {/* Row 1: ORIGINATING LEAN METHOD + URGENCY LEVEL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#527078] mb-1.5">
                    ORIGINATING LEAN METHOD
                  </label>
                  <div className="relative">
                    <select
                      value={powLeanMethod}
                      onChange={e => setPowLeanMethod(e.target.value)}
                      className="w-full rounded-2xl border border-[#d9d2c2] bg-white px-3.5 py-3 text-xs font-medium text-[#17343a] appearance-none focus:outline-hidden focus:border-[#176f78] pr-8"
                    >
                      <option value="10. Gemba Walk">10. Gemba Walk</option>
                      <option value="01. 5S Audit">01. 5S Audit</option>
                      <option value="02. 7 Wastes">02. 7 Wastes</option>
                      <option value="03. Kaizen PDCA">03. Kaizen PDCA</option>
                      <option value="04. SMED Changeover">04. SMED Changeover</option>
                      <option value="05. Takt & Yamazumi">05. Takt & Yamazumi</option>
                      <option value="06. Andon Board">06. Andon Board</option>
                      <option value="07. OEE / TPM">07. OEE / TPM</option>
                      <option value="08. A3 Problem Solving">08. A3 Problem Solving</option>
                      <option value="09. Kanban / WIP">09. Kanban / WIP</option>
                      <option value="11. Standard Work">11. Standard Work</option>
                      <option value="12. Poka-Yoke">12. Poka-Yoke</option>
                      <option value="General IE Task / Routine Work">General IE Task / Routine Work</option>
                      <option value="Time & Motion Study (SMV)">Time & Motion Study (SMV)</option>
                      <option value="Line Balancing & Bottleneck">Line Balancing & Bottleneck</option>
                      <option value="Quality & Defect Prevention">Quality & Defect Prevention</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#527078] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#527078] mb-1.5">
                    URGENCY LEVEL
                  </label>
                  <div className="relative">
                    <select
                      value={powUrgency}
                      onChange={e => setPowUrgency(e.target.value)}
                      className="w-full rounded-2xl border border-[#d9d2c2] bg-white px-3.5 py-3 text-xs font-medium text-[#17343a] appearance-none focus:outline-hidden focus:border-[#176f78] pr-8"
                    >
                      <option value="Immediate (Next 30 mins)">Immediate (Next 30 mins)</option>
                      <option value="High (Today / Shift A)">High (Today / Shift A)</option>
                      <option value="Medium (Next 24h)">Medium (Next 24h)</option>
                      <option value="Low (Routine / Continuous)">Low (Routine / Continuous)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#527078] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: PRODUCTION LINE + STATION / MACHINE LOCATION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#527078] mb-1.5">
                    PRODUCTION LINE
                  </label>
                  <div className="relative">
                    <select
                      value={powLine}
                      onChange={e => setPowLine(e.target.value)}
                      className="w-full rounded-2xl border border-[#d9d2c2] bg-white px-3.5 py-3 text-xs font-medium text-[#17343a] appearance-none focus:outline-hidden focus:border-[#176f78] pr-8"
                    >
                      <option value="Line 18">Line 18</option>
                      <option value="Line 19">Line 19</option>
                      <option value="Line 20">Line 20</option>
                      <option value="Line 21">Line 21</option>
                      <option value="Line 22">Line 22</option>
                      <option value="Line 23">Line 23</option>
                      <option value="Line 24">Line 24</option>
                      <option value="Cutting Bay">Cutting Bay</option>
                      <option value="Finishing Section">Finishing Section</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#527078] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#527078] mb-1.5">
                    STATION / MACHINE LOCATION
                  </label>
                  <input
                    type="text"
                    value={powStation}
                    onChange={e => setPowStation(e.target.value)}
                    placeholder="e.g. Station 04 - Collar join"
                    className="w-full rounded-2xl border border-[#d9d2c2] bg-white px-3.5 py-2.5 text-xs text-[#17343a] placeholder:text-[#94a3b8] focus:outline-hidden focus:border-[#176f78]"
                  />
                </div>
              </div>

              {/* Row 3: ASSIGNED TO + ASSIGNEE / OWNER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#527078] mb-1.5">
                    ASSIGNED TO
                  </label>
                  <div className="relative">
                    <select
                      value={powAssignedRole}
                      onChange={e => setPowAssignedRole(e.target.value)}
                      className="w-full rounded-2xl border border-[#d9d2c2] bg-white px-3.5 py-3 text-xs font-medium text-[#17343a] appearance-none focus:outline-hidden focus:border-[#176f78] pr-8"
                    >
                      <option value="">e.g. Choose from list...</option>
                      <option value="Line Supervisor">Line Supervisor</option>
                      <option value="Maintenance Mechanic">Maintenance Mechanic</option>
                      <option value="Quality Inspector">Quality Inspector</option>
                      <option value="IE Officer">IE Officer</option>
                      <option value="Floor In-Charge">Floor In-Charge</option>
                      <option value="Operator / Team Leader">Operator / Team Leader</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#527078] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#527078] mb-1.5">
                    ASSIGNEE / OWNER
                  </label>
                  <input
                    type="text"
                    value={powAssigneeName}
                    onChange={e => setPowAssigneeName(e.target.value)}
                    placeholder="e.g. Engr. Rezaul Karim"
                    className="w-full rounded-2xl border border-[#d9d2c2] bg-white px-3.5 py-2.5 text-xs text-[#17343a] placeholder:text-[#94a3b8] focus:outline-hidden focus:border-[#176f78]"
                  />
                </div>
              </div>

              {/* Row 4: Subtasks / Checkpoints (Optional) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#527078] mb-1.5">
                  SUBTASKS / CHECKPOINTS (OPTIONAL)
                </label>
                <textarea
                  rows={2}
                  value={powSubtasks}
                  onChange={e => setPowSubtasks(e.target.value)}
                  placeholder="e.g. Mount shadow board within 30cm&#10;Verify operator ergonomics & motion economy"
                  className="w-full rounded-2xl border border-[#d9d2c2] bg-white px-3.5 py-2.5 text-xs text-[#17343a] placeholder:text-[#94a3b8] focus:outline-hidden focus:border-[#176f78] resize-none"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPointOfWorkModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-[#527078] hover:text-[#17343a] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#176f78] hover:bg-[#12555c] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Save Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
