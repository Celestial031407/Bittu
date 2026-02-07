# Deploy on Vercel

This guide walks you through deploying the Bittu (Rose Day) site on Vercel.

---

## What you need

- A [Vercel](https://vercel.com) account (free; sign up with GitHub, GitLab, or email)
- Your project in a Git repository (GitHub, GitLab, or Bitbucket), **or** you can deploy by uploading the folder

---

## Option 1: Deploy with GitHub (recommended)

### 1. Put your project in Git

If you haven’t already:

```bash
cd path/to/Bittu
git init
git add .
git commit -m "Initial commit - Rose Day for Bittu"
```

### 2. Push to GitHub

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `bittu-rose-day`).
2. Add the remote and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New…** → **Project**.
3. **Import** your GitHub repo (e.g. `bittu-rose-day`).
4. Leave the defaults:
   - **Framework Preset:** Other (or leave as detected)
   - **Root Directory:** `./`
   - **Build Command:** leave empty (static site)
   - **Output Directory:** leave empty
5. Click **Deploy**.
6. When it’s done, Vercel gives you a URL like `https://your-project.vercel.app`. Open it to see your site.

---

## Option 2: Deploy without Git (Vercel CLI)

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy from the project folder

```bash
cd path/to/Bittu
vercel
```

- Log in or sign up when asked.
- Accept the defaults (link to current directory, no override).
- Vercel will build and give you a live URL.

To deploy again after changes:

```bash
vercel --prod
```

---

## Option 3: Deploy by dragging the folder

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New…** → **Project**.
3. Use the **“Import Third-Party Git Repository”** or **CLI** flow; Vercel doesn’t support true drag-and-drop of a folder in the UI, so for “no Git” the easiest is **Option 2 (CLI)** above.

---

## Project structure Vercel expects

Your project is a static site. As long as these are at the **root** of what you deploy, Vercel will serve them correctly:

- `index.html`
- `style.css`
- Any other assets (e.g. images, `song.mp3` if you add it)

No build step is required. Vercel will serve `index.html` at the root URL.

---

## After deployment

- **URL:** Your site will be at `https://<project-name>.vercel.app`.
- **Custom domain:** In the project dashboard, go to **Settings → Domains** and add your domain.
- **Updates:** Push to GitHub (Option 1) or run `vercel --prod` again (Option 2) to update the live site.

---

## Troubleshooting

| Issue | What to do |
|--------|------------|
| 404 on the site | Ensure `index.html` is in the root of the repo (or the Root Directory you set in Vercel). |
| CSS not loading | Check that `style.css` is in the same folder as `index.html` and that the link in `index.html` is `href="./style.css"`. |
| Audio not playing | Host the audio file (e.g. `song.mp3`) in the same project or use a public URL; some browsers block autoplay. |

You’re done. Your Rose Day page for Bittu is live on Vercel.
