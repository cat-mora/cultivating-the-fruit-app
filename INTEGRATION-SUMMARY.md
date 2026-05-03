# Landing Page → App Integration - Summary

## What We've Built

### ✅ App Side (COMPLETED)
1. **Updated Signup Page** (`app/(web)/auth/sign-up.tsx`)
   - Now accepts URL parameters: `?email=...&code=...`
   - Auto-fills email and invite code fields
   - User just needs to create password

2. **Environment Variables** (`.env`)
   - Added LOOPS_API_KEY
   - Added STRIPE credentials
   - Added notes for SUPABASE_SERVICE_ROLE_KEY

3. **Utility Functions** (`lib/admin/invite-code-generator.ts`)
   - Shared code generation logic
   - Can be copied to landing page for consistency

4. **Database Schema** (Already exists)
   - `signup_invites` table with proper RLS policies
   - Allows public validation of codes
   - Tracks usage and expiration

### 📋 Landing Page Side (TO DO)
You need to build these in the landing page repository:

1. **Stripe Webhook Handler**
   - File: `/app/api/webhooks/stripe/route.ts`
   - Triggers on successful payment
   - Creates invite code in Supabase
   - Sends welcome email via Loops

2. **Checkout API** (if needed)
   - File: `/app/api/create-checkout/route.ts`
   - Creates Stripe checkout session
   - Collects customer email

3. **Environment Variables**
   - Add all required credentials
   - Get SUPABASE_SERVICE_ROLE_KEY from dashboard

4. **Loops Email Template**
   - Create transactional template
   - Add invite code and signup URL variables

---

## 📁 Files Created

### Documentation:
- ✅ `LANDING-PAGE-INTEGRATION.md` - Complete integration guide
- ✅ `LANDING-INTEGRATION-QUICKSTART.md` - Quick reference checklist
- ✅ `INTEGRATION-SUMMARY.md` - This file

### Code:
- ✅ `app/(web)/auth/sign-up.tsx` - Updated to accept URL params
- ✅ `app/.env` - Environment variables configured
- ✅ `lib/admin/invite-code-generator.ts` - Shared utilities
- ✅ `scripts/test-invite-creation.ts` - Test script

---

## 🔄 The Complete Flow

```
┌─────────────────┐
│  Landing Page   │
│  (Next.js)      │
└────────┬────────┘
         │
         │ 1. User enters email
         │ 2. Completes Stripe payment
         │
         ▼
┌─────────────────┐
│ Stripe Webhook  │
│ checkout.       │
│ session.        │
│ completed       │
└────────┬────────┘
         │
         │ 3. Generate invite code
         │ 4. Save to Supabase
         │
         ▼
┌─────────────────┐
│   Supabase      │
│ signup_invites  │
│  table          │
└────────┬────────┘
         │
         │ 5. Send email via Loops
         │
         ▼
┌─────────────────┐
│  User Email     │
│  with:          │
│  - Invite code  │
│  - Signup URL   │
└────────┬────────┘
         │
         │ 6. User clicks link
         │
         ▼
┌─────────────────┐
│  App Signup     │
│  (Expo Web)     │
│  Pre-filled:    │
│  - Email        │
│  - Invite code  │
└────────┬────────┘
         │
         │ 7. User creates password
         │ 8. Account activated
         │
         ▼
┌─────────────────┐
│   Onboarding    │
│   /onboarding   │
└─────────────────┘
```

---

## 🎯 Next Actions

### Immediate (App Side - DONE):
- ✅ Signup page accepts URL parameters
- ✅ Environment variables configured
- ✅ Utilities created

### Landing Page Implementation:
1. **Get Supabase Service Role Key**
   - Go to: https://supabase.com/dashboard/project/onwijddzljigbizsnrpo/settings/api
   - Copy the `service_role` key (keep it secret!)

2. **Clone Landing Page Repo**
   ```bash
   git clone https://github.com/cat-mora/cultivating-the-fruit.git
   cd cultivating-the-fruit
   ```

3. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js stripe
   ```

4. **Create Webhook Handler**
   - Copy code from `LANDING-PAGE-INTEGRATION.md`
   - Create `/app/api/webhooks/stripe/route.ts`

5. **Configure Environment**
   - Add all variables from integration guide
   - Test locally with Stripe CLI

6. **Create Loops Template**
   - Use HTML template from guide
   - Get template ID
   - Update webhook code with template ID

7. **Test End-to-End**
   - Run test payment
   - Verify invite created
   - Check email sent
   - Test signup link

8. **Deploy**
   - Deploy to Vercel
   - Configure Stripe webhook in production
   - Test with real payment

---

## 🧪 Testing

### Test Locally:
```bash
# Terminal 1: Start landing page
cd cultivating-the-fruit
npm run dev

# Terminal 2: Forward Stripe webhooks
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe

# Terminal 3: Test invite creation
cd cultivating-the-fruit-app
SUPABASE_SERVICE_ROLE_KEY=your-key npx tsx scripts/test-invite-creation.ts test@example.com
```

### Test Production:
1. Complete real payment with test card
2. Check Stripe webhook logs
3. Verify invite in Supabase
4. Check email delivery in Loops
5. Click signup link
6. Complete signup flow

---

## 🔍 Debugging Tools

### Check Database:
```sql
-- Recent invites
SELECT * FROM signup_invites
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Pending invites
SELECT * FROM signup_invites
WHERE status = 'pending'
ORDER BY created_at DESC;

-- Used invites
SELECT * FROM signup_invites
WHERE status = 'used'
ORDER BY used_at DESC;
```

### Test Invite Creation:
```bash
npx tsx scripts/test-invite-creation.ts your-email@example.com
```

### Stripe CLI Events:
```bash
stripe trigger checkout.session.completed
```

---

## 📞 Support Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/onwijddzljigbizsnrpo
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Loops Dashboard:** https://app.loops.so
- **App Repo:** https://github.com/cat-mora/cultivating-the-fruit-app.git
- **Landing Repo:** https://github.com/cat-mora/cultivating-the-fruit.git

---

## 🔐 Security Notes

- ✅ Service role key = backend only (webhooks)
- ✅ Anon key = frontend only (app)
- ✅ Webhook signatures verified
- ✅ HTTPS required in production
- ✅ Invite codes expire after 30 days
- ✅ RLS policies protect database

---

## 💡 Tips

1. **Start with test mode** in Stripe before going live
2. **Test the full flow** multiple times before launch
3. **Monitor first few signups** closely
4. **Set up error alerting** (Sentry, etc.)
5. **Keep webhook logs** for debugging
6. **Document any customizations** you make

---

**Ready to get started?**
👉 Begin with `LANDING-INTEGRATION-QUICKSTART.md` for step-by-step instructions!
