'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/utils/auth';
import {
  adminGetTenants, adminCreateTenant, adminDeleteTenant,
  adminGetTenant, adminUpdateTenant, adminGetTenantUsers,
  adminCreateTenantUser, adminDeleteTenantUser,
  adminGetTenantUsage, adminChangePlan,
  adminSuspendSubscription, adminReactivateSubscription,
} from '@/lib/api';
import type { AdminTenantListItem, CreateTenantRequest, Tenant, TenantUser, BillingUsage, CreateTenantUserRequest } from '@/lib/types';
import { Plus, Trash2, Eye, ArrowLeft, Users } from 'lucide-react';
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

  // Detail view state
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [usage, setUsage] = useState<BillingUsage | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ business_name: '', ai_system_prompt: '' });
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<CreateTenantUserRequest>({ email: '', password: '', name: '', role: 'staff' });

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
      if (selectedTenantId === id) setSelectedTenantId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete tenant');
    }
  };

  const openDetail = async (id: number) => {
    setSelectedTenantId(id);
    setDetailLoading(true);
    setEditMode(false);
    try {
      const [t, u, us] = await Promise.all([
        adminGetTenant(id),
        adminGetTenantUsers(id),
        adminGetTenantUsage(id),
      ]);
      setTenant(t);
      setUsers(u);
      setUsage(us);
      setEditData({ business_name: t.business_name, ai_system_prompt: t.ai_system_prompt || '' });
    } catch {
      toast.error('Failed to load tenant');
      setSelectedTenantId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSaveTenant = async () => {
    if (!selectedTenantId) return;
    try {
      const updated = await adminUpdateTenant(selectedTenantId, editData);
      setTenant(updated);
      setEditMode(false);
      toast.success('Tenant updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const handleChangePlan = async (tier: string) => {
    if (!selectedTenantId) return;
    try {
      await adminChangePlan(selectedTenantId, tier);
      toast.success(`Plan changed to ${tier}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change plan');
    }
  };

  const handleSuspend = async () => {
    if (!selectedTenantId) return;
    try {
      await adminSuspendSubscription(selectedTenantId);
      toast.success('Subscription suspended');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to suspend');
    }
  };

  const handleReactivate = async () => {
    if (!selectedTenantId) return;
    try {
      await adminReactivateSubscription(selectedTenantId);
      toast.success('Subscription reactivated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reactivate');
    }
  };

  const handleAddUser = async () => {
    if (!selectedTenantId || !newUser.email || !newUser.password || !newUser.name) {
      toast.error('All fields required');
      return;
    }
    try {
      const user = await adminCreateTenantUser(selectedTenantId, newUser);
      setUsers([...users, user]);
      setAddUserOpen(false);
      setNewUser({ email: '', password: '', name: '', role: 'staff' });
      toast.success('User added');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!selectedTenantId) return;
    try {
      await adminDeleteTenantUser(selectedTenantId, userId);
      setUsers(users.filter((u) => u.id !== userId));
      toast.success('User removed');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove user');
    }
  };

  // If detail view is open, show it
  if (selectedTenantId !== null) {
    if (detailLoading) {
      return (
        <div>
          <button onClick={() => setSelectedTenantId(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to tenants
          </button>
          <div className="h-48 bg-card border border-border rounded-xl animate-pulse" />
        </div>
      );
    }
    if (!tenant) {
      return <p className="text-muted-foreground">Tenant not found.</p>;
    }
    return (
      <div>
        <button onClick={() => setSelectedTenantId(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to tenants
        </button>

        {/* Tenant Info */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">{tenant.business_name}</h2>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              tenant.status === 'active'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            }`}>{tenant.status}</span>
          </div>
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Business Name</label>
                <input value={editData.business_name} onChange={(e) => setEditData({ ...editData, business_name: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">AI Prompt</label>
                <textarea value={editData.ai_system_prompt} onChange={(e) => setEditData({ ...editData, ai_system_prompt: e.target.value })} rows={4} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveTenant} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Save</button>
                <button onClick={() => setEditMode(false)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-2">ID: {tenant.id} | Created: {new Date(tenant.created_at).toLocaleDateString()}</p>
              <button onClick={() => setEditMode(true)} className="text-sm text-primary hover:underline">Edit</button>
            </div>
          )}
        </div>

        {/* Subscription Management */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Subscription</h3>
          {usage && (
            <div className="text-sm text-muted-foreground mb-4">
              <p>Plan: <span className="text-foreground font-medium capitalize">{usage.plan.tier}</span></p>
              <p>AI Responses: {usage.usage.ai_responses} / {usage.plan.conversation_limit}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleChangePlan('starter')} className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-secondary">Starter</button>
            <button onClick={() => handleChangePlan('growth')} className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-secondary">Growth</button>
            <button onClick={() => handleChangePlan('business')} className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-secondary">Business</button>
            <button onClick={handleSuspend} className="px-3 py-1.5 text-xs border border-destructive/50 text-destructive rounded-lg hover:bg-destructive/10">Suspend</button>
            <button onClick={handleReactivate} className="px-3 py-1.5 text-xs border border-green-500/50 text-green-600 rounded-lg hover:bg-green-500/10">Reactivate</button>
          </div>
        </div>

        {/* Users */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Users ({users.length})</h3>
            </div>
            <button onClick={() => setAddUserOpen(true)} className="flex items-center gap-1 text-sm text-primary hover:underline">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email} • {user.role}</p>
                </div>
                <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 rounded-lg hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add User Modal */}
        {addUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Add User</h3>
              <div className="space-y-3">
                <input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="Name" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" type="email" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Password" type="password" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'owner' | 'admin' | 'staff' })} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button onClick={() => setAddUserOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary">Cancel</button>
                <button onClick={handleAddUser} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

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
                          onClick={() => openDetail(tenant.id)}
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
