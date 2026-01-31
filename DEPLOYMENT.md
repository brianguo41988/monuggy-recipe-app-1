# Recipe App - Deployment Guide

## 🚀 Quick Deploy (No Downloads Required)

### Step 1: Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in:
   - Name: `recipe-app`
   - Database Password: (save this somewhere)
   - Region: Choose closest to you
4. Wait 2 minutes for project to set up

#### Create Database Table:
1. In Supabase, go to "Table Editor" (left sidebar)
2. Click "Create a new table"
3. Name it: `recipes`
4. Add these columns:
   - `id` (uuid, default: gen_random_uuid(), primary key) - auto-created
   - `created_at` (timestamptz, default: now()) - auto-created
   - `title` (text, required)
   - `description` (text)
   - `ingredients` (text, required)
   - `instructions` (text, required)
   - `image_url` (text)
5. Disable RLS (Row Level Security) for now:
   - Click the table name
   - Go to "RLS disabled" warning
   - Click "Disable RLS" (we'll secure it later if needed)

#### Create Storage Bucket:
1. Go to "Storage" (left sidebar)
2. Click "New bucket"
3. Name: `recipe-images`
4. Make it Public: Toggle "Public bucket" ON
5. Click "Create bucket"
6. Click the bucket name
7. Click "Policies" tab
8. Click "New Policy"
9. Choose "Allow all operations" template
10. Click "Review" then "Save policy"

#### Get Your API Keys:
1. Go to "Project Settings" (gear icon, left sidebar)
2. Click "API" in the left menu
3. Copy these TWO values (you'll need them soon):
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - `anon` `public` key (long string)

---

### Step 2: Deploy to Vercel (10 minutes)

#### A. Create GitHub Repository (using web browser only):

1. Go to [github.com](https://github.com) (create account if needed)
2. Click the "+" icon (top right) → "New repository"
3. Name: `recipe-app`
4. Choose "Public" or "Private"
5. Click "Create repository"

#### B. Upload Your Code:

1. On the empty repo page, click "uploading an existing file"
2. Drag ALL the files from your recipe-app folder:
   - `package.json`
   - `next.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `tsconfig.json`
   - `.env.local.example`
   - Entire `app` folder
   - Entire `lib` folder
3. Add commit message: "Initial commit"
4. Click "Commit changes"

#### C. Deploy on Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Find your `recipe-app` repo and click "Import"
5. **IMPORTANT - Add Environment Variables:**
   - Click "Environment Variables"
   - Add: `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL
   - Add: `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click "Deploy"
7. Wait 2-3 minutes
8. Click "Visit" to see your live app! 🎉

---

## 📝 Using Your App

1. Click "New Recipe" button
2. Fill in title, description, ingredients, instructions
3. Upload an image
4. Click "Save Recipe"
5. Your recipe appears on the homepage!

---

## 🛠 Optional: Local Development

If you want to edit the code locally later:

### Install Tools:
1. Download [VS Code](https://code.visualstudio.com)
2. Download [Node.js](https://nodejs.org) (LTS version)

### Clone & Run:
```bash
# Open Terminal/Command Prompt
git clone https://github.com/YOUR-USERNAME/recipe-app.git
cd recipe-app
npm install

# Create .env.local file and add:
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Run locally
npm run dev
```

Visit `http://localhost:3000`

---

## 🔧 Updating Your Live Site

When you make changes locally:
```bash
git add .
git commit -m "description of changes"
git push
```

Vercel automatically redeploys! ✨

---

## 🎨 Customization Ideas

- Change colors in `app/globals.css` (look for `:root` variables)
- Add categories/tags to recipes
- Add search functionality
- Add recipe ratings
- Add cooking time field
- Add serving size
- Add print functionality

---

## 🐛 Troubleshooting

**Images not showing?**
- Update `next.config.js` with your actual Supabase URL:
  ```js
  domains: ['xxxxx.supabase.co']
  ```
  Replace `xxxxx` with your project ID from Supabase

**Can't add recipes?**
- Make sure RLS is disabled on the `recipes` table
- Check storage bucket is public
- Verify environment variables in Vercel

**Build errors?**
- Check all files were uploaded to GitHub
- Verify environment variables are set in Vercel

---

## 📚 Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Hosting**: Vercel

---

## 🔐 Security Note

For production use, you should:
1. Enable RLS (Row Level Security) on Supabase
2. Add authentication
3. Set up proper access policies

For personal use/learning, current setup is fine!

---

**You're all set! Your recipe app is live and ready to use! 🎉**
