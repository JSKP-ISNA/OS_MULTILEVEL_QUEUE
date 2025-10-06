export type Process = {
  id: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime: number;
  queue?: string;
};

export type Queue = {
  name: string;
  priority: number;
  color: string;
  bgColor: string;
  lightBg: string;
  algorithm: 'RR' | 'FCFS';
  quantum: number | null;
};

export type GanttItem = {
  processName: string;
  time: number;
  color: string;
};
