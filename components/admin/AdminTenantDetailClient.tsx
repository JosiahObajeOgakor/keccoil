'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/utils/auth';
import {
  adminGetTenant, adminUpdateTenant, adminGetTenantUsers,
  adminCreateTenantUser, adminDeleteTenantUser,
  adminGetTenantUsage, adminChangePlan,
  adminSuspendSubscription, adminReactivateSubscription,
} from '@/lib/api';
import type { Tenant, TenantUser, BillingUsage, CreateTenantUserRequest } from '@/lib/types';
import { toast } from 'sonner';
import { ArrowLeft, Users, Trash2, Plus } from 'lucide-react';

export default function AdminTenantDetailClient() {
  const router = useRouter();
  const params = useParams();
  const tenantId = Number(params.id);

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [usage, setUsage] = useState<BillingUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ business_name: '', ai_system_prompt: '' });
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<CreateTenantUserRequest>({ email: '', password: '', name: '', role: 'staff' });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    try {
      const [t, u, us] = await Promise.all([
        adminGetTenant(tenantId),
        adminGetTenantUsers(tenantId),
        adminGetTenantUsage(tenantId),
      ]);
      setTenant(t);
      setUsers(u);
      setUsage(us);
      setEditData({ business_name: t.business_name, ai_system_prompt: t.ai_system_prompt || '' });
    } catch (err) {
      toast.error('Failed to load tenant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await adminUpdateTenant(tenantId, editData);
      setTenant(updated);
      setEditMode(false);
      toast.success('Tenant updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const handleChangePlan = async (tier: string) => {
    try {
      await adminChangePlan(tenantId, tier);
      toast.success(`Plan changed to ${tier}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change plan');
    }
  };

  const handleSuspend = async () => {
    try {
      await adminSuspendSubscription(tenantId);
      toast.success('Subscription suspended');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to suspend');
    }
  };

  const handleReactivate = async () => {
    try {
      await adminReactivateSubscription(tenantId);
      toast.success('Subscription reactivated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reactivate');
    }
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.name) {
      toast.error('All fields required');
      return;
    }
    try {
      const user = await adminCreateTenantUser(tenantId, newUser);
      setUsers([...users, user]);
      setAddUserOpen(false);
      setNewUser({ email: '', password: '', name: '', role: 'staff' });
      toast.success('User added');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await adminDeleteTenantUser(tenantId, userId);
      setUsers(users.filter((u) => u.id !== userId));
      toast.success('User removed');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove user');
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">Tenant Detail</h1>
        <div className="h-48 bg-card border border-border rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!tenant) {
    return <p className="text-muted-foreground">Tenant not found.</p>;
  }

  return (
    <div>
      <button onClick={() => router.push('/admin/tenants')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to tenants
      </button>

      {/* Tenant Info */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">{tenant.business_name}</h2>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            tenant.status === 'active'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {tenant.status}
          </span>
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
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Save</button>
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
