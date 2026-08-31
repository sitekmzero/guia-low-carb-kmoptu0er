-- Add published_date and reading_time_minutes to public.blog_posts if not exists
-- and backfill published_date from created_at where null.

ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS published_date TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER DEFAULT 0;

UPDATE public.blog_posts
SET published_date = COALESCE(created_at, NOW())
WHERE published_date IS NULL;
