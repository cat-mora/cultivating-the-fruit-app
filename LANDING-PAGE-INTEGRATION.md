# Landing Page to App Integration Guide

## Overview
This guide explains how to connect the landing page (https://github.com/cat-mora/cultivating-the-fruit.git) to the app (https://github.com/cat-mora/cultivating-the-fruit-app.git) for seamless payment-to-signup flow.

## Flow Summary
1. User enters email on landing page
2. User completes payment via Stripe
3. Stripe webhook triggers → Generate invite code → Save to Supabase
4. Email sent via Loops with pre-populated signup link
5. User clicks link → App signup page with email/code pre-filled
6. User creates password → Account activated

---

## Environment Variables

### Landing Page (.env)
```env
# Supabase (App's Database)
NEXT_PUBLIC_SUPABASE_URL=https://onwijddzljigbizsnrpo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_... (get from client Stripe account)
STRIPE_WEBHOOK_SECRET=whsec_... (get from Stripe webhook settings)

# Loops (Email)
LOOPS_API_KEY=... (get from client Loops account)

# App URL
NEXT_PUBLIC_APP_URL=https://app.cultivatingthefruits.com
```

**IMPORTANT:** You need to get the `SUPABASE_SERVICE_ROLE_KEY` from your Supabase dashboard:
- Go to: https://supabase.com/dashboard/project/onwijddzljigbizsnrpo/settings/api
- Copy the `service_role` key (NOT the anon key)
- This key has admin privileges to create invite codes

---

## 1. Stripe Webhook Handler (Landing Page)

Create `app/api/webhooks/stripe/route.ts` in your Next.js landing page:

```typescript
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key for admin operations
);

/**
 * Generate a unique 6-character invite code
 * Excludes confusing characters (I, O, 0, 1)
 */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Create invite code in Supabase with retry logic for collisions
 */
async function createInviteCode(email: string): Promise<string | null> {
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = generateInviteCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    const { data, error } = await supabase
      .from('signup_invites')
      .insert({
        invite_code: code,
        created_by: '00000000-0000-0000-0000-000000000000', // System-generated
        expires_at: expiresAt.toISOString(),
        status: 'pending',
      })
      .select()
      .single();

    if (!error) {
      return code;
    }

    // If code collision (unique constraint violation), retry
    if (error.code === '23505') {
      continue;
    }

    // Other error - log and fail
    console.error('Error creating invite code:', error);
    return null;
  }

  console.error('Failed to generate unique code after max attempts');
  return null;
}

/**
 * Send welcome email via Loops
 */
async function sendWelcomeEmail(email: string, inviteCode: string) {
  const appSignupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/(web)/auth/sign-up?email=${encodeURIComponent(email)}&code=${inviteCode}`;

  const response = await fetch('https://app.loops.so/api/v1/transactional', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactionalId: 'your-template-id', // Create this in Loops
      email: email,
      dataVariables: {
        inviteCode: inviteCode,
        signupUrl: appSignupUrl,
      },
    }),
  });

  if (!response.ok) {
    console.error('Failed to send email via Loops:', await response.text());
  }

  return response.ok;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.customer_details?.email;

    if (!email) {
      console.error('No email found in session');
      return NextResponse.json({ error: 'No email' }, { status: 400 });
    }

    console.log('Payment successful for:', email);

    // 1. Create invite code
    const inviteCode = await createInviteCode(email);

    if (!inviteCode) {
      console.error('Failed to create invite code');
      return NextResponse.json({ error: 'Failed to create code' }, { status: 500 });
    }

    console.log('Created invite code:', inviteCode, 'for email:', email);

    // 2. Send welcome email with invite code and signup link
    await sendWelcomeEmail(email, inviteCode);

    console.log('Welcome email sent to:', email);
  }

  return NextResponse.json({ received: true });
}
```

---

## 2. Loops Email Template

Create a transactional email template in Loops with these variables:

### Template Variables:
- `{{inviteCode}}` - The 6-character invite code
- `{{signupUrl}}` - Pre-filled signup URL

### Email Template Example:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #FFF9F0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(107, 45, 62, 0.1);">

    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 32px;">
      <img src="https://your-domain.com/logo.png" alt="Cultivating the Fruit" style="max-width: 200px; height: auto;">
    </div>

    <!-- Heading -->
    <h1 style="color: #6B2D3E; font-size: 28px; margin: 0 0 16px 0; text-align: center;">Welcome to Cultivating the Fruit!</h1>

    <p style="color: #8B6F47; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Thank you for your purchase! You're now ready to begin your journey of renewing love through daily action.
    </p>

    <!-- Invite Code Box -->
    <div style="background: #FFF9F0; border: 2px solid #DEB9C5; border-radius: 12px; padding: 24px; margin: 0 0 24px 0; text-align: center;">
      <p style="color: #6B2D3E; font-size: 14px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">Your Invite Code</p>
      <p style="color: #6B2D3E; font-size: 32px; font-weight: 700; margin: 0; font-family: monospace; letter-spacing: 0.15em;">{{inviteCode}}</p>
    </div>

    <!-- Instructions -->
    <p style="color: #8B6F47; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Click the button below to complete your account setup. Your email and invite code will be automatically filled in - you just need to create a password!
    </p>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 0 0 24px 0;">
      <a href="{{signupUrl}}" style="display: inline-block; background: #6B2D3E; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Complete Your Account</a>
    </div>

    <!-- Alternative Link -->
    <p style="color: #8B6F47; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
      Or copy and paste this link:<br>
      <a href="{{signupUrl}}" style="color: #6B2D3E; word-break: break-all;">{{signupUrl}}</a>
    </p>

    <!-- Footer -->
    <div style="border-top: 1px solid #F5EDE0; padding-top: 24px; margin-top: 32px;">
      <p style="color: #8B6F47; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
        Questions? Reply to this email or visit our support page.
      </p>
    </div>

  </div>
</body>
</html>
```

