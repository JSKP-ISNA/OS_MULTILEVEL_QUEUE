import React, { useState } from 'react';
import { useScheduler } from '../hooks';
import DashboardCards from './DashboardCards';
import AddQueueForm from './AddQueueForm';
import QueueList from './QueueList';
import AddProcessForm from './AddProcessForm';
import ProcessList from './ProcessList';
import GanttChart from './GanttChart';

export default function MLQScheduler() {
  const {
    processes,
    queues,
    currentTime,
    isRunning,
    currentProcess,
    completedProcesses,
    ganttChart,
    avgTurnaroundTime,
    avgWaitingTime,
    setIsRunning,
    addQueue,
    deleteQueue,
    updateQuantum,
    addProcess,
    deleteProcess,
    reset,
    getQueueProcesses
  } = useScheduler([
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 0, remainingTime: 8, queue: 'System' },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1, remainingTime: 4, queue: 'Interactive' },
    { id: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 2, remainingTime: 9, queue: 'Batch' },
    { id: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 1, remainingTime: 5, queue: 'Interactive' },
  ]);

  const [newQueue, setNewQueue] = useState({ name: '', algorithm: 'RR', quantum: 2 });
  const [newProcess, setNewProcess] = useState({ name: '', arrivalTime: '', burstTime: '', priority: 0 });

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">MLQ Scheduler</h1>
          </div>

          <DashboardCards currentTime={currentTime} avgTurnaroundTime={avgTurnaroundTime} completedCount={completedProcesses.length} totalCount={processes.length} isRunning={isRunning} onToggleRun={() => setIsRunning(!isRunning)} onReset={reset} />

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              {currentProcess && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Currently Executing</h2>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">{currentProcess.name}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{currentProcess.name}</div>
                      <div className="text-sm text-gray-500">{currentProcess.queue} Queue</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Remaining</div>
                      <div className="text-xl font-bold text-blue-600">{currentProcess.remainingTime}/{currentProcess.burstTime}</div>
                    </div>
                  </div>
                </div>
              )}

              <AddQueueForm newQueue={newQueue} setNewQueue={setNewQueue} addQueue={() => addQueue(newQueue as any)} isRunning={isRunning} />

              <QueueList queues={queues} getQueueProcesses={getQueueProcesses} deleteQueue={deleteQueue} isRunning={isRunning} currentProcess={currentProcess} />

              <GanttChart ganttChart={ganttChart} currentTime={currentTime} />
            </div>

            <div className="space-y-6">
              <AddProcessForm newProcess={newProcess} setNewProcess={setNewProcess} addProcess={(p: any) => addProcess(p)} queues={queues} />

              <ProcessList processes={processes} deleteProcess={deleteProcess} />

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Avg Waiting Time</div>
                    <div className="text-2xl font-bold text-gray-800">{avgWaitingTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Completed</div>
                    <div className="text-2xl font-bold text-gray-800">{completedProcesses.length}/{processes.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
