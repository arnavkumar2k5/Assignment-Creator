'use client';
import { Assignment } from '@/types';
import { Loader2, Zap, Database, Brain, CheckCircle } from 'lucide-react';

const steps = [
  { icon: <Database size={16} />, label: 'Stored in database', done: true },
  { icon: <Zap size={16} />, label: 'Queued for processing', done: true },
  { icon: <Brain size={16} />, label: 'AI generating questions', active: true },
  { icon: <CheckCircle size={16} />, label: 'Saving results', done: false },
];

interface Props {
  assignment: Assignment;
}

export default function ProcessingState({ assignment }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      {/* Animated orb */}
      <div className="relative mb-10">
        <div className="absolute inset-0 rounded-full bg-accent/20 pulse-ring scale-75" />
        <div className="absolute inset-0 rounded-full bg-accent/10 pulse-ring scale-75" style={{ animationDelay: '0.5s' }} />
        <div className="w-24 h-24 rounded-full bg-ink flex items-center justify-center relative z-10">
          <Brain size={36} className="text-accent animate-pulse-slow" />
        </div>
      </div>

      <div className="mb-2 text-accent text-xs font-mono tracking-widest uppercase">
        AI is working
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">
        Generating Your Paper
      </h2>
      <p className="text-ink/50 text-base mb-2 font-sans max-w-md">
        <strong className="text-ink">{assignment.title}</strong>
      </p>
      <p className="text-ink/40 text-sm font-sans mb-10">
        This usually takes 10–30 seconds. This page will update automatically.
      </p>

      {/* Progress steps */}
      <div className="bg-white rounded-2xl border border-ink/8 p-6 w-full max-w-sm shadow-sm">
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                step.done ? 'bg-emerald-100 text-emerald-600' :
                step.active ? 'bg-accent/20 text-accent' : 'bg-ink/5 text-ink/30'
              }`}>
                {step.active ? <Loader2 size={16} className="animate-spin" /> : step.icon}
              </div>
              <span className={`text-sm font-sans ${
                step.done ? 'text-ink/70 line-through decoration-ink/30' :
                step.active ? 'text-ink font-semibold' : 'text-ink/30'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-ink/30 font-mono">
        Connected via WebSocket · Live updates enabled
      </p>
    </div>
  );
}
