# Landing Page Integration - Quick Start

## 🎯 Goal
Connect landing page payment → app signup with pre-filled email/code

---

## 📋 Checklist

### 1. Get Supabase Service Role Key
- [ ] Go to https://supabase.com/dashboard/project/onwijddzljigbizsnrpo/settings/api
- [ ] Copy **service_role** key (not anon key)
- [ ] Add to landing page `.env`: `SUPABASE_SERVICE_ROLE_KEY=your-key-here`

### 2. Landing Page Code (Next.js)
- [ ] Create `/app/api/webhooks/stripe/route.ts` (see full guide)
- [ ] Install dependencies: `npm install @supabase/supabase-js stripe`
- [ ] Add all environment variables from guide

### 3. Stripe Configuration
- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Add endpoint: `https://your-landing-page.com/api/webhooks/stripe`
- [ ] Select event: `checkout.session.completed`
- [ ] Copy webhook secret → `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

### 4. Loops Email Template
- [ ] Create transactional email template in Loops
- [ ] Add variables: `{{inviteCode}}`, `{{signupUrl}}`
- [ ] Copy template ID → webhook code
- [ ] Use email template from integration guide

### 5. Testing
- [ ] Test locally with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Complete test payment (card: 4242 4242 4242 4242)
- [ ] Check Supabase for new invite code
- [ ] Verify email sent via Loops
- [ ] Click signup link → verify email/code pre-filled

---

## 🔗 URLs You'll Need

### App Signup URL Format:
```
https://app.cultivatingthefruits.com/(web)/auth/sign-up?email=user@example.com&code=ABC123
```

### Stripe Webhook URL:
```
https://your-landing-page.com/api/webhooks/stripe
```

### Supabase Dashboard:
```
https://supabase.com/dashboard/project/onwijddzljigbizsnrpo
```

---

## 🔑 Environment Variables

```env
# Landing Page .env

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://onwijddzljigbizsnrpo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=get-from-supabase-dashboard

# Stripe
STRIPE_SECRET_KEY=sk_live_... (get from client Stripe account)
STRIPE_WEBHOOK_SECRET=whsec_... (get from Stripe webhook settings)

# Loops
LOOPS_API_KEY=... (get from client Loops account)

# App
NEXT_PUBLIC_APP_URL=https://app.cultivatingthefruits.com
```

---

## 🔍 Quick Debug

### Check if invite was created:
```sql
SELECT * FROM signup_invites
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### Stripe webhook logs:
- Stripe Dashboard → Developers → Webhooks → [Your endpoint] → Events

### Email delivery:
- Loops Dashboard → Emails → Sent

---

## 📁 Files to Create in Landing Page

1. **`/app/api/webhooks/stripe/route.ts`**
   - Handles Stripe webhook
   - Creates invite code in Supabase
   - Sends email via Loops

2. **`/app/api/create-checkout/route.ts`** (if not exists)
   - Creates Stripe checkout session
   - Collects customer email

3. **`.env.local`**
   - All environment variables above

---

## 🚨 Common Issues

### Webhook not triggering
- ✅ Check Stripe webhook logs for errors
- ✅ Verify webhook secret matches `.env`
- ✅ Ensure endpoint is publicly accessible (HTTPS)

### Invite code not created
- ✅ Check Supabase service role key is correct
- ✅ Verify RLS policies allow service role inserts
- ✅ Check console logs for database errors

### Email not sent
- ✅ Verify Loops API key
- ✅ Check template ID matches created template
- ✅ Review Loops dashboard for failed sends

### Signup link doesn't pre-fill
- ✅ Check URL encoding: `encodeURIComponent(email)`
- ✅ Verify app URL is correct
- ✅ Test URL directly in browser

---

## 📖 Full Documentation
See `LANDING-PAGE-INTEGRATION.md` for complete implementation guide with code examples.
