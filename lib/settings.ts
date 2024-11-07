import { TimerSettings } from "@/lib/types";

const STORAGE_KEY = "pomodoroSettings";

const DEFAULT_SETTINGS: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  volume: 0.5
};

export function loadSettings(): TimerSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_SETTINGS;

  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: TimerSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
