-- =====================================================
-- Fix Storage Bucket Policies for Image Uploads
-- Run this in Supabase SQL Editor to enable image uploads
-- =====================================================

-- First, create the images bucket if it doesn't exist
-- NOTE: This needs to be done via Supabase Dashboard or CLI first
-- Go to Storage > New Bucket > Name: "images" > Public: ON

-- =====================================================
-- Storage Policies for the 'images' bucket
-- These policies allow public upload and read access
-- =====================================================

-- Allow anyone to upload files to the images bucket
CREATE POLICY "Allow public uploads to images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow anyone to read files from the images bucket
CREATE POLICY "Allow public read access to images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow anyone to update files in the images bucket
CREATE POLICY "Allow public updates to images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Allow anyone to delete files from the images bucket
CREATE POLICY "Allow public deletes from images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
