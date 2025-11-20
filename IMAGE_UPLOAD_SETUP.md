# Image Upload Setup for Sterilization Feature

The sterilization feature uses **ImgBB** (a free image hosting service) to upload animal photos.

## Setup Instructions

### 1. Get Your Free ImgBB API Key

1. Go to [https://api.imgbb.com/](https://api.imgbb.com/)
2. Click "Get API Key"
3. Sign up or log in
4. Copy your API key

### 2. Configure the Frontend

1. In the `frontend` directory, create a `.env` file:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Open `.env` and add your ImgBB API key:
   ```
   VITE_IMGBB_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## How It Works

- When users click "Report Stray", they can upload a photo of the animal
- The image is uploaded to ImgBB and a permanent URL is returned
- This URL is stored in the database (instead of base64 data)
- This prevents "413 Payload Too Large" errors

## Free Tier Limits

- **5,000 uploads per month** (free tier)
- **32 MB** maximum file size
- Images are hosted permanently

## Alternative: Use Adoption Page Approach

If you prefer to use the same approach as the adoption page (base64 encoding), you'll need to:

1. Increase the Express body parser limit in `backend/ts/src/index.ts`:
   ```typescript
   app.use(express.json({ limit: '50mb' }));
   app.use(express.urlencoded({ limit: '50mb', extended: true }));
   ```

2. Update MongoDB connection to allow larger documents

However, ImgBB is recommended as it's more scalable and doesn't bloat your database.
