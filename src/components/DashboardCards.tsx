import React from 'react';

type Props = {
  currentTime: number;
  avgTurnaroundTime: string;
  completedCount: number;
  totalCount: number;
  isRunning: boolean;
  onToggleRun: () => void;
  onReset: () => void;
};

export default function DashboardCards({ currentTime, avgTurnaroundTime, completedCount, totalCount, isRunning, onToggleRun, onReset }: Props) {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-sm text-gray-500 mb-3">Current Time</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{currentTime}</div>
            <div className="text-xs text-gray-400">Time units elapsed</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-sm text-gray-500 mb-3">Avg Turnaround</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{avgTurnaroundTime}</div>
            <div className="text-xs text-gray-400">Time units</div>
          </div>
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <div className="text-2xl font-bold text-teal-600">{totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-sm text-gray-500 mb-3">Controls</div>
        <div className="flex gap-2">
          <button
            onClick={onToggleRun}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
