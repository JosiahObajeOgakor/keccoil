'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { isAdminAuthenticated } from '@/lib/utils/auth';
import { useAdmin } from '@/lib/contexts/AdminContext';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/constants';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

const productSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .required('Product name is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be greater than 0')
    .integer('Price must be a whole number (kobo)')
    .max(100000000, 'Price seems too high')
    .required('Price is required'),
  description: Yup.string()
    .trim()
    .max(500, 'Description must be at most 500 characters'),
  image_url: Yup.string()
    .trim()
    .url('Must be a valid URL')
    .matches(/^https:\/\//, 'URL must use HTTPS'),
  available: Yup.boolean(),
});

interface FormState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editingId?: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const { products, isLoading: productsLoading, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [form, setForm] = useState<FormState>({ isOpen: false, mode: 'add' });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      price: 0,
      description: '',
      image_url: '',
      available: true,
    },
    validationSchema: productSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError(null);
      try {
        const sanitized = {
          name: values.name.trim(),
          price: values.price,
          description: values.description?.trim() || '',
          image_url: values.image_url?.trim() || '',
          available: values.available,
          currency: 'NGN',
        };

        if (form.mode === 'add') {
          await addProduct(sanitized as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
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
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
    }
  }, [router]);

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'price-low') return a.price - b.price;
      return 0;
    });

  const handleAddNew = () => {
    formik.resetForm();
    formik.setValues({ name: '', price: 0, description: '', image_url: '', available: true });
    setSubmitError(null);
    setForm({ isOpen: true, mode: 'add' });
  };

  const handleEdit = (product: Product) => {
    formik.resetForm();
    formik.setValues({
      name: product.name,
      price: product.price,
      description: product.description || '',
      image_url: product.image_url || '',
      available: product.available,
    });
    setSubmitError(null);
    setForm({ isOpen: true, mode: 'edit', editingId: product.id });
  };

  const handleCloseForm = () => {
    setForm({ isOpen: false, mode: 'add' });
    formik.resetForm();
    setSubmitError(null);
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="newest">Newest First</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                            <Image src={product.image_url} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">#{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          product.available
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {product.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(product.updated_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {form.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-5">
              {form.mode === 'add' ? 'Add Product' : 'Edit Product'}
            </h2>

            {submitError && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} noValidate>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      formik.touched.name && formik.errors.name ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="e.g. Red Palm Oil 5L"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-xs text-destructive">{formik.errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-foreground mb-1.5">Price (kobo) *</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={formik.values.price || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      formik.touched.price && formik.errors.price ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="e.g. 500000"
                  />
                  {formik.touched.price && formik.errors.price ? (
                    <p className="mt-1 text-xs text-destructive">{formik.errors.price}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter price in kobo (e.g. 500000 = ₦5,000)
                      {formik.values.price > 0 && (
                        <span className="ml-1 font-medium text-primary">
                          = {formatPrice(formik.values.price)}
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={3}
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                      formik.touched.description && formik.errors.description ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="Brief product description..."
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="mt-1 text-xs text-destructive">{formik.errors.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {formik.values.description?.length || 0}/500
                  </p>
                </div>

                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-foreground mb-1.5">Image URL</label>
                  <input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={formik.values.image_url}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      formik.touched.image_url && formik.errors.image_url ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="https://..."
                  />
                  {formik.touched.image_url && formik.errors.image_url && (
                    <p className="mt-1 text-xs text-destructive">{formik.errors.image_url}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    name="available"
                    checked={formik.values.available}
                    onChange={formik.handleChange}
                    className="rounded border-border"
                  />
                  <label htmlFor="available" className="text-sm text-foreground">Available</label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-4 py-2.5 text-sm border border-border rounded-lg text-foreground font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="flex-1 px-4 py-2.5 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formik.isSubmitting
                    ? 'Saving...'
                    : form.mode === 'add'
                      ? 'Add Product'
                      : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-bold text-foreground mb-3">Delete Product?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 text-sm border border-border rounded-lg text-foreground font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 text-sm bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
