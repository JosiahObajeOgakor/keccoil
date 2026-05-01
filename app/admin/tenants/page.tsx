'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/utils/auth';
import { adminGetTenants, adminCreateTenant, adminDeleteTenant } from '@/lib/api';
import type { AdminTenantListItem, CreateTenantRequest } from '@/lib/types';
import { Plus, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTenantsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<AdminTenantListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateTenantRequest>({
    business_name: '',
    whatsapp_phone_id: '',
    whatsapp_token: '',
    ai_system_prompt: '',
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchTenants();
  }, [router]);

  const fetchTenants = async () => {
    try {
      const data = await adminGetTenants();
      setTenants(data);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.business_name.trim()) {
      toast.error('Business name is required');
      return;
    }
    try {
      await adminCreateTenant(formData);
      toast.success('Tenant created');
      setCreateOpen(false);
      setFormData({ business_name: '', whatsapp_phone_id: '', whatsapp_token: '', ai_system_prompt: '' });
      fetchTenants();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create tenant');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminDeleteTenant(id);
      toast.success('Tenant deleted');
      setTenants(tenants.filter((t) => t.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete tenant');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tenants</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage platform tenants</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Tenant
        </button>
      </div>

      {/* Tenants Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : tenants.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No tenants found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">#{tenant.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{tenant.business_name}</td>
                    <td className="px-6 py-4 text-sm capitalize text-muted-foreground">{tenant.plan_tier}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        tenant.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/tenants/${tenant.id}`)}
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(tenant.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Tenant</h3>
            <p className="text-sm text-muted-foreground mb-6">This will permanently delete the tenant and all their data.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Create Tenant</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Business Name *</label>
                <input
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">WhatsApp Phone ID</label>
                <input
                  value={formData.whatsapp_phone_id}
                  onChange={(e) => setFormData({ ...formData, whatsapp_phone_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">WhatsApp Token</label>
                <input
                  value={formData.whatsapp_token}
                  onChange={(e) => setFormData({ ...formData, whatsapp_token: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">AI System Prompt</label>
                <textarea
                  value={formData.ai_system_prompt}
                  onChange={(e) => setFormData({ ...formData, ai_system_prompt: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setCreateOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
