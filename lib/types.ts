export interface Task {
  id: number;
  text: string;
}

export type TimerMode = "work" | "break";

export interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  volume: number;
}
