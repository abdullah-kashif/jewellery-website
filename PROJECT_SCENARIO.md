# LUXORA Jewellery Project Scenario

Ye file project ka working context hai. Future me agar is website par kaam karna ho to pehle is doc ko read karo, phir sirf relevant file open karo. Is se complete project dobara scan karne ki zarurat kam hogi.

## Project Identity

- Project name: `luxora-jewellery`
- Type: Luxury jewellery ecommerce + custom jewellery quote platform
- Framework: Next.js `16.2.6` App Router with React `19.2.4`
- Styling: Tailwind CSS v4 via `@import "tailwindcss"` in `app/globals.css`
- Backend/data: Supabase Auth, Supabase database, Supabase storage
- Currency display: Mostly USD
- Main brand palette: ivory `#fbf7ef`, black `#050505`, gold `#a77a25`, soft gold `#d6b46a`, light gold `#eadfca`

Important: `AGENTS.md` says this Next.js version has changed conventions. Before code changes, read relevant docs from `node_modules/next/dist/docs/`. Current project already uses Next 16 style async `params` and `searchParams` in several App Router pages.

## Main User Experience

The public website lets customers:

- Browse homepage sections for jewellery, categories, custom jewellery, gemstones, reviews, and trust points.
- Browse active Supabase products on `/shop`.
- Filter/sort products in `ShopClient`.
- Open dynamic product pages at `/product/[slug]`.
- Add ready products to localStorage cart and wishlist.
- Checkout with manual payment method.
- Submit custom jewellery quote requests with optional reference image.
- Track orders by reference and optional email.
- Login/signup with Supabase customer auth.
- View account dashboard with profile, orders, quote requests, and payment proof options.
- Submit payment proof after login.
- Contact the store through a message form.

## Main Public Routes

- `/`: Homepage. Uses `app/page.tsx`. Some home sections use local static arrays from `lib/site-data.ts`; shop/product pages use Supabase products.
- `/shop`: Product listing. Uses `app/shop/page.tsx` and `components/shop/ShopClient.tsx`. Fetches active products from Supabase `products`.
- `/product/[slug]`: Product detail page. Uses `lib/products.ts` to fetch active product by slug from Supabase.
- `/cart`: Cart page. Uses client localStorage cart behavior.
- `/checkout`: Checkout page. Reads localStorage cart and posts to `/api/orders`.
- `/custom-jewellery`: Marketing/explanation page for custom jewellery process.
- `/custom-order`: Custom quote form page. Uses `QuoteRequestForm` and posts to `/api/quote-request`.
- `/gemstones`: Gemstone listing/marketing page.
- `/account`: Customer login/signup or account dashboard. Uses Supabase auth session.
- `/track-order`: Track order UI. Posts to `/api/track-order`.
- `/contact`: Contact page. Uses contact form posting to `/api/contact-message`.
- `/about`, `/faq`, `/terms`, `/privacy-policy`, `/refund-policy`, `/return-policy`, `/shipping-policy`: Content/policy pages.
- `/payment-instructions/[orderId]`: Payment instruction page for an order/deposit order.

## Layout And Chrome

- Root layout: `app/layout.tsx`
- Public chrome: `components/layout/SiteChrome.tsx`
- Header: `components/layout/Header.tsx`
- Footer: `components/layout/Footer.tsx`
- Announcement bar: `components/layout/AnnouncementBar.tsx`

`SiteChrome` hides normal public header/footer on `/admin` routes. Admin routes use their own layout/sidebar.

Header counts are localStorage/event based:

- Cart count listens to `luxora-cart-updated`
- Wishlist count listens to `luxora-wishlist-updated`

Recent button color fix:

- `app/globals.css` has global pill CTA color guards.
- `components/layout/Header.tsx` cart link uses `luxora-cart-link`.
- Cart badge uses `luxora-cart-count`.

## Data Sources

There are two product/data styles in the repo:

1. Supabase-backed products:
   - `lib/products.ts`
   - `lib/products-db.ts`
   - Admin product management
   - `/shop` and `/product/[slug]`

2. Static placeholder/site data:
   - `lib/site-data.ts`
   - Used heavily by homepage and some marketing sections.
   - Contains categories, static products, gemstones, trust points, reviews.

When making product behavior real, prefer Supabase-backed helpers instead of expanding static data.

## Supabase Setup

Supabase clients:

- `lib/supabase/admin.ts`: server-only service role client. Requires:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- `lib/supabase/server.ts`: server auth/session client using cookies. Requires:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `lib/supabase/browser.ts`: browser client for customer auth/client interactions.
- `lib/supabase/client.ts`: additional Supabase client helper.

Environment file exists as `.env.local`, but do not expose its secret values.

## Important Database Tables

Observed from code:

- `products`
  - Used by shop, product pages, admin products, seeding.
  - Fields include `name`, `slug`, `product_type`, `category`, `price`, `image_url`, `gallery_urls`, `is_active`, `is_featured`, `sort_order`, stock/details fields.
- `orders`
  - Created by checkout and quote deposit order flow.
  - Has `reference` / `order_number`, customer fields, totals, `payment_status`, `status`.
