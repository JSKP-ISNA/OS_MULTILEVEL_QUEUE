import React from 'react';
import { Process } from '../types';

type Props = {
  processes: Process[];
  deleteProcess: (id: number) => void;
};

export default function ProcessList({ processes, deleteProcess }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">All Processes</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {processes.map(p => (
          <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">{p.name}</div>
              <div>
                <div className="font-medium text-gray-800 text-sm">{p.name}</div>
                <div className="text-xs text-gray-500">{p.queue}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${p.remainingTime === 0 ? 'text-green-600' : 'text-blue-600'}`}>{p.remainingTime}/{p.burstTime}</span>
              <button onClick={() => deleteProcess(p.id)} className="p-1 text-red-500 hover:bg-red-50 rounded transition">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
