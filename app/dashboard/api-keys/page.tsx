'use client';

import { useEffect, useState } from 'react';
import { getTenantApiKeys } from '@/lib/api';
import type { ApiKeyInfo } from '@/lib/types';
import { Key, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSandbox, setShowSandbox] = useState(false);
  const [showProduction, setShowProduction] = useState(false);

  useEffect(() => {
    getTenantApiKeys()
      .then(setKeys)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const maskKey = (key: string) => {
    if (!key) return '—';
    return key.slice(0, 8) + '•'.repeat(24) + key.slice(-4);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">API Keys</h1>
        <div className="h-48 bg-card border border-border rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!keys) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">API Keys</h1>
        <p className="text-muted-foreground">Unable to load API keys.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">API Keys</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your API access credentials</p>
      </div>

      {/* Mode indicator */}
      <div className="mb-6">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          keys.mode === 'production'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            keys.mode === 'production' ? 'bg-green-500' : 'bg-amber-500'
          }`} />
          {keys.mode === 'production' ? 'Production Mode' : 'Sandbox Mode'}
        </span>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Sandbox Key */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Key className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Sandbox Key</h3>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 text-sm bg-secondary/50 rounded-lg font-mono text-foreground overflow-x-auto">
              {showSandbox ? keys.sandbox_key : maskKey(keys.sandbox_key)}
            </code>
            <button
              onClick={() => setShowSandbox(!showSandbox)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title={showSandbox ? 'Hide' : 'Reveal'}
            >
              {showSandbox ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => copyToClipboard(keys.sandbox_key)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Production Key */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Key className="w-4 h-4 text-green-600" />
            <h3 className="text-sm font-semibold text-foreground">Production Key</h3>
          </div>
          {keys.production_key ? (
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 text-sm bg-secondary/50 rounded-lg font-mono text-foreground overflow-x-auto">
                {showProduction ? keys.production_key : maskKey(keys.production_key)}
              </code>
              <button
                onClick={() => setShowProduction(!showProduction)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                title={showProduction ? 'Hide' : 'Reveal'}
              >
                {showProduction ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => copyToClipboard(keys.production_key)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Production key will be available after your account is activated.
            </p>
          )}
        </div>

        {/* Activation info */}
        {keys.activated_at && (
          <p className="text-sm text-muted-foreground">
            Activated on: {new Date(keys.activated_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
