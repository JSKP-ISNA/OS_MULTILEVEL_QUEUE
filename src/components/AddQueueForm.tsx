import React from 'react';

type Props = {
  newQueue: { name: string; algorithm: string; quantum: number | null };
  setNewQueue: any;
  addQueue: () => void;
  isRunning: boolean;
};

export default function AddQueueForm({ newQueue, setNewQueue, addQueue, isRunning }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Queue</h2>
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-5">
          <input
            type="text"
            placeholder="Queue Name"
            value={newQueue.name}
            onChange={(e) => setNewQueue({ ...newQueue, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isRunning}
          />
        </div>
        <div className="col-span-3">
          <select
            value={newQueue.algorithm}
            onChange={(e) => setNewQueue({ ...newQueue, algorithm: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isRunning}
          >
            <option value="RR">Round Robin</option>
            <option value="FCFS">FCFS</option>
          </select>
        </div>
        <div className="col-span-2">
          {newQueue.algorithm === 'RR' && (
            <input
              type="number"
              placeholder="Quantum"
              min="1"
              max="10"
              value={String(newQueue.quantum)}
              onChange={(e) => setNewQueue({ ...newQueue, quantum: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isRunning}
            />
          )}
        </div>
        <div className="col-span-2">
          <button
            onClick={addQueue}
            disabled={isRunning || !newQueue.name.trim()}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
          >
            Add Queue
          </button>
        </div>
      </div>
    </div>
  );
}
