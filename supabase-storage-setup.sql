-- =============================================================
-- Supabase Storage Setup: pet-images & avatars buckets
-- รันใน Supabase Dashboard > SQL Editor
-- =============================================================

-- 1. สร้าง Storage Buckets
-- ---------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('pet-images', 'pet-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. RLS Policies สำหรับ pet-images bucket
-- ---------------------------------------------------------

-- ทุกคนสามารถดูรูปได้ (public read)
CREATE POLICY "Public read pet-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pet-images');

-- Authenticated users สามารถอัพโหลดรูปใน folder ของตัวเอง
CREATE POLICY "Auth users upload pet-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pet-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users สามารถแก้ไข/อัพเดทรูปของตัวเอง
CREATE POLICY "Auth users update pet-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pet-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users สามารถลบรูปของตัวเอง
CREATE POLICY "Auth users delete pet-images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'pet-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. RLS Policies สำหรับ avatars bucket
-- ---------------------------------------------------------

-- ทุกคนสามารถดู avatar ได้ (public read)
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Authenticated users สามารถอัพโหลด avatar ใน folder ของตัวเอง
CREATE POLICY "Auth users upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users สามารถแก้ไข/อัพเดท avatar ของตัวเอง
CREATE POLICY "Auth users update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users สามารถลบ avatar ของตัวเอง
CREATE POLICY "Auth users delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
