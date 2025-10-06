import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Clock, Settings, BarChart3 } from 'lucide-react';

const MLQScheduler = () => {
  const [processes, setProcesses] = useState([
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 0, remainingTime: 8, queue: 'System' },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1, remainingTime: 4, queue: 'Interactive' },
    { id: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 2, remainingTime: 9, queue: 'Batch' },
    { id: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 1, remainingTime: 5, queue: 'Interactive' },
  ]);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(null);
  const [completedProcesses, setCompletedProcesses] = useState([]);
  const [ganttChart, setGanttChart] = useState([]);
  
  const queueColors = [
    { color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-500', lightBg: 'bg-rose-50' },
    { color: 'from-cyan-500 to-blue-600', bgColor: 'bg-cyan-500', lightBg: 'bg-cyan-50' },
    { color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-500', lightBg: 'bg-emerald-50' },
    { color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-500', lightBg: 'bg-amber-50' },
    { color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-500', lightBg: 'bg-violet-50' },
    { color: 'from-fuchsia-500 to-pink-600', bgColor: 'bg-fuchsia-500', lightBg: 'bg-fuchsia-50' },
  ];

  const [queues, setQueues] = useState([
    { name: 'System', priority: 0, color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-500', lightBg: 'bg-rose-50', algorithm: 'RR', quantum: 2 },
    { name: 'Interactive', priority: 1, color: 'from-cyan-500 to-blue-600', bgColor: 'bg-cyan-500', lightBg: 'bg-cyan-50', algorithm: 'RR', quantum: 4 },
    { name: 'Batch', priority: 2, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-500', lightBg: 'bg-emerald-50', algorithm: 'FCFS', quantum: null },
  ]);

  const [newQueue, setNewQueue] = useState({
    name: '',
    algorithm: 'RR',
    quantum: 2
  });

  const [newProcess, setNewProcess] = useState({
    name: '',
    arrivalTime: '',
    burstTime: '',
    priority: 0
  });

  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        executeScheduling();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isRunning, currentTime, processes]);

  const executeScheduling = () => {
    const arrived = processes.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);
    
    if (arrived.length === 0) {
      if (processes.some(p => p.remainingTime > 0)) {
        setCurrentTime(prev => prev + 1);
        setCurrentProcess(null);
      } else {
        setIsRunning(false);
      }
      return;
    }

    arrived.sort((a, b) => a.priority - b.priority);
    
    const nextProcess = arrived[0];
    const queue = queues.find(q => q.priority === nextProcess.priority);
    
    setCurrentProcess(nextProcess);
    
    setProcesses(prev => prev.map(p => 
      p.id === nextProcess.id 
        ? { ...p, remainingTime: p.remainingTime - 1 }
        : p
    ));
    
    setGanttChart(prev => [...prev, { 
      processName: nextProcess.name, 
      time: currentTime,
      color: queue.bgColor 
    }]);
    
    if (nextProcess.remainingTime === 1) {
      setCompletedProcesses(prev => [...prev, {
        ...nextProcess,
        completionTime: currentTime + 1,
        turnaroundTime: currentTime + 1 - nextProcess.arrivalTime,
        waitingTime: currentTime + 1 - nextProcess.arrivalTime - nextProcess.burstTime
      }]);
    }
    
    setCurrentTime(prev => prev + 1);
  };

  const updateQuantum = (priority, newQuantum) => {
    setQueues(prev => prev.map(q => 
      q.priority === priority ? { ...q, quantum: parseInt(newQuantum) } : q
    ));
  };

  const addQueue = () => {
    if (newQueue.name.trim() === '') return;
    
    const nextPriority = queues.length;
    const colorIndex = nextPriority % queueColors.length;
    
    const queue = {
      name: newQueue.name,
      priority: nextPriority,
      color: queueColors[colorIndex].color,
      bgColor: queueColors[colorIndex].bgColor,
      lightBg: queueColors[colorIndex].lightBg,
      algorithm: newQueue.algorithm,
      quantum: newQueue.algorithm === 'RR' ? parseInt(newQueue.quantum) : null
    };
    
    setQueues([...queues, queue]);
    setNewQueue({ name: '', algorithm: 'RR', quantum: 2 });
  };

  const deleteQueue = (priority) => {
    if (queues.length <= 1) return;
    
    const updatedQueues = queues
      .filter(q => q.priority !== priority)
      .map((q, index) => ({ ...q, priority: index }));
    
    setQueues(updatedQueues);
    
    setProcesses(prev => prev.filter(p => p.priority !== priority).map(p => ({
      ...p,
      priority: p.priority > priority ? p.priority - 1 : p.priority
    })));
  };

  const addProcess = () => {
    if (newProcess.name && newProcess.arrivalTime !== '' && newProcess.burstTime !== '') {
      const queueName = queues.find(q => q.priority === parseInt(newProcess.priority)).name;
      const process = {
        id: Date.now(),
        name: newProcess.name,
        arrivalTime: parseInt(newProcess.arrivalTime),
        burstTime: parseInt(newProcess.burstTime),
        priority: parseInt(newProcess.priority),
        remainingTime: parseInt(newProcess.burstTime),
        queue: queueName
      };
      setProcesses([...processes, process]);
      setNewProcess({ name: '', arrivalTime: '', burstTime: '', priority: 0 });
    }
  };

  const deleteProcess = (id) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const reset = () => {
    setProcesses(processes.map(p => ({ ...p, remainingTime: p.burstTime })));
    setCurrentTime(0);
    setIsRunning(false);
    setCurrentProcess(null);
    setCompletedProcesses([]);
    setGanttChart([]);
  };

  const getQueueProcesses = (priority) => {
    return processes.filter(p => 
      p.priority === priority && 
      p.arrivalTime <= currentTime && 
      p.remainingTime > 0
    );
  };

  const avgTurnaroundTime = completedProcesses.length > 0
    ? (completedProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0) / completedProcesses.length).toFixed(2)
    : 0;

  const avgWaitingTime = completedProcesses.length > 0
    ? (completedProcesses.reduce((sum, p) => sum + p.waitingTime, 0) / completedProcesses.length).toFixed(2)
    : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">MLQ Scheduler</h1>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500 mb-3">Current Time</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-gray-800 mb-1">{currentTime}</div>
                  <div className="text-xs text-gray-400">Time units elapsed</div>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="text-blue-600" size={32} />
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
                  <div className="text-2xl font-bold text-teal-600">{completedProcesses.length > 0 ? Math.round((completedProcesses.length / processes.length) * 100) : 0}%</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500 mb-3">Controls</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium"
                >
                  {isRunning ? <Pause size={18} /> : <Play size={18} />}
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-2 space-y-6">
              {/* Active Process */}
              {currentProcess && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Currently Executing</h2>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {currentProcess.name}
                    </div>
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

              {/* Add Queue */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Queue</h2>
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Queue Name"
                      value={newQueue.name}
                      onChange={(e) => setNewQueue({...newQueue, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={isRunning}
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={newQueue.algorithm}
                      onChange={(e) => setNewQueue({...newQueue, algorithm: e.target.value})}
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
                        value={newQueue.quantum}
                        onChange={(e) => setNewQueue({...newQueue, quantum: e.target.value})}
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

              {/* Queue List */}
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
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                              P{queue.priority}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {queue.algorithm}{queue.quantum ? ` Q=${queue.quantum}` : ''}
                            </span>
                            {queue.quantum && (
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={queue.quantum}
                                onChange={(e) => updateQuantum(queue.priority, e.target.value)}
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
                                <Trash2 size={16} />
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

              {/* Gantt Chart */}
              {ganttChart.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Execution Timeline</h2>
                  <div className="overflow-x-auto">
                    <div className="flex min-w-max">
                      {ganttChart.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`${item.color} text-white px-4 py-3 min-w-[60px] text-center font-semibold text-sm border-r border-white`}>
                            {item.processName}
                          </div>
                          <div className="text-gray-500 text-xs mt-2">{item.time}</div>
                        </div>
                      ))}
                      <div className="text-gray-500 text-xs mt-12 ml-2">{currentTime}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Add Process */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Process</h2>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Process Name"
                      value={newProcess.name}
                      onChange={(e) => setNewProcess({...newProcess, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Arrival Time"
                      value={newProcess.arrivalTime}
                      onChange={(e) => setNewProcess({...newProcess, arrivalTime: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Burst Time"
                      value={newProcess.burstTime}
                      onChange={(e) => setNewProcess({...newProcess, burstTime: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <select
                      value={newProcess.priority}
                      onChange={(e) => setNewProcess({...newProcess, priority: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {queues.map(q => (
                        <option key={q.priority} value={q.priority}>{q.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <button
                      onClick={addProcess}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
                    >
                      <Plus size={18} />
                      Add Process
                    </button>
                  </div>
                </div>
              </div>

              {/* Process List */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">All Processes</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {processes.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">
                          {p.name}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.queue}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${p.remainingTime === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                          {p.remainingTime}/{p.burstTime}
                        </span>
                        <button
                          onClick={() => deleteProcess(p.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
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
};

export default MLQScheduler;