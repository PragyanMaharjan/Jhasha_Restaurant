# Frontend - Restaurant Application

## 🏗️ Technology Stack

- **Framework:** Next.js 14.0.0 (App Router)
- **UI Library:** React 18.2.0
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 3.3.3
- **State Management:** Zustand 4.3.9
- **HTTP Client:** Axios 1.4.0
- **Notifications:** React Toastify 9.1.3
- **Payment:** Stripe React integration
- **Testing:** Vitest 1.0.4 + Testing Library + Playwright 1.40.1
- **Linting:** ESLint (Next.js config)

## 🌟 Features

### Customer Features

- ✅ User authentication and registration
- ✅ Forgot password functionality
- ✅ Dynamic food menu with filtering and search
- ✅ Shopping cart with quantity management
- ✅ Checkout with delivery details
- ✅ Stripe payment integration
- ✅ User profile with image upload
- ✅ Order tracking and history
- ✅ Responsive design for all devices

### Admin Features

- ✅ Dashboard with statistics
- ✅ User management (view, edit, delete)
- ✅ Food menu management (CRUD operations)
- ✅ Order management and status updates
- ✅ Active delivery tracking
- ✅ Employee management

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

   Application will run on `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🧪 Testing

### Unit Tests (Vitest + Testing Library)

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage
```

**Test Files:**

- `components/__tests__/Navbar.test.tsx` - 7 tests
- `components/__tests__/FoodCard.test.tsx` - 8 tests
- `components/__tests__/AdminSidebar.test.tsx` - 4 tests
- `app/hooks/__tests__/useAuth.test.ts` - 7 tests
- `app/hooks/__tests__/useCart.test.ts` - 10 tests

**Total:** 36+ unit tests

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Interactive mode
npm run test:e2e:ui

# View report
npm run test:e2e:report
```

**Test Suites:**

- `e2e/auth.spec.ts` - Authentication flows (5 tests)
- `e2e/food.spec.ts` - Food browsing (4 tests)
- `e2e/cart.spec.ts` - Cart operations (4 tests)
- `e2e/navigation.spec.ts` - Navigation (4 tests)

**Total:** 17+ E2E tests across 3 browsers (Chromium, Firefox, WebKit)

## 📁 Project Structure

```
frontend/
├── app/                        # Next.js App Router
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication utilities
│   │   ├── useCart.ts         # Cart operations
│   │   ├── useFetch.ts        # Data fetching
│   │   ├── useForm.ts         # Form handling
│   │   └── __tests__/         # Hook tests
│   ├── admin/                 # Admin pages
│   │   ├── dashboard/
│   │   ├── food/
│   │   ├── orders/
│   │   ├── users/
│   │   ├── employees/
│   │   └── active-deliveries/
│   ├── cart/                  # Shopping cart page
│   ├── checkout/              # Checkout page
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   ├── profile/               # User profile
│   ├── my-orders/            # Order history
│   ├── track-order/          # Order tracking
│   ├── payment/              # Payment page
│   ├── forgot-password/      # Password reset
│   ├── reset-password/       # Password reset form
│   ├── order-confirmation/   # Order success
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/               # Shared components
│   ├── Navbar.tsx
│   ├── FoodCard.tsx
│   ├── AdminSidebar.tsx
│   └── __tests__/           # Component tests
├── lib/                      # Libraries & utilities
│   ├── api.js               # API configuration
│   ├── store.js             # Zustand store
│   └── storeProvider.tsx    # Store provider
├── public/                   # Static assets
├── e2e/                     # End-to-end tests
│   ├── auth.spec.ts
│   ├── food.spec.ts
│   ├── cart.spec.ts
│   └── navigation.spec.ts
├── vitest.config.ts         # Unit test config
├── vitest.setup.ts          # Test setup
├── playwright.config.ts     # E2E test config
├── tailwind.config.js       # Tailwind config
├── next.config.js           # Next.js config
├── tsconfig.json            # TypeScript config
└── package.json
```

## 🎣 Custom Hooks

### useAuth

Authentication and authorization utilities.

```typescript
import { useAuth } from "@/app/hooks/useAuth";

function MyComponent() {
  const { requireAuth, requireAdmin, isAdmin, logout } = useAuth();

  // Redirect if not authenticated
  requireAuth();

  // Redirect if not admin
  requireAdmin();

  // Check admin status
  if (isAdmin()) {
    // Show admin features
  }

  // Logout
  const handleLogout = () => {
    logout();
  };
}
```

### useFetch

Data fetching with loading and error states.

```typescript
import { useFetch } from '@/app/hooks/useFetch';

function MyComponent() {
  const { data, loading, error, refetch } = useFetch<Food[]>('/food');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map(food => <FoodCard key={food._id} food={food} />)}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### useCart

Cart operations with validation.

```typescript
import { useCart } from "@/app/hooks/useCart";

function MyComponent() {
  const {
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    handleClearCart,
  } = useCart();

  // Add item with validation
  handleAddToCart(food, 2);

  // Update quantity (validates 1-50)
  handleUpdateQuantity(foodId, 5);

  // Remove item (with confirmation)
  handleRemoveFromCart(foodId);

  // Clear cart (with confirmation)
  handleClearCart();
}
```

### useForm

Form state management with validation.

```typescript
import { useForm } from '@/app/hooks/useForm';

function MyComponent() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm<LoginFormData>(
    { email: '', password: '' },
    validateLogin
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.email && errors.email && <span>{errors.email}</span>}
    </form>
  );
}
```

## 🛣️ Routing

Using Next.js App Router:

### Public Pages

- `/` - Home page with food menu
- `/login` - Login page
- `/register` - Registration
- `/forgot-password` - Request password reset
- `/reset-password/[token]` - Reset password with token

