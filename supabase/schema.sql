-- Astrology Website Schema (run in Supabase SQL Editor)
-- Enable extensions
create extension if not exists "pgcrypto";

-- Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_hi text not null,
  description_en text not null,
  description_hi text not null,
  price numeric default 0,
  duration_minutes int default 30,
  icon text default 'Compass',
  order_index int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- Blog posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_hi text not null,
  content_en text not null default '',
  content_hi text not null default '',
  category_en text default 'Article',
  category_hi text default 'लेख',
  image_url text,
  video_url text,
  type text default 'blog',
  published boolean default true,
  created_at timestamptz default now()
);

-- Gallery items
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  type text default 'image',
  url text not null,
  caption_en text default '',
  caption_hi text default '',
  created_at timestamptz default now()
);

-- Testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text default '',
  content_en text not null,
  content_hi text not null,
  rating int default 5,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Bookings
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  dob date,
  tob time,
  pob text,
  concern text,
  service_id uuid references public.services(id),
  service_title text,
  amount numeric default 0,
  currency text default 'INR',
  payment_status text default 'pending',
  payment_id text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Kundli leads
create table if not exists public.kundli_logs (
  id uuid primary key default gen_random_uuid(),
  name text,
  dob date not null,
  tob time,
  pob text,
  result jsonb,
  created_at timestamptz default now()
);

-- Contact messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  message text not null,
  created_at timestamptz default now()
);

-- Daily horoscope content
create table if not exists public.horoscopes (
  id uuid primary key default gen_random_uuid(),
  rashi text not null,
  period text default 'daily',
  text_en text not null,
  text_hi text not null,
  for_date date default current_date,
  created_at timestamptz default now(),
  unique (rashi, period, for_date)
);

-- RLS: public read, authenticated write
alter table public.services enable row level security;
alter table public.blog_posts enable row level security;
alter table public.gallery_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.bookings enable row level security;
alter table public.kundli_logs enable row level security;
alter table public.contact_messages enable row level security;
alter table public.horoscopes enable row level security;

-- Public read policies
drop policy if exists "services public read" on public.services;
create policy "services public read" on public.services
  for select using (true);
drop policy if exists "blog public read" on public.blog_posts;
create policy "blog public read" on public.blog_posts
  for select using (published = true);
drop policy if exists "gallery public read" on public.gallery_items;
create policy "gallery public read" on public.gallery_items
  for select using (true);
drop policy if exists "testimonials public read" on public.testimonials;
create policy "testimonials public read" on public.testimonials
  for select using (active = true);
drop policy if exists "horoscopes public read" on public.horoscopes;
create policy "horoscopes public read" on public.horoscopes
  for select using (true);

-- Authenticated write policies (admin)
drop policy if exists "admin insert" on public.services;
create policy "admin insert" on public.services for insert with check (auth.role() = 'authenticated');
drop policy if exists "admin update" on public.services;
create policy "admin update" on public.services for update using (auth.role() = 'authenticated');
drop policy if exists "admin delete" on public.services;
create policy "admin delete" on public.services for delete using (auth.role() = 'authenticated');

-- Admin (authenticated) can read all records including unpublished/drafts
drop policy if exists "blog admin read" on public.blog_posts;
create policy "blog admin read" on public.blog_posts
  for select using (auth.role() = 'authenticated');

drop policy if exists "admin insert" on public.blog_posts;
create policy "admin insert" on public.blog_posts for insert with check (auth.role() = 'authenticated');
drop policy if exists "admin update" on public.blog_posts;
create policy "admin update" on public.blog_posts for update using (auth.role() = 'authenticated');
drop policy if exists "admin delete" on public.blog_posts;
create policy "admin delete" on public.blog_posts for delete using (auth.role() = 'authenticated');

drop policy if exists "admin insert" on public.gallery_items;
create policy "admin insert" on public.gallery_items for insert with check (auth.role() = 'authenticated');
drop policy if exists "admin update" on public.gallery_items;
create policy "admin update" on public.gallery_items for update using (auth.role() = 'authenticated');
drop policy if exists "admin delete" on public.gallery_items;
create policy "admin delete" on public.gallery_items for delete using (auth.role() = 'authenticated');

drop policy if exists "admin insert" on public.testimonials;
create policy "admin insert" on public.testimonials for insert with check (auth.role() = 'authenticated');
drop policy if exists "admin update" on public.testimonials;
create policy "admin update" on public.testimonials for update using (auth.role() = 'authenticated');
drop policy if exists "admin delete" on public.testimonials;
create policy "admin delete" on public.testimonials for delete using (auth.role() = 'authenticated');

