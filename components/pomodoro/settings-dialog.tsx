"use client";

import { useState } from "react";
import { TimerSettings } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { SettingsGearIcon } from "@/components/icons/settings-gear-icon";

import { Separator } from "../ui/separator";
import { ThemeSelector } from "../ui/theme-selector";

interface SettingsDialogProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

export function SettingsDialog({ settings, onSettingsChange }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsGearIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pomodoro Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pomodoro" className="text-right">
              Pomodoro
            </Label>
            <Input
              id="pomodoro"
              type="number"
              className="col-span-3"
              value={localSettings.pomodoro}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  pomodoro: Number(e.target.value)
                }))
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shortBreak" className="text-right">
              Short Break
            </Label>
            <Input
              id="shortBreak"
              type="number"
              className="col-span-3"
              value={localSettings.shortBreak}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  shortBreak: Number(e.target.value)
                }))
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longBreak" className="text-right">
              Long Break
            </Label>
            <Input
              id="longBreak"
              type="number"
              className="col-span-3"
              value={localSettings.longBreak}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  longBreak: Number(e.target.value)
                }))
              }
            />
          </div>
          <ThemeSelector />
          <Separator />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="volume" className="text-right">
              Volume
            </Label>
            <div className="col-span-3">
              <Slider
                id="volume"
                min={0}
                max={1}
                step={0.1}
                value={[localSettings.volume]}
                onValueChange={([value]) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    volume: value
                  }))
                }
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
