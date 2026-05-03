# Cultivating the Fruit - System Handoff Guide

## 📋 Table of Contents
- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repositories](#repositories)
- [Environment Variables](#environment-variables)
- [Third-Party Services](#third-party-services)
- [Payment Flow](#payment-flow)
- [Database Structure](#database-structure)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Key Files Reference](#key-files-reference)

---

## System Overview

**Cultivating the Fruit** is a dual-repository system consisting of:
1. **Landing Page** - Handles marketing, payments, and invite code generation
2. **Mobile/Web App** - The actual application where users access content

The system uses a **payment-first model**: customers pay on the landing page, receive an invite code via email, then use that code to create their account in the app.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     LANDING PAGE                            │
│                cultivatingthefruit.com                      │
│                                                             │
│  • Marketing content                                        │
│  • Stripe checkout                                          │
│  • Webhook handler                                          │
│  • Invite code generation                                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Payment Completed
                  ▼
         ┌────────────────────┐
         │  STRIPE WEBHOOK    │
         │  ─────────────     │
         │  1. Generate code  │
         │  2. Save to DB     │
         │  3. Send email     │
         └────────┬───────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
        ▼                    ▼
┌───────────────┐    ┌──────────────┐
│   SUPABASE    │    │    LOOPS     │
│   DATABASE    │    │    EMAIL     │
│               │    │              │
│ signup_invites│    │ Welcome email│
│ table stores  │    │ with signup  │
│ invite codes  │    │ link + code  │
└───────┬───────┘    └──────┬───────┘
        │                   │
        │                   │ User clicks link
        │                   ▼
        │          ┌─────────────────┐
        │          │  EMAIL LINK     │
        │          │  ────────────   │
        │          │  app URL with:  │
        │          │  ?email=...     │
        │          │  &code=...      │
        │          └────────┬────────┘
        │                   │
        └───────────────────┤
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         APP                                 │
│               app.cultivatingthefruits.com                  │
│                                                             │
│  1. Pre-filled signup form (email + code)                  │
│  2. Validate code from Supabase                            │
│  3. User creates password                                  │
│  4. Account activated                                      │
│  5. Access granted to content                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Landing Page
- **Framework:** Static HTML/JavaScript (or Next.js if migrated)
- **Hosting:** Vercel
- **Payment:** Stripe Checkout
- **Email:** Loops (transactional email)
- **Database:** Supabase (for invite codes)

### App
- **Framework:** React Native (Expo)
- **Platform:** iOS, Android, Web
- **Hosting:** Vercel (web), Expo (mobile)
- **Database:** Supabase
- **Authentication:** Supabase Auth

---

## Repositories

### 1. Landing Page
- **GitHub:** https://github.com/cat-mora/cultivating-the-fruit.git
- **Live URL:** https://cultivatingthefruit.com
- **Vercel Project:** cultivating-the-fruit (check Vercel dashboard)
- **Purpose:** Marketing site, payment processing, invite code generation

### 2. App
- **GitHub:** https://github.com/cat-mora/cultivating-the-fruit-app.git
- **Live URL:** https://app.cultivatingthefruits.com
- **Vercel Project:** cultivating-the-fruit-app (check Vercel dashboard)
- **Purpose:** Main application where users consume content

---

## Environment Variables

### Landing Page Environment Variables

Set in Vercel → Project Settings → Environment Variables:

```bash
# Supabase (connects to app's database)
NEXT_PUBLIC_SUPABASE_URL=https://onwijddzljigbizsnrpo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (backend only - has admin access)

# Stripe (payment processing)
STRIPE_SECRET_KEY=sk_live_... (from Stripe dashboard)
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe webhook settings)

# Loops (email marketing/transactional)
LOOPS_API_KEY=... (from Loops dashboard)

# URLs
NEXT_PUBLIC_APP_URL=https://app.cultivatingthefruits.com
NEXT_PUBLIC_BASE_URL=https://cultivatingthefruit.com
```

**Where to get these:**
- **SUPABASE_SERVICE_ROLE_KEY:** https://supabase.com/dashboard/project/onwijddzljigbizsnrpo/settings/api
  - Look for "service_role" key (NOT anon key)
  - This has admin privileges to write invite codes
- **STRIPE_SECRET_KEY:** https://dashboard.stripe.com/apikeys
  - Use the "Secret key" (starts with `sk_live_`)
- **STRIPE_WEBHOOK_SECRET:** https://dashboard.stripe.com/webhooks
  - Create/view webhook endpoint
  - Copy the signing secret
- **LOOPS_API_KEY:** https://app.loops.so/settings (API section)

---

### App Environment Variables

Set in Vercel → Project Settings → Environment Variables:

```bash
# Supabase (connects to database)
EXPO_PUBLIC_SUPABASE_URL=https://onwijddzljigbizsnrpo.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (public key - safe for client-side)

# Feature flags
EXPO_PUBLIC_ENABLE_SUPABASE=true
EXPO_PUBLIC_ENABLE_WEB_PLATFORM=true
EXPO_PUBLIC_ENABLE_PARTNER_SHARING=true
EXPO_PUBLIC_DEBUG_MODE=false

# Other
EXPO_PUBLIC_WEB_URL=https://app.cultivatingthefruits.com
EXPO_PUBLIC_SYNC_INTERVAL_MS=300000
```

**Where to get these:**
- **EXPO_PUBLIC_SUPABASE_ANON_KEY:** https://supabase.com/dashboard/project/onwijddzljigbizsnrpo/settings/api
  - Look for "anon/public" key
  - This is SAFE to expose client-side (protected by RLS)

---

## Third-Party Services

### 1. Supabase (Database & Auth)
- **Dashboard:** https://supabase.com/dashboard/project/onwijddzljigbizsnrpo
- **Project ID:** `onwijddzljigbizsnrpo`
- **Purpose:**
  - Stores user accounts
  - Stores invite codes
  - Handles authentication
  - Stores app content/data

**Key Tables:**
- `signup_invites` - Stores invite codes generated from payments
- `profiles` - User profile data
- (Add other tables as needed)

**Access:**
- Email associated with the Supabase account
- Can transfer ownership if needed

---

### 2. Stripe (Payments)
- **Dashboard:** https://dashboard.stripe.com
- **Account:** (Client's email)
- **Purpose:** Payment processing for app subscriptions

**Products Setup:**
- 1-month access: `price_1TPwm9Emfa6ZbajN13Q15HiF`
- 6-month access: `price_1TPwmsEmfa6ZbajNFSyqAKue`
- 12-month access: `price_1TPwpcEmfa6ZbajNxCEFdD6m`
- Various upsells/add-ons (drift, grace, bundles, etc.)

**Webhooks:**
- Endpoint: `https://cultivatingthefruit.com/api/webhook`
- Events: `checkout.session.completed`
- Used to generate invite codes after payment

**Access:**
- Client's Stripe account
- Can add team members if needed

---

### 3. Loops (Email Marketing)
- **Dashboard:** https://app.loops.so
- **Purpose:** Transactional emails (welcome, onboarding, codes)

**Key Email Templates:**
- Purchase confirmation (with invite code)
- Bump guide delivery
- Welcome sequence

**Access:**
- Client's Loops account
- API key in environment variables

---

### 4. Vercel (Hosting)
- **Dashboard:** https://vercel.com
- **Projects:**
  - Landing page: `cultivating-the-fruit`
  - App: `cultivating-the-fruit-app`

**Deployment:**
- Auto-deploys on push to `main`/`master` branch
- Environment variables set per project
- Custom domains configured

**Access:**
- Vercel account email
- Can add team members

---

## Payment Flow

### Step-by-Step

1. **User visits landing page** → `https://cultivatingthefruit.com`

2. **User selects tier** (1-month, 6-month, or 12-month)

3. **User clicks checkout**
   - Frontend calls: `POST /api/create-checkout-session`
   - Backend generates 6-character invite code (e.g., "A1B2C3")
   - Code stored in Stripe session metadata
   - Returns Stripe Checkout URL

4. **User completes payment in Stripe**

5. **Stripe webhook fires** → `POST https://cultivatingthefruit.com/api/webhook`
   - Event: `checkout.session.completed`
   - Webhook handler:
     1. Reads invite code from session metadata
     2. Saves code to Supabase `signup_invites` table
     3. Sends welcome email via Loops with code

6. **User receives email**
   - Contains invite code (e.g., "A1B2C3")
   - Contains direct signup link:
     ```
     https://app.cultivatingthefruits.com/(web)/auth/sign-up?email=user@example.com&code=A1B2C3
     ```

7. **User clicks signup link**
   - App loads with email and code pre-filled

8. **User creates password**
   - App validates code against Supabase
   - Creates account using Supabase Auth
   - Marks invite code as "used"

9. **User gains access**
   - Logged in
   - Can access paid content

---

## Database Structure

### Supabase Tables

#### `signup_invites`
Stores invite codes generated from payments.

```sql
CREATE TABLE signup_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  status TEXT DEFAULT 'pending', -- 'pending', 'used', 'expired'
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP
);

-- Index for fast code lookups
CREATE INDEX idx_invite_code ON signup_invites(invite_code);
CREATE INDEX idx_status ON signup_invites(status);
```

#### Row Level Security (RLS)

**Landing page access:**
- Uses SERVICE_ROLE_KEY (bypasses RLS)
- Can INSERT invite codes

**App access:**
- Uses ANON_KEY (respects RLS)
- Can READ/validate invite codes
- Can UPDATE to mark as used

**RLS Policies:**
```sql
-- Allow anyone to read pending/unused codes (for validation)
CREATE POLICY "Anyone can validate codes"
ON signup_invites FOR SELECT
USING (status = 'pending');

-- Only authenticated users can mark codes as used
CREATE POLICY "Users can use codes"
ON signup_invites FOR UPDATE
USING (auth.uid() IS NOT NULL AND status = 'pending');
```

---

## Deployment

### Landing Page Deployment

**Automatic deployment:**
1. Push to `main` branch on GitHub
2. Vercel auto-deploys
3. Live at `https://cultivatingthefruit.com`

**Manual deployment:**
```bash
cd cultivating-the-fruit
git push origin master
# Vercel automatically deploys
```

**Environment variables:**
- Set once in Vercel dashboard
- Apply to Production and Preview environments
- Redeploy after changing env vars

---

### App Deployment

**Web deployment:**
1. Push to `main` branch on GitHub
2. Vercel auto-deploys web version
3. Live at `https://app.cultivatingthefruits.com`

**Mobile deployment (iOS/Android):**
```bash
cd app-platform/app

# Build for production
eas build --platform ios
eas build --platform android

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

**EAS Configuration:**
- Uses Expo Application Services (EAS)
- Configured in `eas.json`
- Requires Expo account

---

## Testing

### Testing Payment Flow (Test Mode)

**Local testing:**
1. Use Stripe test keys in `.env.local`
2. Install Stripe CLI:
   ```bash
   stripe login
   stripe listen --forward-to http://localhost:3000/api/webhook
   ```
3. Use test card: `4242 4242 4242 4242`
4. Check Supabase for invite code
5. Test signup in app

**Production testing:**
1. Make real payment (can refund later)
2. Check email for invite code
3. Click signup link
4. Verify account creation

---

### Testing App Functionality

**Web testing:**
```bash
cd app-platform/app
npm run web
```
- Opens at `http://localhost:8081`
- Test signup flow
- Test authentication
- Test content access

**Mobile testing:**
```bash
cd app-platform/app
npm run ios    # iOS simulator
npm run android # Android emulator
```

---

## Troubleshooting

### Payment not generating invite code

**Check:**
1. Stripe webhook logs: https://dashboard.stripe.com/webhooks
2. Vercel function logs: Vercel dashboard → Functions → `/api/webhook`
3. Supabase table: `SELECT * FROM signup_invites ORDER BY created_at DESC`

**Common issues:**
- SUPABASE_SERVICE_ROLE_KEY not set in Vercel
- Webhook secret mismatch
- Webhook endpoint not publicly accessible

---

### Invite code not working in app

**Check:**
1. Code exists in Supabase: `SELECT * FROM signup_invites WHERE invite_code = 'ABC123'`
2. Code status is 'pending' (not 'used' or 'expired')
3. App has correct EXPO_PUBLIC_SUPABASE_ANON_KEY
4. RLS policies allow reading the code

---

### Email not sending

**Check:**
1. Loops API key is correct
2. Loops template IDs match in code
3. Loops dashboard → Activity for failed sends
4. Email address is valid

---

## Key Files Reference

### Landing Page

**Important files:**
```
api/
├── create-checkout-session.js  # Creates Stripe checkout, generates invite code
├── webhook.js                  # Handles payment completion, saves code to Supabase
├── create-oto-session.js       # One-time offer checkout
└── get-invite-code.js          # Helper to retrieve codes

.env.local                       # Environment variables (NOT committed)
.gitignore                       # Protects .env files
package.json                     # Dependencies (@supabase/supabase-js, stripe)
```

**Webhook handler flow:** (`api/webhook.js`)
1. Verify webhook signature
2. Extract invite code from metadata
3. Save to Supabase
4. Send email via Loops
5. Return success

---

### App

**Important files:**
```
app/
├── (auth)/
│   ├── sign-up/               # Signup page (validates invite codes)
│   ├── sign-in/               # Login page
│   └── ...
├── app.json                   # Expo config (has public Supabase URL/key)
├── supabase.ts                # Supabase client initialization
└── ...

.env.example                   # Template for environment variables
```

**Signup flow:** (`app/(auth)/sign-up`)
1. Pre-fill email and code from URL params
2. User enters password
3. Validate invite code from Supabase
4. Create account with Supabase Auth
5. Mark code as used
6. Redirect to app

---

## Security Notes

### What's Safe to Expose

✅ **SAFE (public, client-side):**
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_BASE_URL`

These are protected by Supabase RLS policies.

---

### What Must Stay Secret

❌ **SECRET (backend only, NEVER expose):**
- `SUPABASE_SERVICE_ROLE_KEY` - Has admin access, bypasses RLS
- `STRIPE_SECRET_KEY` - Can charge payments, refunds, etc.
- `STRIPE_WEBHOOK_SECRET` - Validates webhook authenticity
- `LOOPS_API_KEY` - Can send emails on your behalf

**Never commit these to git!**
- Landing page: `.env*` files are gitignored
- App: `.env*` files are gitignored
- Only set in Vercel environment variables

---

## Maintenance & Updates

### Adding New Payment Tiers

1. Create product in Stripe dashboard
2. Copy price ID
3. Add to `PRICE_IDS` in `api/create-checkout-session.js`
4. Add to `TIER_MONTHS` mapping
5. Update frontend checkout options

---

### Updating Email Templates

1. Go to Loops dashboard
2. Edit template
3. Available variables:
   - `{{inviteCode}}` - The 6-character code
   - `{{appSignupUrl}}` - Direct signup link with email/code
   - `{{firstName}}` - Customer name
   - `{{tierLabel}}` - Subscription tier
   - `{{tierPrice}}` - Price paid

---

### Rotating API Keys

**If keys are compromised:**

1. **Stripe:**
   - Generate new secret key in dashboard
   - Update Vercel env var
   - Redeploy

2. **Supabase:**
   - Can't rotate easily, contact Supabase support or create new project
   - Update all env vars
   - Migrate data if needed

3. **Loops:**
   - Generate new API key
   - Update Vercel env var
   - Redeploy

---

## Contact & Support

### Key Documentation
- Stripe docs: https://stripe.com/docs
- Supabase docs: https://supabase.com/docs
- Expo docs: https://docs.expo.dev
- Loops docs: https://loops.so/docs

### Getting Help
- **Stripe:** https://support.stripe.com
- **Supabase:** https://supabase.com/support
- **Vercel:** https://vercel.com/support
- **Expo:** https://expo.dev/support

---

## Handoff Checklist

When handing off to a new developer:

- [ ] Transfer GitHub repository access
- [ ] Transfer Vercel project access (or transfer ownership)
- [ ] Provide Stripe account credentials or add as team member
- [ ] Provide Supabase account credentials or transfer project
- [ ] Provide Loops account credentials or add as team member
- [ ] Share this documentation
- [ ] Share environment variables securely (use 1Password, etc.)
- [ ] Walk through payment flow together
- [ ] Walk through deployment process
- [ ] Test that they can deploy successfully
- [ ] Provide any design assets, brand guidelines
- [ ] Share analytics/monitoring access if applicable

---

**Last Updated:** 2026-05-03
**System Version:** 1.0
**Maintained by:** Joshua (original developer)
