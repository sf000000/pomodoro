import { Suspense } from "react";
import dynamic from "next/dynamic";

const PomodoroTimer = dynamic(
  () => import("@/components/pomodoro/pomodoro-client").then((mod) => mod.PomodoroTimer),
  {
    loading: () => <div>Loading...</div>,
    ssr: false
  }
);

// todo: use skeleton

export const metadata = {
  title: "Pomodoro Timer",
  description: "A simple and effective Pomodoro timer to boost your productivity"
};

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <PomodoroTimer />
      </Suspense>
    </div>
  );
}