### User Pages (Protected)

- `/profile` - User profile (protected)
- `/cart` - Shopping cart
- `/checkout` - Checkout (protected)
- `/payment` - Payment page (protected)
- `/my-orders` - Order history (protected)
- `/track-order/[id]` - Track specific order
- `/order-confirmation/[id]` - Order confirmation

### Admin Pages (Admin Only)

- `/admin/dashboard` - Dashboard with statistics
- `/admin/users` - User management
- `/admin/food` - Food menu management
- `/admin/orders` - Order management
- `/admin/employees` - Employee management
- `/admin/active-deliveries` - Active delivery tracking

## State Management (Zustand)

### useAuthStore

```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user) => void,
  setToken: (token) => void,
  logout: () => void
}
```

### useCartStore

```javascript
{
  cart: [],
  total: 0,
  addToCart: (food) => void,
  removeFromCart: (foodId) => void,
  updateQuantity: (foodId, quantity) => void,
  clearCart: () => void
}
```

## Key Components

### FoodCard

Displays a food item with:

- Image
- Price
- Rating
- Vegetarian/Spice level indicator
- Add to cart / Quantity controls

### AdminSidebar

Navigation sidebar for admin pages linking to:

- Dashboard
- Users Management
- Food Menu Management
- Orders Management

## 🛠️ Development Tools

```bash
# Frontend Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Interactive test UI
npm run test:coverage # Run tests with coverage

# E2E Testing
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Interactive E2E mode
npm run test:e2e:report # View E2E report
```

## 📝 Code Quality

### ESLint

```bash
# Run linter
npm run lint
```

**Configuration:**

- Extends `next/core-web-vitals`
- React Hooks rules enforced
- TypeScript support
- Auto-fix on save (VS Code)

### Type Safety

All components and hooks are fully typed with TypeScript.

Uses Tailwind CSS with custom configuration:

- Primary color: `#ff6b6b` (Red)
- Secondary color: `#4ecdc4` (Teal)
- Dark background: `#2d3436`
- Light background: `#f5f6fa`

Custom utility classes:

- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card` - Card component
- `.input-field` - Form input
- `.error-text` - Error message
- `.success-text` - Success message

## API Integration

All API calls use the configured Axios instance with:

- Automatic JWT token injection in headers
- Base URL from environment variable
- Token stored in cookies

Example API call:

```typescript
const response = await API.get("/food");
const response = await API.post("/orders", orderData);
```

## Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token stored in cookie via `useAuthStore`
4. Token automatically added to all API requests
5. Protected pages redirect to login if not authenticated
6. Logout clears token and user data

## Image Upload

Profile image upload uses:

- Multer on backend
- FormData on frontend
- Images stored in `uploads/` folder
- Accessible via `http://localhost:5000/uploads/`

## Payment Integration

Stripe integration includes:

1. Create payment intent on checkout
2. Display card element on payment page
3. Confirm payment with Stripe
4. Update order status on success
5. Email confirmation

**Note:** Use Stripe test card `4242 4242 4242 4242` for testing.

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect GitHub repository
   - Set environment variables
   - Auto-deploy on push

3. **Environment Variables**
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Alternative Platforms

- **Netlify:** Similar to Vercel
- **AWS Amplify:** AWS integration
- **DigitalOcean:** App Platform

## 📊 State Management

Using **Zustand** for global state:

### Auth Store

```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  login: (userData) => void,
  logout: () => void,
  updateUser: (userData) => void
}
```

### Cart Store

```typescript
{
  items: CartItem[],
  addToCart: (item) => void,
  removeFromCart: (id) => void,
  updateQuantity: (id, quantity) => void,
  clearCart: () => void,
  getTotalPrice: () => number,
  getTotalItems: () => number
}
```

## 🔧 API Integration

### Axios Configuration

```typescript
// lib/api.js
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Usage Example

```typescript
import api from "@/lib/api";

// GET request
const { data } = await api.get("/food");

// POST request
const { data } = await api.post("/orders", orderData);
```

## 💳 Stripe Integration

```typescript
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// Create payment intent
const { clientSecret } = await api.post("/orders/payment-intent", {
  amount: totalAmount,
});

// Confirm payment
const stripe = await stripePromise;
const { error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: elements.getElement(CardElement),
    billing_details: { name: userName },
  },
});
```

**Test Card:** Use `4242 4242 4242 4242` with any future date and CVC.

## 🎨 Styling

Uses Tailwind CSS with custom configuration:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4'
    }
  }
}
```

## 📦 Key Components

### Navbar

- Logo and branding, navigation links
- Cart icon with item count
- User menu (profile, orders, logout)

### FoodCard

- Food item display with image, price, rating
- Vegetarian badge, spice level indicator
- Add to cart button

### AdminSidebar

- Dashboard, Food, Orders, Users, Employees, Active deliveries

## 🐛 Troubleshooting

**API Connection Issues:**

- Ensure backend is running on localhost:5000
- Check API_URL in .env.local
- Verify CORS settings in backend

**Stripe not working:**

- Use test publishable key
- Check key format
- Verify test mode in Stripe dashboard

**Image upload issues:**

- Backend must have uploads folder
- Verify Multer configuration
- Check file size limits

**Authentication problems:**

- Clear cookies and localStorage
- Verify token JWT_SECRET matches backend
- Check token expiration

## Performance Optimizations

- Image lazy loading with Next.js Image component
- Code splitting with dynamic imports
- Zustand for efficient state management
- optimized re-renders with React.memo
- API caching where appropriate

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use for personal and commercial projects.

## Support

For issues and questions, please create an issue in the repository.
