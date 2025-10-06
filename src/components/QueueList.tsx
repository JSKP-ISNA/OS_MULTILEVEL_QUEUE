import React from 'react';
import { Queue, Process } from '../types';

type Props = {
  queues: Queue[];
  getQueueProcesses: (priority: number) => Process[];
  deleteQueue: (priority: number) => void;
  isRunning: boolean;
  currentProcess: Process | null;
};

export default function QueueList({ queues, getQueueProcesses, deleteQueue, isRunning, currentProcess }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Queue Status</h2>
      <div className="space-y-4">
        {queues.map(queue => {
          const queueProcesses = getQueueProcesses(queue.priority);
          return (
            <div key={queue.priority} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${queue.color}`}></div>
                  <span className="font-semibold text-gray-800">{queue.name}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">P{queue.priority}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{queue.algorithm}{queue.quantum ? ` Q=${queue.quantum}` : ''}</span>
                  {queue.quantum && (
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={String(queue.quantum)}
                      onChange={(e) => { /* let parent handle update via prop */ }}
                      className="w-14 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isRunning}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{queueProcesses.length} process{queueProcesses.length !== 1 ? 'es' : ''}</span>
                  {queues.length > 1 && (
                    <button
                      onClick={() => deleteQueue(queue.priority)}
                      disabled={isRunning}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap min-h-[50px]">
                {queueProcesses.length === 0 ? (
                  <div className="text-gray-400 text-sm italic">Empty queue</div>
                ) : (
                  queueProcesses.map(process => (
                    <div
                      key={process.id}
                      className={`px-3 py-2 ${queue.lightBg} border-2 ${currentProcess?.id === process.id ? 'border-blue-500' : 'border-transparent'} rounded-lg transition-all`}
                    >
                      <div className="font-semibold text-gray-800 text-sm">{process.name}</div>
                      <div className="text-xs text-gray-500">{process.remainingTime}/{process.burstTime}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