-- Bookings: authenticated can insert (public form), admin can read/update/delete
drop policy if exists "bookings insert" on public.bookings;
create policy "bookings insert" on public.bookings for insert with check (true);
drop policy if exists "bookings admin read" on public.bookings;
create policy "bookings admin read" on public.bookings for select using (auth.role() = 'authenticated');
drop policy if exists "bookings admin update" on public.bookings;
create policy "bookings admin update" on public.bookings for update using (auth.role() = 'authenticated');
drop policy if exists "bookings admin delete" on public.bookings;
create policy "bookings admin delete" on public.bookings for delete using (auth.role() = 'authenticated');

-- Kundli leads: public insert, admin read
drop policy if exists "kundli insert" on public.kundli_logs;
create policy "kundli insert" on public.kundli_logs for insert with check (true);
drop policy if exists "kundli admin read" on public.kundli_logs;
create policy "kundli admin read" on public.kundli_logs for select using (auth.role() = 'authenticated');

-- Contact messages: public insert, admin read
drop policy if exists "contact insert" on public.contact_messages;
create policy "contact insert" on public.contact_messages for insert with check (true);
drop policy if exists "contact admin read" on public.contact_messages;
create policy "contact admin read" on public.contact_messages for select using (auth.role() = 'authenticated');

drop policy if exists "horoscopes admin write" on public.horoscopes;
create policy "horoscopes admin write" on public.horoscopes for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE: run this AFTER creating a public bucket named "media"
-- (Dashboard > Storage > New bucket > "media" > Public)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media auth insert" on storage.objects;
create policy "media auth insert" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "media auth delete" on storage.objects;
create policy "media auth delete" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "media auth update" on storage.objects;
create policy "media auth update" on storage.objects
  for update using (bucket_id = 'media' and auth.role() = 'authenticated');

-- Seed services
insert into public.services (title_en, title_hi, description_en, description_hi, price, duration_minutes, icon, order_index) values
('Birth Chart Analysis', 'जन्म कुंडली विश्लेषण', 'A deep dive into your unique cosmic blueprint at the moment of your birth.', 'आपके जन्म के समय की अद्वितीय ब्रह्मांडीय संरचना का गहन विश्लेषण।', 2100, 45, 'Compass', 1),
('Relationship Compatibility', 'संबंध अनुकूलता', 'Understand the celestial dynamics between you and your partner.', 'आप और आपके साथी के बीच ब्रह्मांडीय गतिशीलता को समझें।', 1800, 30, 'Heart', 2),
('Career Guidance', 'करियर मार्गदर्शन', 'Align your professional path with your natural talents and cosmic timing.', 'अपने पेशेवर मार्ग को अपनी प्राकृतिक प्रतिभा और ब्रह्मांडीय समय के साथ संरेखित करें।', 1800, 30, 'Briefcase', 3),
('Yearly Forecast', 'वार्षिक भविष्यवाणी', 'Prepare for the opportunities and challenges the coming year holds for you.', 'आने वाले वर्ष के अवसरों और चुनौतियों के लिए तैयार रहें।', 2500, 45, 'Sun', 4),
('Spiritual Healing', 'आध्यात्मिक उपचार', 'Remedies and rituals to balance your planetary energies and find inner peace.', 'ग्रहों की ऊर्जा संतुलित करने और आंतरिक शांति पाने के उपाय और अनुष्ठान।', 1500, 30, 'Moon', 5),
('Vastu Consultation', 'वास्तु परामर्श', 'Harmonize your living and working spaces with universal energies.', 'अपने रहने और काम करने के स्थानों को सार्वभौमिक ऊर्जा के साथ सामंजस्य बनाएं।', 2000, 45, 'Shield', 6)
on conflict do nothing;

-- Seed testimonials
insert into public.testimonials (name, role, content_en, content_hi, rating) values
('Sarah Jenkins', 'Entrepreneur', 'Dhiraj''s reading was incredibly accurate. He helped me understand why I was facing certain blocks in my business and gave me the confidence to pivot at the right time.', 'धीरज की रीडिंग अविश्वसनीय रूप से सटीक थी। उन्होंने मुझे समझने में मदद की कि मेरे व्यवसाय में कुछ बाधाएं क्यों थीं और सही समय पर बदलाव करने का आत्मविश्वास दिया।', 5),
('Michael Chen', 'Software Engineer', 'I was skeptical at first, but the yearly forecast was spot on. The timing of major life events he predicted was uncanny.', 'मैं पहले संशय में था, लेकिन वार्षिक भविष्यवाणी बिल्कुल सटीक थी। प्रमुख जीवन घटनाओं का समय अद्भुत था।', 5),
('Elena Rodriguez', 'Artist', 'The spiritual healing session was transformative. I feel more aligned and at peace than I have in years.', 'आध्यात्मिक उपचार सत्र परिवर्तनकारी था। मैं वर्षों से अधिक संतुलित और शांत महसूस कर रही हूं।', 5)
on conflict do nothing;
