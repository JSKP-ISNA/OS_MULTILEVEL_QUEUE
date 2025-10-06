import React from 'react';
import { GanttItem } from '../types';

type Props = { ganttChart: GanttItem[]; currentTime: number };

export default function GanttChart({ ganttChart, currentTime }: Props) {
  if (ganttChart.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Execution Timeline</h2>
      <div className="overflow-x-auto">
        <div className="flex min-w-max">
          {ganttChart.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`${item.color} text-white px-4 py-3 min-w-[60px] text-center font-semibold text-sm border-r border-white`}>{item.processName}</div>
              <div className="text-gray-500 text-xs mt-2">{item.time}</div>
            </div>
          ))}
          <div className="text-gray-500 text-xs mt-12 ml-2">{currentTime}</div>
        </div>
      </div>
    </div>
  );
}