---

## 3. Stripe Checkout Setup (Landing Page)

Update your Stripe checkout to collect email:

```typescript
// app/api/create-checkout/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: 'price_your_price_id', // Your Stripe price ID
        quantity: 1,
      },
    ],
    mode: 'payment', // or 'subscription' for recurring
    customer_email: email, // Pre-fill email
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  });

  return NextResponse.json({ url: session.url });
}
```

---

## 4. Database Schema (Already Implemented)

The `signup_invites` table in Supabase:

```sql
CREATE TABLE signup_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invite_code VARCHAR(6) NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  used_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired', 'revoked')),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. App Signup Page (Already Updated)

The signup page now accepts URL parameters:
- `/(web)/auth/sign-up?email=user@example.com&code=ABC123`
- Email and invite code fields will be pre-filled
- User only needs to create password

---

## 6. Testing the Flow

### Local Testing:
1. Use Stripe CLI to forward webhooks:
```bash
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

2. Create a test checkout session
3. Complete payment with test card: `4242 4242 4242 4242`
4. Check Stripe CLI for webhook events
5. Verify invite code created in Supabase
6. Check email (if Loops configured)

### Production Deployment:
1. Deploy landing page to Vercel
2. Add webhook endpoint in Stripe Dashboard:
   - URL: `https://your-landing-page.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`
3. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
4. Test with live mode

---

## 7. Supabase RLS Policies

Make sure these policies exist (already implemented):

```sql
-- Allow anyone to validate invite codes (during signup)
CREATE POLICY "Anyone can validate invite codes"
  ON signup_invites FOR SELECT
  USING (true);

-- Allow admins to view all invites
CREATE POLICY "Admins can view all invites"
  ON signup_invites FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Service role bypasses RLS for creating codes
```

---

## 8. Security Considerations

✅ **Service Role Key:** Only use on backend (webhook handler), never in frontend
✅ **Webhook Secret:** Verify all Stripe webhook signatures
✅ **Invite Code Expiry:** Set reasonable expiration (30 days recommended)
✅ **Email Validation:** Ensure email matches between Stripe and signup
✅ **Rate Limiting:** Consider rate limiting webhook endpoint
✅ **HTTPS Only:** All production endpoints must use HTTPS

---

## 9. Monitoring & Debugging

### Check Invite Code Creation:
```sql
SELECT * FROM signup_invites
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### Check for Failed Invites:
```sql
SELECT * FROM signup_invites
WHERE status = 'pending'
  AND expires_at < NOW()
ORDER BY created_at DESC;
```

### Stripe Webhook Logs:
- Check Stripe Dashboard → Developers → Webhooks
- View event logs and retry failed events

### Loops Email Logs:
- Check Loops Dashboard → Emails → Sent
- View delivery status and open rates

---

## 10. Next Steps

- [ ] Get Supabase service role key
- [ ] Create Stripe webhook endpoint in landing page
- [ ] Create Loops email template
- [ ] Configure Stripe webhook in dashboard
- [ ] Test end-to-end flow in development
- [ ] Deploy to production
- [ ] Monitor first few signups

---

## Support

For issues:
- App repo: https://github.com/cat-mora/cultivating-the-fruit-app.git
- Landing page repo: https://github.com/cat-mora/cultivating-the-fruit.git
- Database: Supabase dashboard
- Stripe: Stripe dashboard
- Emails: Loops dashboard
