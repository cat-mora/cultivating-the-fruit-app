# Instructions for Cat-Mora: Merging Your UI to Working Backend

## ✅ GOOD NEWS
The main repository now has ALL the working backend:
- ✅ Admin invite code system
- ✅ Database migrations
- ✅ Supabase configuration
- ✅ Environment variable handling
- ✅ All API/data queries

## 🎯 YOUR TASK
Copy your UI files from your fork to the main branch WITHOUT breaking the backend.

---

## STEP 1: Setup

**Copy and paste this to Claude:**

```
I need to merge UI files from my fork to the main repository.

SETUP:
1. Make sure I'm in the correct directory
2. Check current remotes: git remote -v
3. Add my fork as a remote if not already added:
   git remote add my-fork https://github.com/cat-mora/cultivating-the-fruit-app.git
   (or whatever my fork URL is)
4. Fetch from both:
   git fetch origin
   git fetch my-fork
5. Create a new branch from the working main:
   git checkout -b ui-merge origin/main
```

---

## STEP 2: Cherry-Pick Your UI Files

**Copy and paste this EXACT prompt to Claude:**

```
I need to copy SPECIFIC UI files from my fork to this branch.

MY FORK INFO:
- Fork remote name: my-fork
- Commit with working UI: 2658bb5 (or latest commit from my fork)

FILES TO COPY FROM MY FORK (and ONLY these):
1. app/app/(web)/auth/sign-in.tsx
2. app/app/(web)/auth/sign-up.tsx
3. app/app/(web)/layouts/auth-layout.tsx
4. app/app/(web)/dashboard/index.tsx
5. app/app/onboarding.tsx
6. app/global.web.css

IMPORTANT RULES:
- ONLY copy these 6 files
- Do NOT copy: env.ts, admin files, database files, or any backend code
- After copying, MUST convert react-router-dom to expo-router if needed

STEPS:
1. For EACH file above, run:
   git show my-fork/main:path/to/file > path/to/file

   Example:
   git show my-fork/main:app/app/(web)/auth/sign-in.tsx > app/app/(web)/auth/sign-in.tsx

2. After copying ALL 6 files, check what we got:
   git diff origin/main --name-only

3. CRITICAL: If the files use react-router-dom, convert to expo-router:
   - Change: import { useNavigate } from 'react-router-dom'
   - To: import { useRouter } from 'expo-router'
   - Change: const navigate = useNavigate()
   - To: const router = useRouter()
   - Change: navigate('/path')
   - To: router.replace('/path') or router.push('/path')
   - Change: <Link to="/path">
   - To: <Link href="/path">

4. Verify ONLY these 6 files changed:
   git status

5. If you see ANY other files (especially env.ts, migrations, admin files):
   STOP and tell me immediately!
```

---

## STEP 3: Verify No Backend Changes

**Tell Claude:**

```
Show me what files changed:
git diff origin/main --name-status

Expected output should ONLY show:
M       app/app/(web)/auth/sign-in.tsx
M       app/app/(web)/auth/sign-up.tsx
M       app/app/(web)/layouts/auth-layout.tsx
M       app/app/(web)/dashboard/index.tsx
M       app/app/onboarding.tsx
M       app/global.web.css

If you see:
- D (deleted files) - STOP! We're deleting something
- Changes to app/lib/* - STOP! We're modifying backend
- Changes to database/* - STOP! We're touching migrations

If everything looks good, show me a summary:
git diff origin/main --stat
```

---

## STEP 4: Test the Changes

**Tell Claude:**

```
Before committing, let's verify the auth files work with expo-router:

1. Check app/app/(web)/auth/sign-in.tsx:
   - Should import from 'expo-router' NOT 'react-router-dom'
   - Should use useRouter() not useNavigate()
   - Should use <Link href="..."> not <Link to="...">

2. Check app/app/(web)/auth/sign-up.tsx:
   - Same as above

3. Check app/app/(web)/layouts/auth-layout.tsx:
   - Should use require() for logo image
   - Should NOT use <Outlet> from react-router-dom
   - Should render children directly for expo-router

If any files still have react-router-dom imports, fix them now.
```

---

## STEP 5: Commit and Push

**Tell Claude:**

```
Everything looks good! Now commit and push:

git add app/app/(web)/auth/sign-in.tsx
git add app/app/(web)/auth/sign-up.tsx
git add app/app/(web)/layouts/auth-layout.tsx
git add app/app/(web)/dashboard/index.tsx
git add app/app/onboarding.tsx
git add app/global.web.css

git commit -m "feat: Merge UI improvements from fork

- Add logo image to auth screens
- Remove fruit emojis from UI
- Update auth layout with tagline
- Clean dashboard and onboarding styling
- Convert react-router to expo-router where needed
- Keep all backend functionality intact"

git push origin ui-merge
```

---

## STEP 6: Create Pull Request

1. Go to: https://github.com/cat-mora/cultivating-the-fruit-app
2. You should see: "Compare & pull request" for `ui-merge` branch
3. Click it
4. Verify the "Files changed" tab shows ONLY the 6 UI files
5. Title: "Merge UI improvements from fork"
6. Create pull request

---

## 🚨 RED FLAGS - Stop Immediately If:

- ❌ Files being deleted (shows as `D` in git status)
- ❌ Changes to `app/lib/env.ts`
- ❌ Changes to `app/lib/supabase/config.ts`
- ❌ Changes to `database/migrations/*`
- ❌ Changes to `app/lib/admin/*`
- ❌ Any file in `app/features/admin/`
- ❌ More than 6 files changed

**If you see any of these, run:**
```bash
git reset --hard origin/main
```
And start over.

---

## Alternative: If You Can't Access Your Fork

If you can't fetch from your fork, manually copy the UI files:

```
I'll manually update these 6 files with my UI design:

1. app/app/(web)/auth/sign-in.tsx
   - Add full-page layout with logo
   - Use: require('../../../assets/images/logo-full.png')
   - Gradient background: linear-gradient(135deg, #FFF9F0 0%, #F5EDE0 100%)
   - Centered white card with form
   - Tagline: "Grow your spiritual life, one day at a time"

2. app/app/(web)/auth/sign-up.tsx
   - Same layout as sign-in

3. app/app/(web)/layouts/auth-layout.tsx
   - Replace emoji with logo image
   - Add tagline below logo

4. app/app/(web)/dashboard/index.tsx
   - Remove fruit emoji from header

5. app/app/onboarding.tsx
   - Remove fruit emoji cluster
   - Remove stream emojis

6. app/global.web.css
   - Update .logo-banner with:
     background: white;
     padding: 16px 20px;
     box-shadow: 0 2px 8px rgba(61, 122, 154, 0.15);
     border-bottom: 3px solid #3D7A9A;

Make these changes ONLY to these files.
```

---

## Questions?

If something goes wrong:
1. `git status` - see what's changed
2. `git diff origin/main --name-only` - list changed files
3. `git reset --hard origin/main` - start over if needed

Good luck! 🚀
