'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginTenant } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import Link from 'next/link';

const loginSchema = Yup.object({
  email: Yup.string().trim().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const res = await loginTenant(values.email.trim().toLowerCase(), values.password);
        setAuth({
          user: res.user,
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
        });
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid email or password.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">KO</span>
            </div>
            <span className="font-semibold text-lg text-foreground">KECE Oil</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your dashboard</p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps('email')}
                placeholder="you@company.com"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-destructive">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...formik.getFieldProps('password')}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs text-destructive">{formik.errors.password}</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 duration-100"
            >
              {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Start free trial
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
