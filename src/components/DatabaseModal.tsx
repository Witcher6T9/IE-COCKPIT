/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { X, Database, Download, Upload, RotateCcw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { LineEntry, ChecklistMap, TodoItem, LeanActionItem } from '../types';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lines: LineEntry[];
  checklists: ChecklistMap;
  todos: TodoItem[];
  leanActions: LeanActionItem[];
  onRestoreData: (data: any) => void;
  onResetFactoryData: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  lines,
  checklists,
  todos,
  leanActions,
  onRestoreData,
  onResetFactoryData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      lines,
      checklists,
      todos,
      leanActions
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ie_daily_control_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.lines && parsed.checklists) {
          onRestoreData(parsed);
          alert('Database restored successfully from backup file!');
          onClose();
        } else {
          alert('Invalid backup file schema.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fbfaf6] border border-[#d9d2c2] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#e7e1d5] pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#176f78]" />
            <h3 className="font-display text-xl font-bold uppercase text-[#17343a]">
              Local Database & Backup
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl hover:bg-[#e7e1d5] text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#527078] leading-relaxed">
          All sewing line telemetries, 12-task daily checklists, floor schedules, and Lean Kaizens are stored locally and synced with high-availability client storage.
        </p>

        {/* Database Records Count */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#e7e1d5]">
            <div className="text-[10px] text-[#527078] uppercase font-bold">Sewing Lines</div>
            <div className="font-bold text-base text-[#17343a]">{lines.length} Records</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#e7e1d5]">
            <div className="text-[10px] text-[#527078] uppercase font-bold">Checklists</div>
            <div className="font-bold text-base text-[#17343a]">{Object.keys(checklists).length} Days Logged</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#e7e1d5]">
            <div className="text-[10px] text-[#527078] uppercase font-bold">Floor Tasks</div>
            <div className="font-bold text-base text-[#17343a]">{todos.length} Active</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#e7e1d5]">
            <div className="text-[10px] text-[#527078] uppercase font-bold">Kaizens Logged</div>
            <div className="font-bold text-base text-[#17343a]">{leanActions.length} Actions</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#176f78] text-white hover:bg-[#12555c] transition-colors text-xs font-bold"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Database Backup (JSON)</span>
          </button>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImportJSON}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-[#d9d2c2] text-[#17343a] hover:bg-[#f1eee6] transition-colors text-xs font-bold"
          >
            <Upload className="w-4 h-4 text-[#176f78]" />
            <span>Restore Backup File</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset all sewing lines and checklists back to factory initial state?')) {
                onResetFactoryData();
                onClose();
              }
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors text-xs font-bold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Factory Defaults</span>
          </button>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#e7e1d5]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#f1eee6] text-[#527078] text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
