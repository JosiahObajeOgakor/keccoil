'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerTenant } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import Link from 'next/link';

const registerSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().trim().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  business_name: Yup.string().trim().min(2, 'Business name must be at least 2 characters').required('Business name is required'),
  business_phone: Yup.string().trim(),
});

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      business_name: '',
      business_phone: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
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
      } finally {
        setSubmitting(false);
      }
    },
  });

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
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...formik.getFieldProps('name')}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-xs text-destructive">{formik.errors.name}</p>
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
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs text-destructive">{formik.errors.password}</p>
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
                {...formik.getFieldProps('business_name')}
                placeholder="Your Company Ltd"
                className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              {formik.touched.business_name && formik.errors.business_name && (
                <p className="mt-1 text-xs text-destructive">{formik.errors.business_name}</p>
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
                {...formik.getFieldProps('business_phone')}
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
              disabled={formik.isSubmitting}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 duration-100"
            >
              {formik.isSubmitting ? 'Creating account...' : 'Start Free Trial'}
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
