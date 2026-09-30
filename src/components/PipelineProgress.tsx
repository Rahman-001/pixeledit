'use client';

import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PIPELINE_STEPS } from '@/lib/transformations';

interface PipelineProgressProps {
  currentStep: number; // 0 = not started, 1-5 = step in progress, 6 = done
  timing?: Record<number, number>; // step id -> ms taken
}

export default function PipelineProgress({ currentStep, timing = {} }: PipelineProgressProps) {
  if (currentStep === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
      <p className="text-xs font-medium text-muted uppercase tracking-wider">
        AI Pipeline
      </p>

      <div className="space-y-2">
        {PIPELINE_STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;

          return (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300',
                isActive && 'bg-blue-light border border-blue/20',
                isDone && 'bg-green-light',
                isPending && 'opacity-40'
              )}
            >
              {/* Step icon */}
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-green" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-blue animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-subtle" />
                )}
              </div>

              {/* Step number + label */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      isActive && 'text-blue',
                      isDone && 'text-green',
                      isPending && 'text-muted'
                    )}
                  >
                    {step.id}. {step.label}
                  </span>
                  {isDone && timing[step.id] && (
                    <span className="text-xs text-muted font-mono">
                      {(timing[step.id] / 1000).toFixed(1)}s
                    </span>
                  )}
                  {isActive && (
                    <span className="text-xs text-blue animate-pulse-soft">
                      Running...
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted truncate">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall completion */}
      {currentStep > 5 && (
        <div className="flex items-center gap-2 pt-1">
          <CheckCircle2 className="w-4 h-4 text-green" />
          <span className="text-xs font-medium text-green">
            Complete · All variants ready
          </span>
        </div>
      )}
    </div>
  );
}