- `order_items`
  - Created after order insert.
  - Stores product/order line details.
- `quote_requests`
  - Created by custom quote form.
  - Admin can update status, quoted price, deposit info, notes.
  - Customer can approve quote and create deposit order.
- `customer_profiles`
  - Created on signup or quote submission for logged-in users.
  - Account page reads current customer profile.
- `contact_messages`
  - Created by contact form.
  - Admin messages page reads/deletes.
- `payment_confirmations`
  - Created by customer payment proof upload.
  - Admin payments page reviews and updates.
- `admin_users`
  - Maps Supabase auth users to admin roles/permissions.

Supabase storage buckets observed:

- `quote-reference-images`
- `payment-proofs`
- Product image bucket constant in `app/api/admin/product-images/route.ts`

## Customer Flows

### Signup/Login

- UI: `components/account/CustomerAuthForm.tsx`
- Uses `createSupabaseBrowserClient()`
- Login: Supabase `signInWithPassword`
- Signup: Supabase `signUp`, then inserts into `customer_profiles`
- Account page: `app/account/page.tsx`
- Account dashboard loads:
  - `getCurrentCustomer()` from `lib/customer-profile.ts`
  - `getCurrentCustomerOrders()` from `lib/customer-orders.ts`
  - `getCurrentCustomerQuoteRequests()` from `lib/customer-quotes.ts`

### Cart And Checkout

- Cart storage key is inconsistent in older code areas, so check relevant component before changing:
  - `CheckoutClient` uses `luxora_cart`
  - Header count checks `luxora-cart`, `cart`, `cartItems`
  - Providers may use their own keys.
- Checkout UI: `components/checkout/CheckoutClient.tsx`
- Checkout POST: `/api/orders`
- `/api/orders`:
  - Validates full name, email, WhatsApp, country, address, city, and items.
  - Creates reference like `LXO-123456`.
  - Inserts into `orders`.
  - Inserts rows into `order_items`.
  - Deletes order if item insert fails.
  - Returns `{ ok, reference, order }`.

### Custom Quote

- UI: `components/forms/QuoteRequestForm.tsx`
- Page: `app/custom-order/page.tsx`
- POST: `/api/quote-request`
- Accepts multipart form data or JSON.
- Required server-side fields: full name, email, WhatsApp, country, product type.
- Uploads image files only to `quote-reference-images`, max 5 MB.
- Creates reference like `LXQ-123456`.
- For logged-in users, creates/updates `customer_profiles`.
- Inserts into `quote_requests`.

### Quote Approval / Deposit

- Customer quote API routes:
  - `/api/customer/quotes/[id]/approve`
  - `/api/customer/quotes/[id]/create-deposit-order`
- Quote approval updates `quote_requests`.
- Deposit order flow creates an `orders` row and `order_items` row, then updates quote with deposit order details.

### Payment Proof

- API: `/api/customer/payment-confirmations`
- Requires logged-in Supabase user.
- Validates order ownership by `customer_user_id` or email.
- Uploads proof to `payment-proofs`.
- Inserts `payment_confirmations`.
- Updates order `payment_status` to `awaiting_transfer`.

### PayPal Checkout

- Payment page: `/payment-instructions/[orderId]`.
- PayPal UI component: `components/payment/PayPalCheckoutButton.tsx`.
- Server helpers: `lib/paypal.ts`.
- API routes:
  - `/api/paypal/create-order`: creates PayPal checkout order from Supabase order amount.
  - `/api/paypal/capture-order`: captures approved PayPal payment and updates Supabase `orders` to `payment_method: paypal`, `payment_status: paid`; pending orders become `confirmed`.
- Environment variables:
  - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
  - `PAYPAL_CLIENT_ID`
  - `PAYPAL_CLIENT_SECRET`
  - `PAYPAL_ENV=sandbox` or `live`
- If credentials are missing, the payment page shows a clear "PayPal credentials pending" message and manual payment instructions still work.

### Track Order

- API: `/api/track-order`
- Looks up `orders` by `reference`, fallback `order_number`.
- Optional email check must match order email.
- Returns order + `order_items`.

## Admin System

Admin routes:

- `/admin`: Dashboard overview
- `/admin/login`: Admin login
- `/admin/products`: Manage products
- `/admin/orders`: Manage checkout/deposit orders
- `/admin/quotes`: Manage quote requests
- `/admin/messages`: Manage contact messages
- `/admin/payments`: Manage payment confirmations
- `/admin/admins`: Manage admin users and permissions

Admin layout:

- `app/admin/layout.tsx`
- Calls `requireCurrentAdminUser()`
- Shows `AdminSidebar`

Admin auth/permissions:

- `lib/admin/current-admin.ts`
  - Reads current Supabase user.
  - Loads active row from `admin_users`.
  - Redirects unauthenticated/non-admin users to `/admin/login`.
- `lib/admin/permissions.ts`
  - Roles: `super_admin`, `product_manager`, `order_manager`, `support_admin`, `viewer`
  - Permissions:
    - `can_manage_products`
    - `can_manage_orders`
    - `can_manage_quotes`
    - `can_manage_messages`
    - `can_manage_payments`
    - `can_manage_admins`
  - `super_admin` bypasses all permission checks.

