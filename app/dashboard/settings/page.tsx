'use client';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getTenantSettings, updateTenantSettings } from '@/lib/api';
import type { TenantSettings } from '@/lib/types';
import { toast } from 'sonner';
import { Settings, Save, Lock } from 'lucide-react';

const settingsSchema = Yup.object({
  business_name: Yup.string().trim().min(2, 'Min 2 characters').required('Required'),
  phone: Yup.string().trim(),
});

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<TenantSettings | null>(null);

  const formik = useFormik({
    initialValues: {
      business_name: '',
      phone: '',
    },
    validationSchema: settingsSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await updateTenantSettings({
          business_name: values.business_name.trim(),
          phone: values.phone.trim(),
        });
        toast.success('Settings saved successfully');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to save settings');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    getTenantSettings()
      .then((data) => {
        setInitialData(data);
        formik.setValues({
          business_name: data.business_name || '',
          phone: data.phone || '',
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
        <div className="h-64 bg-card border border-border rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your business configuration</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="max-w-2xl space-y-8">
        {/* Business Info */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Business Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Business Name</label>
              <input
                {...formik.getFieldProps('business_name')}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {formik.touched.business_name && formik.errors.business_name && (
                <p className="mt-1 text-xs text-destructive">{formik.errors.business_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
              <input
                {...formik.getFieldProps('phone')}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        {/* AI Configuration (read-only) */}
        <div className="bg-card border border-border rounded-xl p-6 opacity-90">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">AI Configuration</h2>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
              <Lock className="w-3 h-3" />
              Managed by platform
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              System Prompt
            </label>
            <div className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-muted/50 min-h-[150px] whitespace-pre-wrap text-muted-foreground">
              {initialData?.ai_system_prompt || <span className="italic">No system prompt configured</span>}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              This prompt guides the AI when responding to your customers via WhatsApp. Contact support to request changes.
            </p>
          </div>
        </div>

        {/* WhatsApp Config (read-only) */}
        {initialData && (initialData.whatsapp_phone_id || initialData.whatsapp_token) && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">WhatsApp Configuration</h2>
            <p className="text-sm text-muted-foreground mb-4">
              WhatsApp settings are managed by the platform admin. Contact support to make changes.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Phone ID:</span>
                <span className="font-mono text-foreground">{initialData.whatsapp_phone_id || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Token:</span>
                <span className="font-mono text-foreground">{'•'.repeat(12)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Save */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {formik.isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
