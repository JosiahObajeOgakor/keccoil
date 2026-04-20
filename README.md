# ClearFlow - Premium B2B Wholesale Marketplace

A fintech-inspired wholesale marketplace platform with WhatsApp-based ordering, admin dashboard for product management, and a modern, clean UI designed for trust and simplicity.

## Features

### Public Pages
- **Homepage**: Hero section with featured products, trust indicators, and how-it-works guide
- **Product Listing**: Filterable product grid with search, category filters, and sorting options
- **Product Details**: Detailed product views with quantity selector and WhatsApp order CTA
- **Responsive Design**: Mobile-first, optimized for all screen sizes

### Admin Dashboard
- **Secure Login**: Session-based authentication (demo credentials: `admin123`)
- **Product Management**: Add, edit, and delete products with full CRUD operations
- **Real-time Stats**: Dashboard shows total products, stock levels, inventory value, and low-stock alerts
- **Advanced Search & Sort**: Filter products by name, category with multiple sort options
- **Persistent Storage**: Admin changes saved to browser localStorage

### WhatsApp Integration
- One-click WhatsApp ordering from any product page
- Pre-filled messages with product details and quantities
- Direct customer-to-admin communication

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4.2 (pure utilities)
- **State Management**: React hooks + Context API
- **Data**: Mock JSON with localStorage persistence
- **Authentication**: Session-based (MVP implementation)

## Project Structure

```
/app
  /admin
    /login          # Admin authentication
    /dashboard      # Product management
    layout.tsx      # Admin provider wrapper
  /products
    /[id]          # Product detail page
    page.tsx       # Products listing page
  page.tsx         # Homepage
  layout.tsx       # Root layout
  globals.css      # Theme and global styles

/components
  Header.tsx       # Navigation header
  ProductCard.tsx  # Reusable product card
  Footer.tsx       # Footer component

/lib
  mockData.ts      # Product data and categories
  /utils
    whatsapp.ts    # WhatsApp link generation
    auth.ts        # Admin authentication utilities
  /contexts
    AdminContext.tsx # Product management context
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run dev server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open browser**: `http://localhost:3000`

## Admin Access

- **URL**: `http://localhost:3000/admin/login`
- **Demo Password**: `admin123`
- **Admin Features**:
  - View all products with statistics
  - Add new products with image URLs
  - Edit existing products
  - Delete products with confirmation
  - Search and filter products
  - Real-time inventory tracking

## Color Palette

- **Primary**: Deep Navy Blue (Trust & Professionalism)
- **Accent**: Teal/Cyan (Energy & Action)
- **Neutrals**: Light grays and off-whites
- **Destructive**: Red (Alerts & Errors)

## Key Components

### ProductCard
- Displays product image, name, price, stock status
- WhatsApp CTA button
- Hover effects and responsive layout

### Header
- Sticky navigation with logo
- Links to home, products, and admin
- Hides on admin pages

### Admin Dashboard
- Stats grid with key metrics
- Searchable, sortable product table
- Modal forms for add/edit operations
- Delete confirmation dialogs

## Features Implemented

✅ Public product browsing  
✅ WhatsApp order integration  
✅ Admin login & authentication  
✅ Product CRUD operations  
✅ Real-time inventory tracking  
✅ Responsive design  
✅ Category & search filtering  
✅ LocalStorage persistence  
✅ Fintech-inspired UI  
✅ Mobile-optimized experience  

## Future Enhancements

- Database integration (Supabase/Neon)
- Backend API for authentication
- Payment processing integration
- Order history & analytics
- Multi-currency support
- Email notifications
- Admin role-based access control
- Product image uploads

## Admin Credentials

**Note**: This is a demo implementation. In production:
- Use encrypted passwords with bcrypt
- Implement JWT tokens or sessions
- Add proper database persistence
- Enable 2FA/MFA
- Use HTTPS only

**Demo Login**:
- Password: `admin123`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Created with v0.app - A premium web generation platform
