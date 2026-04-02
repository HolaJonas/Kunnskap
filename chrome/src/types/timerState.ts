export type TimerState = {
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  endTimeMs: number | null;
};