Admin protection:

- `proxy.ts` is Next 16 middleware/proxy style.
- Matches `/admin/:path*` and `/api/admin/:path*`.
- Redirects protected admin pages to login if no admin.
- Returns 401/403 JSON for protected admin APIs.
- Permission mapping currently covers products, orders, quotes, messages, admins.
- Note: `can_manage_payments` exists in `lib/admin/permissions.ts`, but `proxy.ts` type/mapping does not currently include payments. If payment route protection changes, update `proxy.ts` too.

Admin APIs:

- `/api/admin/dashboard`: summary counts/stats.
- `/api/admin/products`: GET/POST products.
- `/api/admin/products/[id]`: PATCH/DELETE product.
- `/api/admin/product-images`: upload product image.
- `/api/admin/seed-products`: seed product data.
- `/api/admin/orders`: list orders.
- `/api/admin/orders/[id]`: update order status/payment fields.
- `/api/admin/quotes`: list quote requests.
- `/api/admin/quotes/[id]`: update quote request.
- `/api/admin/messages`: list contact messages.
- `/api/admin/messages/[id]`: delete message.
- `/api/admin/payment-confirmations`: list payment confirmations.
- `/api/admin/payment-confirmations/[id]`: update payment confirmation and related order status.
- `/api/admin/admins`: list/create admins.
- `/api/admin/admins/[id]`: update admin user.

## Styling And UI Conventions

- Global CSS is in `app/globals.css`.
- Helpers include:
  - `.luxora-container`
  - `.luxora-section`
  - `.luxora-card`
  - `.luxora-btn`
  - `.luxora-btn-dark`
  - `.luxora-btn-gold`
  - `.luxora-btn-outline`
  - `.status-*`
  - `.admin-*`
- Current UI uses many inline Tailwind classes, especially rounded pill CTAs.
- Brand style is ivory/gold/black luxury, with rounded panels and high letter spacing.
- Some characters in existing source render as mojibake, like `â—†`, `â†’`, `âœ“`. If editing those files, consider replacing with plain ASCII or proper UTF-8 symbols carefully.

## Current Quality Notes / Known Issues

- `npm.ps1` is blocked by Windows execution policy. Use `npm.cmd run ...` in PowerShell.
- `npm.cmd run lint` currently fails because of existing React hook lint rules, mostly `react-hooks/set-state-in-effect` in admin/cart/provider files.
- Lint warnings also flag raw `<img>` usage. Several files intentionally use `<img>` with eslint disable comments.
- There are many uncommitted/untracked files in the repo. Do not assume all changes are new from the current task.
- Cart storage keys are not fully consistent across components/providers. Be careful before changing cart count or checkout behavior.
- Some homepage content still uses placeholders like "Replace with hero jewellery image later".
- `README.md` is default create-next-app text, not project-specific.

## Change Workflow For Future Tasks

1. Read `AGENTS.md`.
2. Read this `PROJECT_SCENARIO.md`.
3. For Next.js behavior changes, read the relevant file in `node_modules/next/dist/docs/`.
4. Identify whether the feature belongs to:
   - Public route/page
   - Client component
   - Supabase helper
   - API route
   - Admin route/API
   - Global CSS
5. Make scoped edits only.
6. Verify with:
   - `npm.cmd run lint` when useful, but expect existing unrelated failures.
   - Browser at `http://localhost:3000` for UI changes.

## Files Most Often Needed

- App/layout/theme:
  - `app/layout.tsx`
  - `app/globals.css`
  - `components/layout/Header.tsx`
  - `components/layout/SiteChrome.tsx`
  - `components/layout/Footer.tsx`
- Public ecommerce:
  - `app/page.tsx`
  - `app/shop/page.tsx`
  - `components/shop/ShopClient.tsx`
  - `components/shop/ProductCard.tsx`
  - `app/product/[slug]/page.tsx`
  - `components/cart/CartClient.tsx`
  - `components/checkout/CheckoutClient.tsx`
- Customer/custom order:
  - `app/account/page.tsx`
  - `components/account/CustomerAuthForm.tsx`
  - `components/account/CustomerAccountDashboard.tsx`
  - `components/forms/QuoteRequestForm.tsx`
  - `components/forms/TrackOrderForm.tsx`
  - `components/payment/PaymentProofForm.tsx`
- Backend:
  - `lib/products.ts`
  - `lib/customer-profile.ts`
  - `lib/customer-orders.ts`
  - `lib/customer-quotes.ts`
  - `lib/supabase/admin.ts`
  - `lib/supabase/server.ts`
  - `lib/supabase/browser.ts`
  - `app/api/orders/route.ts`
  - `app/api/quote-request/route.ts`
  - `app/api/track-order/route.ts`
  - `app/api/customer/payment-confirmations/route.ts`
- Admin:
  - `app/admin/layout.tsx`
  - `app/admin/page.tsx`
  - `components/admin/AdminSidebar.tsx`
  - `lib/admin/current-admin.ts`
  - `lib/admin/permissions.ts`
  - `proxy.ts`
