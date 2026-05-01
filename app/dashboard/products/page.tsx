'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTenantProductsStore } from '@/lib/stores/tenantProductsStore';
import { formatPrice } from '@/lib/constants';
import type { TenantProduct } from '@/lib/types';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

const productSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Min 2 characters').max(100, 'Max 100 characters').required('Required'),
  price_kobo: Yup.number().typeError('Must be a number').positive('Must be positive').integer('Must be whole number').required('Required'),
  description: Yup.string().trim().max(500, 'Max 500 characters'),
  category: Yup.string().trim().max(50, 'Max 50 characters'),
  image_url: Yup.string().trim().url('Must be a valid URL').matches(/^https:\/\//, 'Must use HTTPS'),
  in_stock: Yup.boolean(),
});

interface FormState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editingId?: number;
}

export default function TenantProductsPage() {
  const { products, isLoading, fetchProducts, addProduct, updateProduct, deleteProduct } = useTenantProductsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState<FormState>({ isOpen: false, mode: 'add' });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      price_kobo: 0,
      description: '',
      category: '',
      image_url: '',
      in_stock: true,
    },
    validationSchema: productSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError(null);
      try {
        const sanitized = {
          name: values.name.trim(),
          price_kobo: values.price_kobo,
          description: values.description?.trim() || '',
          category: values.category?.trim() || '',
          image_url: values.image_url?.trim() || '',
          in_stock: values.in_stock,
        };

        if (form.mode === 'add') {
          await addProduct(sanitized as Omit<TenantProduct, 'id' | 'created_at' | 'updated_at'>);
        } else if (form.editingId) {
          await updateProduct(form.editingId, sanitized);
        }
        setForm({ isOpen: false, mode: 'add' });
        formik.resetForm();
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Failed to save product');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = (products ?? []).filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    formik.resetForm();
    formik.setValues({ name: '', price_kobo: 0, description: '', category: '', image_url: '', in_stock: true });
    setSubmitError(null);
    setForm({ isOpen: true, mode: 'add' });
  };

  const handleEdit = (product: TenantProduct) => {
    formik.resetForm();
    formik.setValues({
      name: product.name,
      price_kobo: product.price_kobo,
      description: product.description || '',
      category: product.category || '',
      image_url: product.image_url || '',
      in_stock: product.in_stock,
    });
    setSubmitError(null);
    setForm({ isOpen: true, mode: 'edit', editingId: product.id });
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {searchQuery ? 'No products match your search' : 'No products yet. Add your first product!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-secondary" />
                        )}
                        <div>
                          <p className="font-medium text-sm text-foreground">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{product.category || '—'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatPrice(product.price_kobo)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.in_stock
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Product</h3>
            <p className="text-sm text-muted-foreground mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {form.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {form.mode === 'add' ? 'Add Product' : 'Edit Product'}
            </h3>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
                <input {...formik.getFieldProps('name')} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                {formik.touched.name && formik.errors.name && <p className="mt-1 text-xs text-destructive">{formik.errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Price (kobo) *</label>
                <input type="number" {...formik.getFieldProps('price_kobo')} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                {formik.touched.price_kobo && formik.errors.price_kobo && <p className="mt-1 text-xs text-destructive">{formik.errors.price_kobo}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <input {...formik.getFieldProps('category')} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea {...formik.getFieldProps('description')} rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                {formik.touched.description && formik.errors.description && <p className="mt-1 text-xs text-destructive">{formik.errors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                <input {...formik.getFieldProps('image_url')} placeholder="https://..." className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                {formik.touched.image_url && formik.errors.image_url && <p className="mt-1 text-xs text-destructive">{formik.errors.image_url}</p>}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="in_stock" checked={formik.values.in_stock} onChange={(e) => formik.setFieldValue('in_stock', e.target.checked)} className="rounded border-border" />
                <label htmlFor="in_stock" className="text-sm text-foreground">In Stock</label>
              </div>

              {submitError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{submitError}</p>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => { setForm({ isOpen: false, mode: 'add' }); formik.resetForm(); }} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={formik.isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {formik.isSubmitting ? 'Saving...' : form.mode === 'add' ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
