import { useState, useEffect } from 'react';
import { Process, Queue, GanttItem } from '../types';
import { QUEUE_COLORS } from '../constants/queueColors';

export function useScheduler(initialProcesses: Process[] = []) {
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentProcess, setCurrentProcess] = useState<Process | null>(null);
  const [completedProcesses, setCompletedProcesses] = useState<Process[]>([]);
  const [ganttChart, setGanttChart] = useState<GanttItem[]>([]);
  const [queues, setQueues] = useState<Queue[]>([
    { name: 'System', priority: 0, color: QUEUE_COLORS[0].color, bgColor: QUEUE_COLORS[0].bgColor, lightBg: QUEUE_COLORS[0].lightBg, algorithm: 'RR', quantum: 2 },
    { name: 'Interactive', priority: 1, color: QUEUE_COLORS[1].color, bgColor: QUEUE_COLORS[1].bgColor, lightBg: QUEUE_COLORS[1].lightBg, algorithm: 'RR', quantum: 4 },
    { name: 'Batch', priority: 2, color: QUEUE_COLORS[2].color, bgColor: QUEUE_COLORS[2].bgColor, lightBg: QUEUE_COLORS[2].lightBg, algorithm: 'FCFS', quantum: null },
  ]);

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
    const queue = queues.find(q => q.priority === nextProcess.priority)!;

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
      } as any]);
    }

    setCurrentTime(prev => prev + 1);
  };

  const updateQuantum = (priority: number, newQuantum: number) => {
    setQueues(prev => prev.map(q =>
      q.priority === priority ? { ...q, quantum: parseInt(String(newQuantum)) } : q
    ));
  };

  const addQueue = (newQueue: { name: string; algorithm: 'RR' | 'FCFS'; quantum: number | null }) => {
    if (newQueue.name.trim() === '') return;
    const nextPriority = queues.length;
    const colorIndex = nextPriority % QUEUE_COLORS.length;
    const queue: Queue = {
      name: newQueue.name,
      priority: nextPriority,
      color: QUEUE_COLORS[colorIndex].color,
      bgColor: QUEUE_COLORS[colorIndex].bgColor,
      lightBg: QUEUE_COLORS[colorIndex].lightBg,
      algorithm: newQueue.algorithm,
      quantum: newQueue.algorithm === 'RR' ? parseInt(String(newQueue.quantum)) : null
    };
    setQueues([...queues, queue]);
  };

  const deleteQueue = (priority: number) => {
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

  const addProcess = (newProcess: { name: string; arrivalTime: number; burstTime: number; priority: number }) => {
    const queueName = queues.find(q => q.priority === newProcess.priority)!.name;
    const process: Process = {
      id: Date.now(),
      name: newProcess.name,
      arrivalTime: newProcess.arrivalTime,
      burstTime: newProcess.burstTime,
      priority: newProcess.priority,
      remainingTime: newProcess.burstTime,
      queue: queueName
    };
    setProcesses(prev => [...prev, process]);
  };

  const deleteProcess = (id: number) => setProcesses(prev => prev.filter(p => p.id !== id));

  const reset = () => {
    setProcesses(prev => prev.map(p => ({ ...p, remainingTime: p.burstTime })));
    setCurrentTime(0);
    setIsRunning(false);
    setCurrentProcess(null);
    setCompletedProcesses([]);
    setGanttChart([]);
  };

  const getQueueProcesses = (priority: number) => {
    return processes.filter(p =>
      p.priority === priority &&
      p.arrivalTime <= currentTime &&
      p.remainingTime > 0
    );
  };

  const avgTurnaroundTime = completedProcesses.length > 0
    ? (completedProcesses.reduce((sum: any, p: any) => sum + p.turnaroundTime, 0) / completedProcesses.length).toFixed(2)
    : '0';

  const avgWaitingTime = completedProcesses.length > 0
    ? (completedProcesses.reduce((sum: any, p: any) => sum + p.waitingTime, 0) / completedProcesses.length).toFixed(2)
    : '0';

  return {
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
    getQueueProcesses,
    setProcesses,
    setQueues
  };
}
