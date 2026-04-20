'use client';

import type { ActivityLogEntry } from '@/lib/mockData';
import { Bot, Shield, Cpu } from 'lucide-react';

interface ActivityLogProps {
  entries: ActivityLogEntry[];
}

const actorConfig = {
  admin: { label: 'Admin', icon: Shield, color: 'bg-primary' },
  system: { label: 'System', icon: Cpu, color: 'bg-blue-500' },
  ai: { label: 'AI Bot', icon: Bot, color: 'bg-purple-500' },
};

export function ActivityLog({ entries }: ActivityLogProps) {
  if (entries.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        No activity recorded
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-6">
          {entries.map((entry) => {
            const config = actorConfig[entry.actor];
            const Icon = config.icon;

            return (
              <div key={entry.id} className="relative flex gap-4 pl-2">
                {/* Dot */}
                <div
                  className={`relative z-10 flex-shrink-0 w-5 h-5 rounded-full ${config.color} flex items-center justify-center`}
                >
                  <Icon className="w-3 h-3 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 -mt-0.5">
                  <p className="text-sm text-foreground">{entry.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground font-medium">
                      {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
