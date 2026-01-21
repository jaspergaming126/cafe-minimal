# Deployment Guide (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com), which natively supports Vite applications.

## Prerequisites

1.  A Vercel account.
2.  Methods to access your **Supabase** URL and Anon Key.

## Steps to Deploy

1.  **Import to Vercel**:
    *   Log in to your Vercel Dashboard.
    *   Click **"Add New..."** > **"Project"**.
    *   Select your GitHub repository (`cafe-minimal`).

2.  **Configure Project**:
    *   **Framework Preset**: Ensure `Vite` is selected (Vercel usually detects this automatically).
    *   **Root Directory**: Leave as `./` (default).
    *   **Build Command**: `vite build` or `npm run build` (default).
    *   **Output Directory**: `dist` (default).

3.  **Environment Variables**:
    *   Expand the **"Environment Variables"** section.
    *   Add the following keys from your local `.env` or Supabase project:
        *   `VITE_SUPABASE_URL`: Your Supabase Project URL.
        *   `VITE_SUPABASE_ANON_KEY`: Your Supabase Anonymous API Key.
    *   *(Optional)* `GEMINI_API_KEY`: If you are using any AI features.

4.  **Deploy**:
    *   Click **"Deploy"**.
    *   Wait for the build to complete.

5.  **Accessing the App**:
    *   **Main Site**: `https://your-project.vercel.app/`
    *   **Admin Panel**: `https://your-project.vercel.app/admin/`

## Admin Panel Note

The Admin Panel is located at `/admin`. When navigating there, you will see the login screen.
ensure you bookmark `.../admin/` (with or without the trailing slash works on Vercel).
