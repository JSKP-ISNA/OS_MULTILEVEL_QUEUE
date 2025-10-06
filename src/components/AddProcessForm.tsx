import React, { useEffect, useState } from 'react';
import { Queue } from '../types';

type Props = {
  newProcess: any;
  setNewProcess: any;
  addProcess: (p: any) => void;
  queues?: any[];
};

export default function AddProcessForm({ newProcess, setNewProcess, addProcess, queues }: Props) {
  // Local form state ensures the selected queue value isn't accidentally overwritten by parent updates
  const [name, setName] = useState<string>(newProcess?.name || '');
  const [arrivalTime, setArrivalTime] = useState<string | number>(newProcess?.arrivalTime ?? '');
  const [burstTime, setBurstTime] = useState<string | number>(newProcess?.burstTime ?? '');
  const [priority, setPriority] = useState<number>(newProcess?.priority ?? (queues && queues[0] ? queues[0].priority : 0));

  // Keep local state in sync if parent newProcess changes externally
  useEffect(() => {
    setName(newProcess?.name || '');
    setArrivalTime(newProcess?.arrivalTime ?? '');
    setBurstTime(newProcess?.burstTime ?? '');
    setPriority(typeof newProcess?.priority === 'number' ? newProcess.priority : (queues && queues[0] ? queues[0].priority : 0));
  }, [newProcess, queues]);

  const handleAdd = () => {
    if (!name || arrivalTime === '' || burstTime === '') return;
    const p = { name: name.trim(), arrivalTime: Number(arrivalTime), burstTime: Number(burstTime), priority };
    addProcess(p);
    // update parent newProcess for consistency and reset local fields (keep selected queue)
    setNewProcess({ name: '', arrivalTime: '', burstTime: '', priority });
    setName('');
    setArrivalTime('');
    setBurstTime('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Process</h2>
      <div className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Process Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Arrival Time"
            value={String(arrivalTime)}
            onChange={(e) => setArrivalTime(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Burst Time"
            value={String(burstTime)}
            onChange={(e) => setBurstTime(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <select
            value={String(priority)}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {Array.isArray(queues) && queues.length > 0 ? (
              queues.map((q: any) => (
                <option key={q.priority} value={q.priority}>
                  {q.name}
                </option>
              ))
            ) : (
              <option value="0">Default</option>
            )}
          </select>
        </div>
        <div>
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
          >
            Add Process
          </button>
        </div>
      </div>
    </div>
  );
}
