
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Clock, Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Progress } from "./ui/progress";
import { toast } from "./ui/sonner";
import { FocusSession, TodoItem } from "@/types/todo";
import { Slider } from "./ui/slider";

interface FocusModeProps {
  task: TodoItem;
  onClose: () => void;
  onComplete: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ task, onClose, onComplete }) => {
  // Default durations in minutes (converted to seconds for internal use)
  const DEFAULT_FOCUS_TIME = 25 * 60; // 25 minutes in seconds
  const DEFAULT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
  
  const [session, setSession] = useState<FocusSession>({
    active: false,
    taskId: task.id,
    mode: "focus",
    duration: DEFAULT_FOCUS_TIME,
    timeLeft: DEFAULT_FOCUS_TIME,
    focusDuration: 25, // Default focus duration in minutes
    breakDuration: 5,  // Default break duration in minutes
  });
  
  const [isPaused, setIsPaused] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Apply timer settings when they change
  const applyTimerSettings = () => {
    const newDuration = session.mode === "focus" 
      ? (session.focusDuration || 25) * 60 
      : (session.breakDuration || 5) * 60;
    
    setSession(prev => ({
      ...prev,
      duration: newDuration,
      timeLeft: newDuration
    }));
    
    setIsPaused(true);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Clear interval when component unmounts
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSession((prev) => {
        if (prev.timeLeft <= 1) {
          // Timer finished
          window.clearInterval(intervalRef.current as number);
          
          const nextMode = prev.mode === "focus" ? "break" : "focus";
          const nextDuration = nextMode === "focus" 
            ? (prev.focusDuration || 25) * 60
            : (prev.breakDuration || 5) * 60;
          
          // Play sound and show notification
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
          audio.play();
          
          toast(
            nextMode === "focus" 
              ? "Break time is over! Ready to focus again?" 
              : "Focus session complete! Time for a break.",
            {
              description: nextMode === "focus" 
                ? "Starting next focus session." 
                : "Take a short break to recharge.",
              action: {
                label: "Close",
                onClick: () => {},
              },
            }
          );
          
          setIsPaused(true);
          
          return {
            ...prev,
            mode: nextMode,
            duration: nextDuration,
            timeLeft: nextDuration,
          };
        }
        
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsPaused(true);
    setSession((prev) => ({
      ...prev,
      timeLeft: prev.mode === "focus" 
        ? (prev.focusDuration || 25) * 60 
        : (prev.breakDuration || 5) * 60,
    }));
  };

  const updateFocusDuration = (value: number[]) => {
    const newValue = value[0];
    setSession(prev => ({
      ...prev,
      focusDuration: newValue
    }));
    if (session.mode === "focus" && isPaused) {
      setSession(prev => ({
        ...prev,
        duration: newValue * 60,
        timeLeft: newValue * 60
      }));
    }
  };

  const updateBreakDuration = (value: number[]) => {
    const newValue = value[0];
    setSession(prev => ({
      ...prev,
      breakDuration: newValue
    }));
    if (session.mode === "break" && isPaused) {
      setSession(prev => ({
        ...prev,
        duration: newValue * 60,
        timeLeft: newValue * 60
      }));
    }
  };

  const progress = Math.round((session.timeLeft / session.duration) * 100);

  return (
    <div className="focus-mode-container p-6 rounded-xl bg-white dark:bg-slate-900 shadow-lg relative overflow-hidden">
      <div className="floating-items">
        <Clock className="floating-item text-indigo-300 absolute -top-6 -left-6 opacity-10 h-24 w-24" />
        <div className="floating-item pencil absolute top-10 -right-6 opacity-10 h-20 w-20 rotate-45">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2L22 6M18 2L12 8M22 6L16 12L18 2ZM12 8L8 4L4 8L8 12L12 8ZM8 12L16 20L20 16L12 8Z" 
                  stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div className="z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            {session.mode === "focus" ? "Focus Time" : "Break Time"}
          </h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1"
            >
              <Timer className="h-4 w-4" />
              {showSettings ? "Hide" : "Settings"}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-500">
              Exit
            </Button>
          </div>
        </div>
        
        {showSettings && (
          <div className="settings-panel mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
            <h4 className="text-sm font-medium mb-3 text-slate-600 dark:text-slate-300">Timer Settings</h4>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Focus Duration: {session.focusDuration} mins</span>
              </div>
              <Slider
                value={[session.focusDuration || 25]}
                min={5}
                max={60}
                step={5}
                onValueChange={updateFocusDuration}
                className="mb-6"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Break Duration: {session.breakDuration} mins</span>
              </div>
              <Slider
                value={[session.breakDuration || 5]}
                min={1}
                max={15}
                step={1}
                onValueChange={updateBreakDuration}
                className="mb-2"
              />
            </div>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={applyTimerSettings}
              className="mt-2 w-full"
            >
              Apply Settings
            </Button>
          </div>
        )}
        
        <div className="task-card p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-900/30 mb-6">
          <h4 className="font-medium mb-1">Currently focusing on:</h4>
          <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">{task.text}</p>
        </div>
        
        <div className="timer-display mb-6">
          <div className="text-center mb-4">
            <span className="text-4xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {formatTime(session.timeLeft)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={handleStartPause}
            className="timer-btn px-6"
            variant="outline"
            size="lg"
          >
            {isPaused ? (
              <>
                <Play className="mr-2 h-4 w-4" /> Start
              </>
            ) : (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </>
            )}
          </Button>
          
          <Button
            onClick={handleReset}
            className="timer-btn"
            variant="ghost"
            size="lg"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        
        {session.mode === "focus" && (
          <Button
            onClick={onComplete}
            className="w-full bg-green-600 hover:bg-green-700"
            variant="default"
          >
            Mark Task Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default FocusMode;
