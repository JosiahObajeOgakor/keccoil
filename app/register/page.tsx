'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerTenant } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  business_name: z.string().trim().min(2, 'Business name must be at least 2 characters'),
  business_phone: z.string().trim().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      business_name: '',
      business_phone: '',
    },
  });

  const onSubmit = async (values: RegisterForm) => {
    setError('');
    try {
      const res = await registerTenant({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        business_name: values.business_name.trim(),
        business_phone: values.business_phone?.trim() || undefined,
      });
      setAuth({
        user: res.user,
        tenant: res.tenant,
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">KO</span>
            </div>
            <span className="font-semibold text-lg text-foreground">KECE Oil</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground">
            Start your 3-day free trial. No credit card required.
          </p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@company.com"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
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
                {...register('password')}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Business Name */}
            <div>
              <label htmlFor="business_name" className="block text-sm font-semibold text-foreground mb-1.5">
                Business Name
              </label>
              <input
                id="business_name"
                type="text"
                {...register('business_name')}
                placeholder="Your Company Ltd"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              {errors.business_name && (
                <p className="mt-1 text-xs text-destructive">{errors.business_name.message}</p>
              )}
            </div>

            {/* Business Phone (optional) */}
            <div>
              <label htmlFor="business_phone" className="block text-sm font-semibold text-foreground mb-1.5">
                Business Phone <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                id="business_phone"
                type="tel"
                {...register('business_phone')}
                placeholder="+234 800 000 0000"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
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
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 duration-100"
            >
              {isSubmitting ? 'Creating account...' : 'Start Free Trial'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
