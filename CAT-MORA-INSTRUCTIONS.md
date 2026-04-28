# Instructions for Cat-Mora: Adding UI to Working Backend

## ✅ GOOD NEWS
The main repository now has ALL the working backend:
- ✅ Admin invite code system
- ✅ Database migrations
- ✅ Supabase configuration
- ✅ Environment variable handling
- ✅ All API/data queries

## 🎯 YOUR TASK
Add your UI improvements WITHOUT breaking the backend.

---

## STEP 1: Fetch the Correct Repository

```bash
# Make sure you're pointing to the right repo
git remote -v
# Should show: origin  https://github.com/cat-mora/cultivating-the-fruit-app.git

# Fetch latest changes
git fetch origin

# Create a new branch from the working main
git checkout -b ui-improvements origin/main
```

---

## STEP 2: Tell Claude What to Do

**Copy and paste this EXACT prompt to Claude:**

```
I need to update ONLY the UI files to add the logo and styling improvements.

CRITICAL RULES:
1. Do NOT modify ANY backend files
2. Do NOT touch database migrations
3. Do NOT change environment config
4. ONLY update the 5 UI files listed below

FILES TO UPDATE (and ONLY these files):

1. app/app/(web)/auth/sign-in.tsx
   - Add full-page layout with logo
   - Use: require('../../../assets/images/logo-full.png')
   - Keep Expo Router (useRouter, not useNavigate)
   - Background: linear-gradient(135deg, #FFF9F0 0%, #F5EDE0 100%)

2. app/app/(web)/auth/sign-up.tsx
   - Same layout as sign-in
   - Logo + tagline + centered white card
   - Keep Expo Router

3. app/app/(web)/dashboard/index.tsx
   - Remove fruit emoji from header (line ~58)
   - Keep everything else the same

4. app/app/onboarding.tsx
   - Remove decorative fruit cluster (lines ~37-41)
   - Remove stream emojis from cards

5. app/global.web.css
   - Update logo-banner styling:
     background: white;
     padding: 16px 20px;
     box-shadow: 0 2px 8px rgba(61, 122, 154, 0.15);
     border-bottom: 3px solid #3D7A9A;

BEFORE making changes:
- Run: git diff origin/main --name-only
- Should show: nothing (clean start)

AFTER making changes:
- Run: git diff origin/main --name-only
- Should show: ONLY the 5 files above
- If you see env.ts, admin-service.ts, or migrations/* - STOP IMMEDIATELY

Then commit and push to THIS branch (ui-improvements), NOT main.
```

---

## STEP 3: Verify Changes

After Claude makes changes:

```bash
# Check what files changed
git diff origin/main --name-only

# Expected output (ONLY these files):
# app/app/(web)/auth/sign-in.tsx
# app/app/(web)/auth/sign-up.tsx
# app/app/(web)/dashboard/index.tsx
# app/app/onboarding.tsx
# app/global.web.css
```

**If you see ANY other files - DO NOT COMMIT!**

---

## STEP 4: Commit and Push

```bash
# Add only the UI files
git add app/app/(web)/auth/sign-in.tsx
git add app/app/(web)/auth/sign-up.tsx
git add app/app/(web)/dashboard/index.tsx
git add app/app/onboarding.tsx
git add app/global.web.css

# Commit
git commit -m "feat: Add logo and clean UI styling

- Replace emoji with actual logo image
- Add tagline: Grow your spiritual life, one day at a time
- Remove fruit emojis from dashboard and onboarding
- Update logo banner styling
- Keep all backend functionality intact"

# Push to your branch
git push origin ui-improvements
```

---

## STEP 5: Create Pull Request

1. Go to: https://github.com/cat-mora/cultivating-the-fruit-app
2. Click "Compare & pull request"
3. Base: main
4. Compare: ui-improvements
5. Title: "Add logo and clean UI styling"
6. Description: "UI-only changes - no backend modifications"
7. Create pull request

---

## 🚨 RED FLAGS - Stop if you see:

- ❌ Changes to `app/lib/env.ts`
- ❌ Changes to `app/lib/supabase/config.ts`
- ❌ Changes to `database/migrations/*`
- ❌ Changes to `app/lib/admin/*`
- ❌ Deleted files (admin-service.ts, invite-code-manager.tsx, etc.)
- ❌ Import changes from `expo-router` to `react-router-dom`

If Claude tries to change ANY of these - say:
> "STOP. Do not modify backend files. Only update the 5 UI files I listed."

---

## Questions?

If Claude gets confused or suggests modifying backend files:
1. Stop immediately
2. Ask it to show you: `git diff origin/main --stat`
3. Verify only UI files are changing
4. If not, reset and start over: `git reset --hard origin/main`

Good luck! 🎉
