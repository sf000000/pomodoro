"use client";

import { useCallback, useEffect, useState } from "react";
import { loadSettings, saveSettings } from "@/lib/settings";
import { TimerSettings } from "@/lib/types";
import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { SettingsDialog } from "@/components/pomodoro/settings-dialog";

interface TimerState {
  mode: "pomodoro" | "shortBreak" | "longBreak";
  timeLeft: number;
  isRunning: boolean;
  sessions: number;
}

export function PomodoroLayout({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-full max-w-lg">
      <CardContent className="space-y-8 p-20">{children}</CardContent>
    </Card>
  );
}

interface PomodoroTabsProps {
  mode: TimerState["mode"];
  onModeChange: (mode: TimerState["mode"]) => void;
}

function PomodoroTabs({ mode, onModeChange }: PomodoroTabsProps) {
  return (
    <Tabs value={mode} onValueChange={(value) => onModeChange(value as TimerState["mode"])}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
        <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
        <TabsTrigger value="longBreak">Long Break</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

interface PomodoroDisplayProps {
  time: string;
}

function PomodoroDisplay({ time }: PomodoroDisplayProps) {
  return <div className="text-center text-6xl font-mono">{time}</div>;
}

interface PomodoroControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

function PomodoroControls({
  isRunning,
  onToggle,
  onReset,
  settings,
  onSettingsChange
}: PomodoroControlsProps) {
  return (
    <div className="flex justify-center items-center gap-4">
      <Button variant="ghost" size="icon" onClick={onToggle}>
        {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
      </Button>
      <ThemeToggle />
      <SettingsDialog settings={settings} onSettingsChange={onSettingsChange} />
    </div>
  );
}

export function PomodoroTimer() {
  const [settings, setSettings] = useState<TimerSettings>(() => loadSettings());
  const [state, setState] = useState<TimerState>({
    mode: "pomodoro",
    timeLeft: settings.pomodoro * 60,
    isRunning: false,
    sessions: 0
  });

  const handleSettingsChange = useCallback((newSettings: TimerSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    setState((prev) => ({
      ...prev,
      timeLeft: newSettings[prev.mode] * 60
    }));
  }, []);

  const handleModeChange = useCallback(
    (mode: TimerState["mode"]) => {
      setState((prev) => ({
        ...prev,
        mode,
        timeLeft: settings[mode] * 60,
        isRunning: false
      }));
    },
    [settings]
  );

  const playSound = useCallback(() => {
    const audio = new Audio("/sounds/click.mp3");
    audio.volume = settings.volume;
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }, [settings.volume]);

  const toggleTimer = useCallback(() => {
    playSound();
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, [playSound]);

  const resetTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      timeLeft: settings[prev.mode] * 60,
      isRunning: false
    }));
  }, [settings]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (state.timeLeft === 0) {
      setState((prev) => ({ ...prev, isRunning: false, sessions: prev.sessions + 1 }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning, state.timeLeft]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.code === "Space" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        toggleTimer();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [toggleTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <PomodoroLayout>
      <PomodoroTabs mode={state.mode} onModeChange={handleModeChange} />
      <PomodoroDisplay time={formatTime(state.timeLeft)} />
      <PomodoroControls
        isRunning={state.isRunning}
        onToggle={toggleTimer}
        onReset={resetTimer}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </PomodoroLayout>
  );
}

// no-js fallback
export function PomodoroNoScript() {
  return (
    <noscript>
      <div className="text-center p-4">JavaScript is required for the timer functionality.</div>
    </noscript>
  );
}
