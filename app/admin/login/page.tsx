'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateAdminPassword, setAdminSession } from '@/lib/utils/auth';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!adminName.trim()) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    if (validateAdminPassword(password)) {
      setAdminSession(adminName);
      router.push('/admin/dashboard');
    } else {
      setError('Invalid password. Try: admin123');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">CF</span>
            </div>
            <span className="font-semibold text-lg text-foreground hidden sm:inline">
              ClearFlow
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Login</h1>
          <p className="text-muted-foreground">
            Access the dashboard to manage your products
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Admin Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                Admin Name
              </label>
              <input
                id="name"
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Demo password: <code className="bg-secondary px-2 py-1 rounded">admin123</code>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 duration-100"
            >
              {isLoading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Not an admin?{' '}
              <Link href="/" className="text-primary hover:underline font-medium">
                Go to homepage
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">🔒 Secure:</span> This login is for demonstration purposes. In production, use proper authentication with encrypted credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
