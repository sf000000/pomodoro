"use server";

import { TimerSettings } from "@/lib/types";
import { cookies } from "next/headers";

export const defaultSettings: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  volume: 0.5
};

export async function saveSettings(settings: TimerSettings) {
  cookies().set("pomodoro-settings", JSON.stringify(settings));
}

export async function loadSettings(): Promise<TimerSettings> {
  const settings = cookies().get("pomodoro-settings");
  return settings ? JSON.parse(settings.value) : defaultSettings;
}
