/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, UserCheck, Shield, Sparkles, Check, User } from 'lucide-react';
import { UserProfile, RoleTier } from '../types';
import { ROLE_TIERS } from '../mockData';
import { ActiveOperationalTiers } from './ActiveOperationalTiers';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  initialTab?: 'tiers' | 'profile';
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  initialTab = 'tiers'
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'tiers' | 'profile'>(initialTab);
  const [name, setName] = useState(profile.name);
  const [empId, setEmpId] = useState(profile.employeeId || 'IE-9402');
  const [unit, setUnit] = useState(profile.assignedUnit || 'Sewing Unit 1');
  const [email, setEmail] = useState(profile.email || 'ashikur@factory.com');
  const [switchNotice, setSwitchNotice] = useState<string | null>(null);

  const activeTier =
    ROLE_TIERS.find(t => t.id === (profile.tierId || 'tier_0')) || ROLE_TIERS[0];

  const handleSelectTier = (tier: RoleTier) => {
    onUpdateProfile({
      ...profile,
      tierId: tier.id,
      jobTitle: tier.name,
      role: (tier.systemRole.toLowerCase() as any) || profile.role
    });

    setSwitchNotice(
      `Active system role switched to ${tier.name} (${tier.shortCode} • Tier Level ${tier.level})`
    );
    setTimeout(() => {
      setSwitchNotice(null);
    }, 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      employeeId: empId,
      assignedUnit: unit,
      email
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#fbfaf6] border border-[#d9d2c2] rounded-3xl max-w-xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#e7e1d5] bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0e7490] text-white flex items-center justify-center shadow-xs shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-[#17343a]">
                  System Role & Operational Tiers
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#0e7490] text-white">
                  {activeTier.shortCode}
                </span>
              </div>
              <p className="text-xs text-[#527078]">
                Industrial Engineering Floor Access & Operational Authority Matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#f1eee6] text-slate-500 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-[#e7e1d5] bg-[#fbfaf6] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tiers')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'tiers'
                  ? 'bg-[#17343a] text-white shadow-2xs'
                  : 'bg-white text-[#527078] hover:text-[#17343a] border border-[#d9d2c2]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Operational Tiers</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                5 Tiers
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-[#17343a] text-white shadow-2xs'
                  : 'bg-white text-[#527078] hover:text-[#17343a] border border-[#d9d2c2]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Engineer Profile</span>
            </button>
          </div>

          <div className="text-[11px] font-mono-numbers text-[#527078] hidden sm:block">
            Active: <span className="font-bold text-[#17343a]">{activeTier.name} ({activeTier.shortCode})</span>
          </div>
        </div>

        {/* Notification Toast on Switch */}
        {switchNotice && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs animate-fade-in shrink-0">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{switchNotice}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'tiers' ? (
            <ActiveOperationalTiers
              currentTierId={profile.tierId || 'tier_0'}
              onSelectTier={handleSelectTier}
              profile={profile}
            />
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-[#d9d2c2] space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f1eee6]">
                  <UserCheck className="w-4 h-4 text-[#176f78]" />
                  <span className="font-bold text-xs uppercase text-[#17343a]">
                    Engineer Personal Details
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#fbfaf6] border border-[#d9d2c2] font-bold text-[#17343a] focus:outline-hidden focus:border-[#176f78]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={empId}
                      onChange={e => setEmpId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#fbfaf6] border border-[#d9d2c2] font-mono-numbers focus:outline-hidden focus:border-[#176f78]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                      Assigned Plant / Unit
                    </label>
                    <input
                      type="text"
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#fbfaf6] border border-[#d9d2c2] focus:outline-hidden focus:border-[#176f78]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#fbfaf6] border border-[#d9d2c2] focus:outline-hidden focus:border-[#176f78]"
                  />
                </div>
              </div>

              {/* Current Active Tier Summary in Profile Tab */}
              <div className="p-4 rounded-2xl bg-white border border-[#d9d2c2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-[#527078]">
                    Current Active Hierarchy Tier
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('tiers')}
                    className="text-[11px] font-bold text-[#176f78] hover:underline"
                  >
                    Change Tier →
                  </button>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                    style={{ backgroundColor: activeTier.color }}
                  >
                    {activeTier.shortCode}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#17343a]">
                      {activeTier.name} (Tier Level {activeTier.level})
                    </div>
                    <div className="text-[11px] text-[#527078]">
                      Role: <strong className="font-mono text-[#17343a]">{activeTier.systemRole}</strong> • {activeTier.description}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#f1eee6] text-[#527078] font-bold hover:bg-[#e7e1d5]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#176f78] text-white font-bold hover:bg-[#12555c] shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-[#e7e1d5] bg-white flex items-center justify-between text-xs text-[#527078] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[11px]">System Status: Online & Synchronized</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#f1eee6] hover:bg-[#e2ddd0] text-[#17343a] font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
