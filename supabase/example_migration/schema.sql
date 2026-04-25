DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO anon; GRANT ALL ON SCHEMA public TO authenticated; GRANT ALL ON SCHEMA public TO service_role;
-- ============================================================
-- PROFILES (extends auth.users — role management)
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null,
  role        text not null default 'WRITER' check (role in ('ADMIN','MANAGER','WRITER')),
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'WRITER')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS: users can read their own profile; admins can read all
alter table public.profiles enable row level security;
create policy "Users read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Admins read all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
  );
create policy "Admins update any profile" on public.profiles
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
  );

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
create table public.team_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  position      text not null,
  bio           text,
  photo_url     text,                   -- Cloudinary URL
  tenure        text not null,          -- e.g. "2025", "2024"
  joined_date   date not null,
  farewell_date date,                   -- null = current member
  social_links  jsonb default '{}',     -- { linkedin, twitter, email, github }
  display_order int default 0,
  is_active     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.team_members enable row level security;
create policy "Public read team" on public.team_members for select using (true);
create policy "Admin/Manager manage team" on public.team_members
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER'))
  );

-- ============================================================
-- EVENTS
-- ============================================================
create table public.events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique not null,
  description  text,                    -- Rich text HTML
  location     text,
  start_date   timestamptz not null,
  end_date     timestamptz,
  cover_url    text,                    -- Cloudinary URL
  gallery_urls jsonb default '[]',      -- Array of Cloudinary URLs
  status       text default 'DRAFT' check (status in ('DRAFT','PUBLISHED','ARCHIVED')),
  created_by   uuid references public.profiles(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.events enable row level security;
create policy "Public read published events" on public.events
  for select using (status = 'PUBLISHED');
create policy "Admin/Manager see all events" on public.events
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER'))
  );
create policy "Admin/Manager manage events" on public.events
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER'))
  );

-- ============================================================
-- PROGRAMS
-- ============================================================
create table public.programs (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  tagline      text,
  description  text,                    -- Rich text HTML
  cover_url    text,                    -- Cloudinary URL
  tags         text[] default '{}',
  status       text default 'ACTIVE' check (status in ('ACTIVE','INACTIVE')),
  display_order int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.programs enable row level security;
create policy "Public read active programs" on public.programs
  for select using (status = 'ACTIVE');
create policy "Admin/Manager manage programs" on public.programs
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER'))
  );

-- ============================================================
-- CONTENT (Articles, Problems, Blog posts)
-- ============================================================
create table public.content (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text unique not null,
  type            text not null check (type in ('ARTICLE','PROBLEM','BLOG','RESOURCE')),
  content_type    text not null check (content_type in ('RICHTEXT','PDF')),
  body            text,                  -- Rich text HTML (if content_type = RICHTEXT)
  pdf_url         text,                  -- Cloudinary URL (if content_type = PDF)
  pdf_filename    text,                  -- Display name for the PDF
  excerpt         text,
  cover_url       text,                  -- Cloudinary URL
  tags            text[] default '{}',
  author_name     text,
  status          text default 'DRAFT' check (status in ('DRAFT','PUBLISHED','ARCHIVED')),
  submitted_by    uuid references public.profiles(id),
  published_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.content enable row level security;
create policy "Public read published content" on public.content
  for select using (status = 'PUBLISHED');
create policy "Admin/Manager see all content" on public.content
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER','WRITER'))
  );
create policy "Writers can insert content" on public.content
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER','WRITER'))
  );
create policy "Writers edit own content" on public.content
  for update using (submitted_by = auth.uid() and status = 'DRAFT');
create policy "Admin/Manager publish/edit any" on public.content
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER'))
  );

-- ============================================================
-- GALLERY
-- ============================================================
create table public.gallery (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,            -- Cloudinary URL
  thumbnail_url text,                   -- Cloudinary thumbnail variant
  caption     text,
  album       text,                     -- e.g. "JMOC 2024", "MINspire 2025"
  event_id    uuid references public.events(id) on delete set null,
  taken_at    date,
  display_order int default 0,
  created_at  timestamptz default now()
);

alter table public.gallery enable row level security;
create policy "Public read gallery" on public.gallery for select using (true);
create policy "Admin/Manager manage gallery" on public.gallery
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER'))
  );

-- ============================================================
-- CERTIFICATES
-- ============================================================
create table public.certificates (
  id              uuid primary key default gen_random_uuid(),
  cert_uuid       uuid unique default gen_random_uuid(),  -- public verification ID
  recipient_name  text not null,
  recipient_email text,
  program_name    text not null,
  event_name      text,
  issued_date     date not null default current_date,
  pdf_url         text,                  -- Vercel Blob URL
  issued_by       uuid references public.profiles(id),
  is_valid        boolean default true,
  created_at      timestamptz default now()
);

alter table public.certificates enable row level security;
create policy "Public verify certificate by uuid" on public.certificates
  for select using (true);  -- verification page reads by cert_uuid
create policy "Admin/Manager issue certs" on public.certificates
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER'))
  );

-- ============================================================
-- POPUP NOTICES
-- ============================================================
create table public.popup_notices (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text not null,
  cta_text    text,
  cta_url     text,
  starts_at   timestamptz,
  ends_at     timestamptz,
  is_active   boolean default true,
  target_pages text[] default '{}',     -- empty = all pages; or ['/events','/join']
  created_at  timestamptz default now()
);

alter table public.popup_notices enable row level security;
create policy "Public read active notices" on public.popup_notices
  for select using (is_active = true);
create policy "Admin manage notices" on public.popup_notices
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
  );

-- ============================================================
-- JOIN APPLICATIONS
-- ============================================================
create table public.join_applications (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  role_type   text not null,            -- "Volunteer","Collaborator","Member","Other"
  motivation  text not null,
  experience  text,
  status      text default 'PENDING' check (status in ('PENDING','REVIEWED','ACCEPTED','REJECTED')),
  notes       text,                     -- Admin internal notes
  created_at  timestamptz default now()
);

alter table public.join_applications enable row level security;
create policy "Anyone can submit application" on public.join_applications
  for insert with check (true);
create policy "Admin/Manager view applications" on public.join_applications
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER'))
  );
create policy "Admin/Manager update application status" on public.join_applications
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER'))
  );

-- ============================================================
-- AUDIT LOG (who did what, when)
-- ============================================================
create table public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references public.profiles(id),
  actor_name  text,
  action      text not null,            -- e.g. "PUBLISHED_EVENT", "ISSUED_CERTIFICATE"
  entity_type text,                     -- e.g. "events", "certificates"
  entity_id   uuid,
  meta        jsonb default '{}',
  created_at  timestamptz default now()
);

alter table public.audit_log enable row level security;
create policy "Admin read audit log" on public.audit_log
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
  );
create policy "System can insert audit log" on public.audit_log
  for insert with check (true);

-- ============================================================
-- SITE STATS (manually updated by Admin)
-- ============================================================
create table public.site_stats (
  id          int primary key default 1 check (id = 1),  -- singleton row
  students_reached int default 1400,
  volunteers_count int default 50,
  programs_count   int default 15,
  years_of_impact  int default 5,
  updated_at  timestamptz default now()
);

alter table public.site_stats enable row level security;
create policy "Public read stats" on public.site_stats for select using (true);
create policy "Admin update stats" on public.site_stats
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
  );

-- Insert singleton
insert into public.site_stats (id) values (1) on conflict do nothing;

-- ============================================================
-- SUBMIT CONTENT (public submissions, pending review)
-- ============================================================
create table public.content_submissions (
  id            uuid primary key default gen_random_uuid(),
  submitter_name text not null,
  submitter_email text not null,
  title         text not null,
  type          text not null,
  content_type  text not null check (content_type in ('RICHTEXT','PDF')),
  body          text,
  pdf_url       text,
  pdf_filename  text,
  status        text default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')),
  reviewer_id   uuid references public.profiles(id),
  reviewed_at   timestamptz,
  created_at    timestamptz default now()
);

alter table public.content_submissions enable row level security;
create policy "Anyone can submit" on public.content_submissions
  for insert with check (true);
create policy "Admin/Manager review submissions" on public.content_submissions
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER'))
  );
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE public.content_submissions ADD COLUMN IF NOT EXISTS notes text;
-- Add delete policies for content and team members
CREATE POLICY "Admin/Manager delete content" ON public.content
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN','MANAGER'))
  );

CREATE POLICY "Admin/Manager delete team members" ON public.team_members
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN','MANAGER'))
  );
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_type text DEFAULT 'EVENT' CHECK (event_type IN ('RECURRING', 'EVERGOING', 'SPECIAL', 'EVENT'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS action_link text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS youtube_playlist text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- We'll try to update admin if it exists
UPDATE public.profiles SET username = 'minion' WHERE role = 'ADMIN';

-- 20260409160000_refactor_join_applications.sql
-- Refactor join_applications to support dynamic form schemas

ALTER TABLE public.join_applications 
  RENAME COLUMN role_type TO type;

ALTER TABLE public.join_applications 
  ADD COLUMN IF NOT EXISTS form_data jsonb DEFAULT '{}';

-- Optional: Move old motivation/experience into form_data if they exist
UPDATE public.join_applications
SET form_data = jsonb_build_object(
  'motivation', motivation,
  'experience', experience
)
WHERE form_data = '{}' AND motivation IS NOT NULL;

-- Keep motivation/experience columns for now but make them nullable
ALTER TABLE public.join_applications ALTER COLUMN motivation DROP NOT NULL;
-- Update content_submissions to allow 'LINK' content type
ALTER TABLE public.content_submissions 
DROP CONSTRAINT content_submissions_content_type_check;

ALTER TABLE public.content_submissions 
ADD CONSTRAINT content_submissions_content_type_check 
CHECK (content_type IN ('RICHTEXT', 'PDF', 'LINK'));

-- Also update the main content table to support link types
ALTER TABLE public.content 
DROP CONSTRAINT content_content_type_check;

ALTER TABLE public.content 
ADD CONSTRAINT content_content_type_check 
CHECK (content_type IN ('RICHTEXT', 'PDF', 'LINK'));
-- 20260411101800_add_event_display_options.sql
-- Add display options and action text to events table

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS show_date boolean DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS show_action_link boolean DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS show_youtube_playlist boolean DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS action_text text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS youtube_url text;
-- 20260411163800_add_youtube_title_to_events.sql
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS youtube_title text DEFAULT 'Event Recordings';
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    linkedin_url TEXT,
    contact_email TEXT DEFAULT 'contact@mathsinitiatives.org.np',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default settings
INSERT INTO site_settings (id, facebook_url, instagram_url, youtube_url, linkedin_url)
VALUES (
    'main', 
    'https://facebook.com/mathsinitiatives', 
    'https://instagram.com/mathsinitiatives', 
    'https://youtube.com/@mathsinitiatives', 
    'https://linkedin.com/company/mathsinitiatives'
) ON CONFLICT (id) DO NOTHING;

-- Create timeline_events table
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert initial timeline events
INSERT INTO timeline_events (year, title, description, sort_order) VALUES
('2020', 'The Beginning', 'MIN was founded by a group of passionate mathematics educators in Kathmandu.', 1),
('2021', 'First JMOC', 'The Junior Mathematics Olympiad Camp was launched, reaching over 200 students.', 2),
('2022', 'M³ Bootcamp', 'Introduced Mathematical Modelling Bootcamp to bridge theory and real-world application.', 3),
('2023', 'ETA Campaigns', 'Expanded outreach to rural areas through Education to Action campaigns.', 4),
('2024', 'Global Recognition', 'Named a Top 100 Global Education Innovation by HundrED.', 5);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on timeline_events" ON timeline_events FOR SELECT USING (true);

-- Allow admin write access (using service role or checking admin role)
-- For now, allowing all authenticated users to manage for simplicity in this dev environment, 
-- but in production we should check for admin role in auth.users
CREATE POLICY "Allow authenticated users to manage site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage timeline_events" ON timeline_events FOR ALL USING (auth.role() = 'authenticated');
-- Add fields for full site editing
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS hero_badge TEXT DEFAULT 'Global Innovation Award Winner',
ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'Elevating Nepal Through Mathematics.',
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT 'Igniting curiosity and fostering excellence across Nepal. We''re building a future where every student views mathematics as a tool for innovation.',
ADD COLUMN IF NOT EXISTS hero_cta_text TEXT DEFAULT 'Join the Movement',
ADD COLUMN IF NOT EXISTS hero_cta_link TEXT DEFAULT '/join',
ADD COLUMN IF NOT EXISTS mission_badge TEXT DEFAULT 'Our Mission',
ADD COLUMN IF NOT EXISTS mission_title TEXT DEFAULT 'Empowering the next generation of thinkers and problem solvers.',
ADD COLUMN IF NOT EXISTS mission_description TEXT DEFAULT 'At MIN, we believe that mathematics is more than just numbers and formulas. It''s a powerful tool for understanding the world, driving innovation, and creating impact. Our mission is to inspire a love for math across Nepal.',
ADD COLUMN IF NOT EXISTS footer_description TEXT DEFAULT 'Mathematics Initiatives in Nepal (MIN) is dedicated to making mathematics accessible, engaging, and inspiring for every student in Nepal.';

-- Update the main row with these defaults
UPDATE site_settings 
SET 
  hero_badge = 'Global Innovation Award Winner',
  hero_title = 'Elevating Nepal Through Mathematics.',
  hero_subtitle = 'Igniting curiosity and fostering excellence across Nepal. We''re building a future where every student views mathematics as a tool for innovation.',
  hero_cta_text = 'Join the Movement',
  hero_cta_link = '/join',
  mission_badge = 'Our Mission',
  mission_title = 'Empowering the next generation of thinkers and problem solvers.',
  mission_description = 'At MIN, we believe that mathematics is more than just numbers and formulas. It''s a powerful tool for understanding the world, driving innovation, and creating impact. Our mission is to inspire a love for math across Nepal.',
  footer_description = 'Mathematics Initiatives in Nepal (MIN) is dedicated to making mathematics accessible, engaging, and inspiring for every student in Nepal.'
WHERE id = 'main';
-- Add stats fields to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS stat_students_count INTEGER DEFAULT 1400,
ADD COLUMN IF NOT EXISTS stat_volunteers_count INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS stat_programs_count INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS stat_years_count INTEGER DEFAULT 5;

-- Update the main row with these defaults
UPDATE site_settings 
SET 
  stat_students_count = 1400,
  stat_volunteers_count = 50,
  stat_programs_count = 15,
  stat_years_count = 5
WHERE id = 'main';
-- Add mission features to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS mission_f1_title TEXT DEFAULT 'Accessible Learning',
ADD COLUMN IF NOT EXISTS mission_f1_desc TEXT DEFAULT 'Breaking barriers to ensure every student in Nepal has access to quality math education.',
ADD COLUMN IF NOT EXISTS mission_f2_title TEXT DEFAULT 'Engaging Programs',
ADD COLUMN IF NOT EXISTS mission_f2_desc TEXT DEFAULT 'From olympiads to bootcamps, we make math fun, challenging, and relevant.',
ADD COLUMN IF NOT EXISTS mission_f3_title TEXT DEFAULT 'Goal Oriented',
ADD COLUMN IF NOT EXISTS mission_f3_desc TEXT DEFAULT 'Empowering students with problem-solving skills for their future careers.',
ADD COLUMN IF NOT EXISTS mission_f4_title TEXT DEFAULT 'Community First',
ADD COLUMN IF NOT EXISTS mission_f4_desc TEXT DEFAULT 'Building a supportive network of educators, volunteers, and math enthusiasts.';

-- Update the main row with these defaults
UPDATE site_settings 
SET 
  mission_f1_title = 'Accessible Learning',
  mission_f1_desc = 'Breaking barriers to ensure every student in Nepal has access to quality math education.',
  mission_f2_title = 'Engaging Programs',
  mission_f2_desc = 'From olympiads to bootcamps, we make math fun, challenging, and relevant.',
  mission_f3_title = 'Goal Oriented',
  mission_f3_desc = 'Empowering students with problem-solving skills for their future careers.',
  mission_f4_title = 'Community First',
  mission_f4_desc = 'Building a supportive network of educators, volunteers, and math enthusiasts.'
WHERE id = 'main';
-- Add about page fields to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS about_hero_title TEXT DEFAULT 'Transforming Math Education in Nepal',
ADD COLUMN IF NOT EXISTS about_hero_description TEXT DEFAULT 'Mathematics Initiatives in Nepal (MIN) is a non-profit organization dedicated to making mathematics accessible, engaging, and inspiring for all students across the country.',
ADD COLUMN IF NOT EXISTS about_vision_text TEXT DEFAULT 'To build a Nepal where every student is empowered with logical thinking and problem-solving skills, viewing mathematics as a tool for innovation and understanding.',
ADD COLUMN IF NOT EXISTS about_mission_text TEXT DEFAULT 'To democratize math education through innovative programs, community outreach, and high-quality digital resources that inspire curiosity and foster excellence.',
ADD COLUMN IF NOT EXISTS about_rec_title TEXT DEFAULT 'Globally Recognized Innovation',
ADD COLUMN IF NOT EXISTS about_rec_description TEXT DEFAULT 'Our commitment to excellence was recognized by HundrED, identifying MIN as one of the Top 100 most inspiring global education innovations in 2024. This recognition fuels our drive to reach even more students across Nepal.',
ADD COLUMN IF NOT EXISTS about_rec_badge_title TEXT DEFAULT 'HundrED Top 100',
ADD COLUMN IF NOT EXISTS about_rec_badge_desc TEXT DEFAULT 'Global Education Innovation Award 2024';

-- Update defaults
UPDATE site_settings 
SET 
  about_hero_title = 'Transforming Math Education in Nepal',
  about_hero_description = 'Mathematics Initiatives in Nepal (MIN) is a non-profit organization dedicated to making mathematics accessible, engaging, and inspiring for all students across the country.',
  about_vision_text = 'To build a Nepal where every student is empowered with logical thinking and problem-solving skills, viewing mathematics as a tool for innovation and understanding.',
  about_mission_text = 'To democratize math education through innovative programs, community outreach, and high-quality digital resources that inspire curiosity and foster excellence.',
  about_rec_title = 'Globally Recognized Innovation',
  about_rec_description = 'Our commitment to excellence was recognized by HundrED, identifying MIN as one of the Top 100 most inspiring global education innovations in 2024. This recognition fuels our drive to reach even more students across Nepal.',
  about_rec_badge_title = 'HundrED Top 100',
  about_rec_badge_desc = 'Global Education Innovation Award 2024'
WHERE id = 'main';
-- Add page header fields to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS team_title TEXT DEFAULT 'Our Team',
ADD COLUMN IF NOT EXISTS team_subtitle TEXT DEFAULT 'Meet the MIN Family',
ADD COLUMN IF NOT EXISTS team_description TEXT DEFAULT 'A diverse group of educators, volunteers, and math enthusiasts working together to transform math education in Nepal.',
ADD COLUMN IF NOT EXISTS events_title TEXT DEFAULT 'Events & Programs',
ADD COLUMN IF NOT EXISTS events_subtitle TEXT DEFAULT 'Learning Beyond the Classroom',
ADD COLUMN IF NOT EXISTS events_description TEXT DEFAULT 'Join our upcoming workshops, olympiads, and bootcamps designed to inspire and challenge students across Nepal.',
ADD COLUMN IF NOT EXISTS gallery_title TEXT DEFAULT 'Visual Journey',
ADD COLUMN IF NOT EXISTS gallery_subtitle TEXT DEFAULT 'Capturing Moments of Impact',
ADD COLUMN IF NOT EXISTS gallery_description TEXT DEFAULT 'Explore our activities, workshops, and community events through our curated collection of photographs.',
ADD COLUMN IF NOT EXISTS join_title TEXT DEFAULT 'Join the Movement',
ADD COLUMN IF NOT EXISTS join_subtitle TEXT DEFAULT 'Become a Part of MIN',
ADD COLUMN IF NOT EXISTS join_description TEXT DEFAULT 'Help us transform mathematics education in Nepal. Whether you are a student, educator, or volunteer, there is a place for you.',
ADD COLUMN IF NOT EXISTS contact_title TEXT DEFAULT 'Get in Touch',
ADD COLUMN IF NOT EXISTS contact_subtitle TEXT DEFAULT 'We''d Love to Hear From You',
ADD COLUMN IF NOT EXISTS contact_description TEXT DEFAULT 'Have questions about our programs or want to collaborate? Reach out to us using the form below.';

-- Update defaults
UPDATE site_settings 
SET 
  team_title = 'Our Team',
  team_subtitle = 'Meet the MIN Family',
  team_description = 'A diverse group of educators, volunteers, and math enthusiasts working together to transform math education in Nepal.',
  events_title = 'Events & Programs',
  events_subtitle = 'Learning Beyond the Classroom',
  events_description = 'Join our upcoming workshops, olympiads, and bootcamps designed to inspire and challenge students across Nepal.',
  gallery_title = 'Visual Journey',
  gallery_subtitle = 'Capturing Moments of Impact',
  gallery_description = 'Explore our activities, workshops, and community events through our curated collection of photographs.',
  join_title = 'Join the Movement',
  join_subtitle = 'Become a Part of MIN',
  join_description = 'Help us transform mathematics education in Nepal. Whether you are a student, educator, or volunteer, there is a place for you.',
  contact_title = 'Get in Touch',
  contact_subtitle = 'We''d Love to Hear From You',
  contact_description = 'Have questions about our programs or want to collaborate? Reach out to us using the form below.'
WHERE id = 'main';
-- Add RTO page header fields to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS rto_title TEXT DEFAULT 'The Challenge Awaits',
ADD COLUMN IF NOT EXISTS rto_subtitle TEXT DEFAULT 'Road to Olympiad',
ADD COLUMN IF NOT EXISTS rto_description TEXT DEFAULT 'Your comprehensive guide to navigating the RTO process, mastering advanced concepts, and accessing essential study materials.';

-- Update defaults
UPDATE site_settings 
SET 
  rto_title = 'The Challenge Awaits',
  rto_subtitle = 'Road to Olympiad',
  rto_description = 'Your comprehensive guide to navigating the RTO process, mastering advanced concepts, and accessing essential study materials.'
WHERE id = 'main';
-- Practice Sets table
CREATE TABLE IF NOT EXISTS practice_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    time_limit INTEGER DEFAULT 60, -- minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practice Questions table
CREATE TABLE IF NOT EXISTS practice_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    set_id UUID REFERENCES practice_sets(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL, -- LaTeX supported
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    marks INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE practice_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all" ON practice_sets FOR SELECT USING (true);
CREATE POLICY "Enable write for admin only" ON practice_sets FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read for all" ON practice_questions FOR SELECT USING (true);
CREATE POLICY "Enable write for admin only" ON practice_questions FOR ALL USING (auth.role() = 'authenticated');
-- Add image_url to practice_questions
ALTER TABLE practice_questions 
ADD COLUMN IF NOT EXISTS image_url TEXT;
-- Add RTO extended content fields to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS rto_stages JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS rto_roadmap JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS rto_resources JSONB DEFAULT '[]';

-- Initialize with default content
UPDATE site_settings 
SET 
  rto_stages = '[
    {"id": "DMO", "name": "District Math Olympiad", "desc": "The first step. Open to thousands of students across districts in Nepal.", "icon": "MapPin"},
    {"id": "PMO", "name": "Provincial Math Olympiad", "desc": "Top performers from districts compete at the provincial level.", "icon": "Flag"},
    {"id": "NMO", "name": "National Math Olympiad", "desc": "The elite few battle it out nationally to enter the training camp.", "icon": "Award"},
    {"id": "Camp", "name": "Olympiad Training Camp", "desc": "Intensive training for the national team prospects.", "icon": "Users"},
    {"id": "IMO", "name": "International Math Olympiad", "desc": "Representing Nepal on the global stage.", "icon": "Globe"}
  ]',
  rto_roadmap = '[
    {
      "phase": "Phase 1 - Foundation",
      "timeline": "Before DMO",
      "goal": "Build strong school math fundamentals & start problem-solving mindset.",
      "color": "from-blue-500/20 to-cyan-500/20",
      "borderColor": "border-blue-500/30",
      "iconColor": "text-blue-500",
      "items": [
        {"label": "Arithmetic, Algebra basics", "desc": "Use AoPS Prealgebra; revise school math concepts"},
        {"label": "Number theory basics", "desc": "Learn GCD, LCM, intro to modular arithmetic"},
        {"label": "Geometry basics", "desc": "Study triangles, circles, coordinate geometry"},
        {"label": "Combinatorics basics", "desc": "Counting, permutations, combinations"},
        {"label": "Exam skills", "desc": "Time management, elimination strategies"}
      ]
    },
    {
      "phase": "Phase 2 - PMO Prep",
      "timeline": "Intermediate",
      "goal": "Deepen concepts, transition to intermediate problem-solving.",
      "color": "from-emerald-500/20 to-teal-500/20",
      "borderColor": "border-emerald-500/30",
      "iconColor": "text-emerald-500",
      "items": [
        {"label": "Algebra deep dive", "desc": "Inequalities, quadratic equations"},
        {"label": "Number theory", "desc": "Modular arithmetic, Diophantine equations"},
        {"label": "Geometry intermediate", "desc": "Cyclic quadrilaterals, similarity"},
        {"label": "Combinatorics advance", "desc": "Graph theory basics, pigeonhole principle"}
      ]
    },
    {
      "phase": "Phase 3 - NMO Progression",
      "timeline": "Advanced",
      "goal": "Learn proof-writing and advanced problem-solving.",
      "color": "from-purple-500/20 to-fuchsia-500/20",
      "borderColor": "border-purple-500/30",
      "iconColor": "text-purple-500",
      "items": [
        {"label": "Proof-writing", "desc": "Practice clear, logical solutions"},
        {"label": "Algebra", "desc": "Symmetric polynomials, AM-GM, Cauchy-Schwarz"},
        {"label": "Number theory", "desc": "Euler’s theorem, Chinese Remainder Theorem"},
        {"label": "Geometry", "desc": "Radical axis, transformations"},
        {"label": "Combinatorics", "desc": "Inclusion–exclusion, generating functions"}
      ]
    },
    {
      "phase": "Phase 4 - IMO Training",
      "timeline": "Elite",
      "goal": "Reach international competition level.",
      "color": "from-coral/20 to-orange-500/20",
      "borderColor": "border-coral/30",
      "iconColor": "text-coral",
      "items": [
        {"label": "Algebra", "desc": "Advanced inequalities, functional equations"},
        {"label": "Number theory", "desc": "Quadratic residues, hard Diophantine problems"},
        {"label": "Geometry", "desc": "Inversions, homothety, projective geometry"},
        {"label": "Combinatorics", "desc": "Advanced graph theory, extremal problems"},
        {"label": "Full IMO simulation", "desc": "Timed 6-problem practice sets"},
        {"label": "Weak area fixing", "desc": "Focused training on problem areas"}
      ]
    }
  ]',
  rto_resources = '[
    {
      "title": "Books & Guides",
      "icon": "Library",
      "items": [
        "The Art of Problem Solving, Vol. 1: The Basics",
        "The Art of Problem Solving, Vol. 2: And Beyond",
        "Problem-Solving Strategies",
        "Mathematical Olympiad Treasures"
      ]
    },
    {
      "title": "Online Platforms",
      "icon": "Globe",
      "items": [
        "Art of Problem Solving (AoPS)",
        "Brilliant.org",
        "Khan Academy",
        "GeoGebra"
      ]
    },
    {
      "title": "Past Papers",
      "icon": "FileText",
      "items": [
        "IMO Official Website (Past Papers)",
        "AoPS Community Contests",
        "MIN DMO Archives"
      ]
    },
    {
      "title": "Communities",
      "icon": "Users",
      "items": [
        "AoPS Community Forum",
        "Math StackExchange",
        "MIN Discord Community"
      ]
    }
  ]'
WHERE id = 'main';
-- Update RTO resources to include links
UPDATE site_settings 
SET 
  rto_resources = '[
    {
      "title": "Books & Guides",
      "icon": "Library",
      "items": [
        {"name": "The Art of Problem Solving, Vol. 1: The Basics", "url": "https://artofproblemsolving.com/store"},
        {"name": "The Art of Problem Solving, Vol. 2: And Beyond", "url": "https://artofproblemsolving.com/store"},
        {"name": "Problem-Solving Strategies (Arthur Engel)", "url": "#"},
        {"name": "Mathematical Olympiad Treasures", "url": "#"}
      ]
    },
    {
      "title": "Online Platforms",
      "icon": "Globe",
      "items": [
        {"name": "Art of Problem Solving (AoPS)", "url": "https://artofproblemsolving.com"},
        {"name": "Brilliant.org", "url": "https://brilliant.org"},
        {"name": "Khan Academy", "url": "https://khanacademy.org"},
        {"name": "GeoGebra", "url": "https://geogebra.org"}
      ]
    },
    {
      "title": "Past Papers",
      "icon": "FileText",
      "items": [
        {"name": "IMO Official Website (Past Papers)", "url": "https://www.imo-official.org/problems.aspx"},
        {"name": "AoPS Community Contests", "url": "https://artofproblemsolving.com/community/c13_contests"},
        {"name": "MIN DMO Archives", "url": "/dmopractice"}
      ]
    },
    {
      "title": "Communities",
      "icon": "Users",
      "items": [
        {"name": "AoPS Community Forum", "url": "https://artofproblemsolving.com/community"},
        {"name": "Math StackExchange", "url": "https://math.stackexchange.com"},
        {"name": "MIN Discord Community", "url": "#"}
      ]
    }
  ]'
WHERE id = 'main';
-- 20260411185500_add_batching_to_applications.sql
-- Adds support for grouping volunteer/partnership applications into batches

-- 1. Add batch_name to join_applications
ALTER TABLE public.join_applications 
  ADD COLUMN IF NOT EXISTS batch_name text DEFAULT 'Initial Batch';

-- 2. Add active_volunteer_batch to site_settings (to control what batch new apps fall into)
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS active_volunteer_batch text DEFAULT 'General';

-- 3. Create index for faster batch filtering
CREATE INDEX IF NOT EXISTS idx_applications_batch_name ON public.join_applications(batch_name);
-- 20260411190200_rbac_audit_overhaul.sql
-- 1. Add WEBSITE_MANAGER role
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('ADMIN', 'MANAGER', 'WRITER', 'WEBSITE_MANAGER'));

-- 2. Enhance Audit Log Table (Ensure indices for filtering)
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_id ON public.audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at);

-- 3. Automatic Audit Purge Function
CREATE OR REPLACE FUNCTION public.purge_old_audit_logs()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM public.audit_log
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;


-- 4. Unified Audit Record Function for internal use
CREATE OR REPLACE FUNCTION public.record_audit()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.audit_log (actor_id, action, entity_type, entity_id, meta)
  VALUES (auth.uid(), TG_ARGV[0], TG_TABLE_NAME, (NEW).id, jsonb_build_object('data', row_to_json(NEW)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 20260411191000_fix_user_deletion_cascades.sql
-- Fix foreign key constraints that prevent user deletion due to existing audit logs or content

-- 1. Audit Log: Set actor_id to null when user is deleted
ALTER TABLE public.audit_log 
  DROP CONSTRAINT IF EXISTS audit_log_actor_id_fkey,
  ADD CONSTRAINT audit_log_actor_id_fkey 
  FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 2. Events: Set created_by to null when user is deleted
ALTER TABLE public.events
  DROP CONSTRAINT IF EXISTS events_created_by_fkey,
  ADD CONSTRAINT events_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. Content: Set submitted_by to null when user is deleted
ALTER TABLE public.content
  DROP CONSTRAINT IF EXISTS content_submitted_by_fkey,
  ADD CONSTRAINT content_submitted_by_fkey 
  FOREIGN KEY (submitted_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 4. Certificates: Set issued_by to null when user is deleted
ALTER TABLE public.certificates
  DROP CONSTRAINT IF EXISTS certificates_issued_by_fkey,
  ADD CONSTRAINT certificates_issued_by_fkey 
  FOREIGN KEY (issued_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 5. Content Submissions: Set reviewer_id to null when user is deleted
ALTER TABLE public.content_submissions
  DROP CONSTRAINT IF EXISTS content_submissions_reviewer_id_fkey,
  ADD CONSTRAINT content_submissions_reviewer_id_fkey 
  FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
-- 20260411193000_form_builder_system.sql
-- Implements a dynamic form builder and automated email response system

-- 1. Email Templates
CREATE TABLE IF NOT EXISTS public.email_templates (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text NOT NULL,
    subject     text NOT NULL,
    body        text NOT NULL, -- Supports placeholders like {{name}}
    action      text, -- e.g. 'APPLICATION_RECEIVED', 'APPLICATION_APPROVED'
    created_at  timestamptz DEFAULT now(),
    updated_at  timestamptz DEFAULT now()
);

-- 2. Form Definitions
CREATE TABLE IF NOT EXISTS public.form_definitions (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            text UNIQUE NOT NULL,
    title           text NOT NULL,
    description     text,
    fields          jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of field objects: {label, type, required, options}
    email_template_id uuid REFERENCES public.email_templates(id) ON DELETE SET NULL,
    is_active       boolean DEFAULT true,
    batch_name      text, -- Custom batch identifier for this form
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

-- 3. Form Submissions (Generic)
CREATE TABLE IF NOT EXISTS public.form_submissions (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id     uuid REFERENCES public.form_definitions(id) ON DELETE CASCADE,
    data        jsonb NOT NULL,
    status      text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED')),
    notes       text,
    created_at  timestamptz DEFAULT now()
);

-- 4. Indices for performance
CREATE INDEX IF NOT EXISTS idx_form_definitions_slug ON public.form_definitions(slug);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON public.form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON public.form_submissions(status);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Minimal policies (Admin full access, Public can read active forms and submit)
-- Note: Real production would have more granular policies or use service role in APIs

CREATE POLICY "Admin full access templates" ON public.email_templates FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access definitions" ON public.form_definitions FOR ALL TO authenticated USING (true);
CREATE POLICY "Public read active definitions" ON public.form_definitions FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public submit forms" ON public.form_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin full access submissions" ON public.form_submissions FOR ALL TO authenticated USING (true);
-- 20260411194500_intake_system_v2.sql
-- Enhances the intake system with role categories and automated reminders

-- 1. Add Category to Form Definitions
ALTER TABLE public.form_definitions 
ADD COLUMN IF NOT EXISTS category text CHECK (category IN ('VOLUNTEER', 'ORGANIZATION', 'AMBASSADOR', 'OTHER')) DEFAULT 'VOLUNTEER';

-- 2. Create Intake Reminders Table
CREATE TABLE IF NOT EXISTS public.intake_reminders (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email       text NOT NULL,
    category    text NOT NULL, -- Which category they are waiting for
    created_at  timestamptz DEFAULT now(),
    UNIQUE(email, category)
);

-- 3. RLS for Reminders
ALTER TABLE public.intake_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public submit reminders" ON public.intake_reminders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin full access reminders" ON public.intake_reminders FOR ALL TO authenticated USING (true);

-- 4. Update indexing
CREATE INDEX IF NOT EXISTS idx_form_definitions_category ON public.form_definitions(category);
CREATE INDEX IF NOT EXISTS idx_intake_reminders_category ON public.intake_reminders(category);
-- 20260411195800_form_builder_enhancements.sql
-- Add deadline column
ALTER TABLE public.form_definitions 
ADD COLUMN IF NOT EXISTS deadline timestamptz;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, reload_schema;
-- Add homepage image and missing text fields to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS mission_image_url TEXT,
ADD COLUMN IF NOT EXISTS programs_title TEXT DEFAULT 'Our Strategic Programs',
ADD COLUMN IF NOT EXISTS programs_subtitle TEXT DEFAULT 'Shaping the Future of Math',
ADD COLUMN IF NOT EXISTS stats_title TEXT DEFAULT 'Our Growing Impact',
ADD COLUMN IF NOT EXISTS stats_subtitle TEXT DEFAULT 'Numbers that drive our mission forward';

-- Update defaults for existing main record
UPDATE site_settings 
SET 
  programs_title = 'Our Strategic Programs',
  programs_subtitle = 'Shaping the Future of Math',
  stats_title = 'Our Growing Impact',
  stats_subtitle = 'Numbers that drive our mission forward'
WHERE id = 'main';
-- Add learn_more_link to programs table for custom redirects
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS learn_more_link TEXT;

-- Seed existing programs if table is empty (optional but helpful)
-- Note: This is a safe check to ensure the UI has something to show
INSERT INTO programs (name, slug, tagline, description, status, display_order)
SELECT 'ETA Campaigns', 'eta-campaigns', 'Education to action', 'Participatory campaigns focused on bringing mathematics outside the classroom.', 'ACTIVE', 1
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE slug = 'eta-campaigns');

INSERT INTO programs (name, slug, tagline, description, status, display_order)
SELECT 'JMOC', 'jmoc', 'Junior Mathematics Olympiad Camp', 'A specialized camp for middle school students to explore advanced mathematics.', 'ACTIVE', 2
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE slug = 'jmoc');

INSERT INTO programs (name, slug, tagline, description, status, display_order)
SELECT 'M³ Bootcamp', 'm3-bootcamp', 'Mathematical Modelling Bootcamp', 'Training students to solve real-world problems using mathematical models.', 'ACTIVE', 3
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE slug = 'm3-bootcamp');
-- Add even more homepage fields to site_settings for complete control
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS mission_rec_title TEXT DEFAULT 'Recognized Globally',
ADD COLUMN IF NOT EXISTS mission_rec_desc TEXT DEFAULT 'Top 100 Global Education Innovations by HundrED.',
ADD COLUMN IF NOT EXISTS recognition_image_url TEXT,
ADD COLUMN IF NOT EXISTS join_cta_title TEXT DEFAULT 'Ready to make an impact in Nepal''s education?',
ADD COLUMN IF NOT EXISTS join_cta_description TEXT DEFAULT 'We''re always looking for passionate volunteers, educators, and collaborators to join our mission. Whether you''re a student, teacher, or professional, there''s a place for you at MIN.',
ADD COLUMN IF NOT EXISTS join_cta_btn_text TEXT DEFAULT 'Become a Volunteer',
ADD COLUMN IF NOT EXISTS join_cta_image_url TEXT,
ADD COLUMN IF NOT EXISTS join_cta_stat_title TEXT DEFAULT '50+ Volunteers',
ADD COLUMN IF NOT EXISTS join_cta_stat_desc TEXT DEFAULT 'Building the future of mathematics in Nepal together.';

-- Initial update for the main record
UPDATE site_settings 
SET 
  mission_rec_title = 'Recognized Globally',
  mission_rec_desc = 'Top 100 Global Education Innovations by HundrED.',
  join_cta_title = 'Ready to make an impact in Nepal''s education?',
  join_cta_description = 'We''re always looking for passionate volunteers, educators, and collaborators to join our mission. Whether you''re a student, teacher, or professional, there''s a place for you at MIN.',
  join_cta_btn_text = 'Become a Volunteer',
  join_cta_stat_title = '50+ Volunteers',
  join_cta_stat_desc = 'Building the future of mathematics in Nepal together.'
WHERE id = 'main';
-- Remove unnecessary fields from programs table to align with the simplified UI
ALTER TABLE programs 
DROP COLUMN IF EXISTS cover_url,
DROP COLUMN IF EXISTS tags,
DROP COLUMN IF EXISTS description;
-- Add default fallback asset URLs to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS default_team_photo TEXT DEFAULT 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop',
ADD COLUMN IF NOT EXISTS default_event_cover TEXT DEFAULT 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop',
ADD COLUMN IF NOT EXISTS default_notice_image TEXT DEFAULT 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2068&auto=format&fit=crop';

UPDATE site_settings 
SET 
  default_team_photo = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop',
  default_event_cover = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop',
  default_notice_image = 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2068&auto=format&fit=crop'
WHERE id = 'main';
-- Add image support to notices
ALTER TABLE popup_notices ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add fallback for programs (initiatives)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS default_program_image TEXT DEFAULT 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop';
UPDATE site_settings SET default_program_image = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop' WHERE id = 'main';
-- Add specific fallback for Content (Articles/Blogs)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS default_content_image TEXT DEFAULT 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop';
UPDATE site_settings SET default_content_image = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop' WHERE id = 'main';

-- 20260412130000_auto_delete_responded_inquiries.sql
-- Implements automatic deletion of responded inquiries after 30 days

-- 1. Add status_updated_at tracking
ALTER TABLE public.join_applications ADD COLUMN IF NOT EXISTS status_updated_at timestamptz DEFAULT now();
ALTER TABLE public.form_submissions ADD COLUMN IF NOT EXISTS status_updated_at timestamptz DEFAULT now();

-- 2. Function to update status_updated_at
CREATE OR REPLACE FUNCTION public.update_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        NEW.status_updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Triggers
DROP TRIGGER IF EXISTS tr_join_apps_status_timestamp ON public.join_applications;
CREATE TRIGGER tr_join_apps_status_timestamp
    BEFORE UPDATE ON public.join_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_status_timestamp();

DROP TRIGGER IF EXISTS tr_form_subs_status_timestamp ON public.form_submissions;
CREATE TRIGGER tr_form_subs_status_timestamp
    BEFORE UPDATE ON public.form_submissions
    FOR EACH ROW EXECUTE FUNCTION public.update_status_timestamp();

-- 4. Purge Function
CREATE OR REPLACE FUNCTION public.purge_responded_inquiries()
RETURNS void AS $$
BEGIN
    -- Delete from legacy join_applications
    DELETE FROM public.join_applications 
    WHERE (status = 'ACCEPTED' OR status = 'APPROVED')
      AND type = 'INQUIRY'
      AND status_updated_at < now() - interval '30 days';

    -- Delete from modern form_submissions (where category is INQUIRY)
    DELETE FROM public.form_submissions
    WHERE (status = 'APPROVED')
      AND form_id IN (
          SELECT id FROM public.form_definitions WHERE category = 'INQUIRY'
      )
      AND status_updated_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql;

-- 5. Schedule Job (Assuming pg_cron is enabled in Supabase)
-- We use a DO block to safely handle environments where pg_cron might not be enabled yet
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        -- Schedule to run every day at midnight
        PERFORM cron.schedule('daily-inquiry-purge', '0 0 * * *', 'SELECT public.purge_responded_inquiries()');
    END IF;
END $$;
-- Upgrade team_members status system
alter table public.team_members add column status text default 'ACTIVE' check (status in ('ACTIVE', 'ALUMNI', 'INACTIVE', 'REMOVED'));

-- Migrate existing data
update public.team_members set status = 'ALUMNI' where farewell_date is not null;
update public.team_members set status = 'INACTIVE' where is_active = false and farewell_date is null;
update public.team_members set status = 'ACTIVE' where is_active = true and farewell_date is null;

-- Log the migration
comment on column public.team_members.status is 'ACTIVE, ALUMNI, INACTIVE, REMOVED';
-- Add team_identity_assets to site_settings
alter table public.site_settings add column if not exists team_identity_assets jsonb default '[]'::jsonb;

comment on column public.site_settings.team_identity_assets is 'List of URLs for random team photo selection';
-- 20260412152000_automate_audit_cleanup.sql
-- Schedules the existing public.purge_old_audit_logs() function to run automatically

DO $$
BEGIN
    -- Check if pg_cron is enabled in the current environment
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        
        -- Unschedule if it exists to safely allow re-running this migration
        -- Ignore errors if job doesn't exist yet by capturing exceptions
        BEGIN
            PERFORM cron.unschedule('daily-audit-purge');
        EXCEPTION WHEN OTHERS THEN
            -- Do nothing if job doesn't exist
        END;

        -- Schedule the maintenance purge to run every day at midnight (0 0 * * *)
        -- Note: purge_old_audit_logs() automatically deletes logs older than 30 days
        PERFORM cron.schedule('daily-audit-purge', '0 0 * * *', 'SELECT public.purge_old_audit_logs()');
    END IF;
END $$;
-- Migration: Add DMO Practice Page Settings
-- Description: Adds editable content fields for the DMO Practice page in Site Nexus.

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS dmopractice_title text,
ADD COLUMN IF NOT EXISTS dmopractice_subtitle text,
ADD COLUMN IF NOT EXISTS dmopractice_description text;
-- Migration: Add DMO Practice Badge
-- Description: Adds editable content field for the DMO Practice page badge in Site Nexus.

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS dmopractice_badge text;
-- ============================================================
-- Migration: Add about_rec_image to site_settings
-- ============================================================
-- The about page uses `about_rec_image` for the HundrED Award Graphic/Logo.
-- This was missing from the DB schema, causing admin saves to silently fail.

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS about_rec_image TEXT;
-- ============================================================
-- Migration: Email Templates System (Robust Final Fix)
-- ============================================================
-- Allows admins and website managers to fully control automated emails.

-- 1. Temporarily drop foreign key constraint to allow type changes
ALTER TABLE IF EXISTS public.form_definitions 
DROP CONSTRAINT IF EXISTS form_definitions_email_template_id_fkey;

-- 2. Create the table if it's missing entirely
CREATE TABLE IF NOT EXISTS public.email_templates (
  id TEXT PRIMARY KEY
);

-- 3. Force the 'id' column to be TEXT if it was accidentally created as UUID
ALTER TABLE public.email_templates ALTER COLUMN id TYPE TEXT;

-- 4. Clean up old/conflicting columns
-- If 'body' exists from a previous failed attempt, rename it to 'body_markdown'
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='email_templates' AND column_name='body') THEN
    ALTER TABLE public.email_templates RENAME COLUMN body TO body_markdown;
  END IF;
END $$;

-- 5. Ensure all core columns exist with correct types
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS body_markdown TEXT;
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS from_name TEXT DEFAULT 'Mathematics Initiatives in Nepal';
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS from_email TEXT DEFAULT 'no-reply@mathsinitiatives.org.np';
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id);

-- 6. Setup defaults for existing rows before making columns NOT NULL
UPDATE public.email_templates SET name = 'Template' WHERE name IS NULL;
UPDATE public.email_templates SET subject = 'Subject' WHERE subject IS NULL;
UPDATE public.email_templates SET body_markdown = '' WHERE body_markdown IS NULL;

ALTER TABLE public.email_templates ALTER COLUMN name SET NOT NULL;
ALTER TABLE public.email_templates ALTER COLUMN subject SET NOT NULL;
ALTER TABLE public.email_templates ALTER COLUMN body_markdown SET NOT NULL;

-- 7. Sync form_definitions type and restore constraint
ALTER TABLE IF EXISTS public.form_definitions ALTER COLUMN email_template_id TYPE TEXT;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'form_definitions') THEN
        ALTER TABLE public.form_definitions 
        ADD CONSTRAINT form_definitions_email_template_id_fkey 
        FOREIGN KEY (email_template_id) REFERENCES public.email_templates(id) ON UPDATE CASCADE;
    END IF;
END $$;

-- 8. Policies
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin/WebsiteManager read email templates" ON public.email_templates;
CREATE POLICY "Admin/WebsiteManager read email templates" ON public.email_templates FOR SELECT
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER', 'WEBSITE_MANAGER')));

DROP POLICY IF EXISTS "Admin/WebsiteManager manage email templates" ON public.email_templates;
CREATE POLICY "Admin/WebsiteManager manage email templates" ON public.email_templates FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'WEBSITE_MANAGER')));

-- 9. Seed/Upsert default templates
INSERT INTO public.email_templates (id, name, description, subject, body_markdown, from_name, from_email)
VALUES
(
  'application_accepted',
  'Application Accepted',
  'Sent when an admin marks a volunteer/ambassador/partner application as accepted.',
  '🎉 Congratulations! Your Application to MIN Nepal',
  E'## Welcome to the MIN Family, {{applicant_name}}!\n\nWe are absolutely thrilled to let you know that your application to join **Mathematics Initiatives in Nepal (MIN)** as a **{{role_type}}** has been **accepted**.\n\nThis is the beginning of an exciting journey — one that directly contributes to transforming mathematics education across Nepal.\n\nOur team coordinators will be reaching out to you shortly with the next steps, onboarding details, and your role assignment.\n\n> *"The strength of the team is each individual member. The strength of each member is the team."*\n\nWelcome aboard!\n\n**The MIN Team**',
  'Mathematics Initiatives in Nepal',
  'no-reply@mathsinitiatives.org.np'
),
(
  'application_rejected',
  'Application Not Selected',
  'Sent when an admin marks an application as rejected.',
  'Thank you for your interest in MIN Nepal',
  E'## Dear {{applicant_name}},\n\nThank you sincerely for taking the time to apply to **Mathematics Initiatives in Nepal (MIN)** as a **{{role_type}}**.\n\nAfter careful consideration, we have decided to move forward with other candidates who more closely matched our current needs at this time.\n\nWe truly appreciate your passion for mathematics education and encourage you to apply again in the future. We regularly open new opportunities across different teams and programs.\n\nWe wish you all the best in your endeavors.\n\n**The MIN Team**',
  'Mathematics Initiatives in Nepal',
  'no-reply@mathsinitiatives.org.np'
),
(
  'content_approved',
  'Content Submission Approved',
  'Sent when a submitted article/resource is approved by an admin.',
  '✅ Your Submission Has Been Published — MIN Nepal',
  E'## Great news, {{applicant_name}}!\n\nYour submission titled **"{{content_title}}"** has been reviewed and **approved** by the MIN editorial team.\n\nIt is now live on our platform and will be accessible to students and educators across Nepal.\n\nThank you for contributing to our mission of making mathematics accessible and inspiring for everyone.\n\nKeep creating!\n\n**The MIN Editorial Team**',
  'MIN Editorial Team',
  'no-reply@mathsinitiatives.org.np'
),
(
  'inquiry_response',
  'Inquiry Acknowledgement',
  'Sent as confirmation when a contact form inquiry is received.',
  'We received your message — MIN Nepal',
  E'## Thank you for reaching out, {{applicant_name}}!\n\nWe have received your inquiry and a member of our team will get back to you as soon as possible, usually within **1–3 business days**.\n\nIn the meantime, feel free to explore our programs and initiatives on our website.\n\nWarm regards,\n\n**The MIN Team**',
  'Mathematics Initiatives in Nepal',
  'contact@mathsinitiatives.org.np'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  subject = EXCLUDED.subject,
  body_markdown = EXCLUDED.body_markdown,
  from_name = EXCLUDED.from_name,
  from_email = EXCLUDED.from_email;

NOTIFY pgrst, 'reload schema';
-- ============================================================
-- Migration: Email Event Mappings
-- ============================================================
-- Allows admins to assign specific templates to system events.

CREATE TABLE IF NOT EXISTS public.email_event_mappings (
  event_key    TEXT PRIMARY KEY, -- e.g. 'application_accepted'
  template_id  TEXT REFERENCES public.email_templates(id) ON UPDATE CASCADE ON DELETE SET NULL,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.email_event_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/WebsiteManager read event mappings"
  ON public.email_event_mappings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER', 'WEBSITE_MANAGER')
  ));

CREATE POLICY "Admin/WebsiteManager manage event mappings"
  ON public.email_event_mappings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('ADMIN', 'WEBSITE_MANAGER')
  ));

-- Seed default mappings
INSERT INTO public.email_event_mappings (event_key, template_id)
VALUES
  ('application_accepted', 'application_accepted'),
  ('application_rejected', 'application_rejected'),
  ('content_approved', 'content_approved'),
  ('inquiry_received', 'inquiry_response')
ON CONFLICT (event_key) DO NOTHING;
-- Add Join Us page configuration fields to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS join_badge TEXT DEFAULT 'Identify Your Path',
ADD COLUMN IF NOT EXISTS join_features JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS join_paths JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS join_faqs JSONB DEFAULT '[]';

-- Initialize with prefilled information
UPDATE site_settings 
SET 
  join_badge = 'Identify Your Path',
  join_features = '[
    {"title": "Purpose Driven", "desc": "Contribute to projects that directly improve how mathematics is perceived in Nepal."},
    {"title": "Global Network", "desc": "Collaborate with educators and innovators from across the globe through our programs."},
    {"title": "Direct Influence", "desc": "Have a voice in the design and execution of high-impact workshops and competitions."},
    {"title": "Rich Community", "desc": "Connect with hundreds of like-minded problem solvers and community leaders."}
  ]',
  join_paths = '[
    {
      "id": "path-volunteer",
      "title": "Become a Volunteer",
      "desc": "Join our core operational teams, create content, or help organize our nationwide programs.",
      "perks": ["Team Access", "Certificate", "Networking"],
      "slug": "volunteer",
      "icon": "Heart"
    },
    {
      "id": "path-partner",
      "title": "Scale as a Partner",
      "desc": "Register your school or organization to collaborate on workshops and resource distribution.",
      "perks": ["Resource Kit", "Brand Logo", "Priority Support"],
      "slug": "organization",
      "icon": "Building2"
    },
    {
      "id": "path-ambassador",
      "title": "Join as Ambassador",
      "desc": "Lead the movement in your local region or university and represent Mathematics Initiatives in Nepal.",
      "perks": ["Leadership Role", "Exclusive Merch", "Direct Mentorship"],
      "slug": "ambassador",
      "icon": "Globe"
    }
  ]',
  join_faqs = '[
    {"question": "Can I join remotely?", "answer": "Yes, many of our operational and content creation roles are fully remote. We coordinate via Slack and Zoom."},
    {"question": "Is there a time commitment?", "answer": "It varies by role, typically ranging from 2–10 hours per week depending on the current project phase."},
    {"question": "Do I need a math degree?", "answer": "Not at all! We need writers, designers, and organizers as much as we need mathematicians."},
    {"question": "How long is the process?", "answer": "After submission, we usually perform a technical review and then invite you for a 20-minute intro call."}
  ]'
WHERE id = 'main';
-- Add site-wide audit tracking to site_settings
-- This table stores configuration for all pages (Home, About, Join, etc.)
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS updated_by_name TEXT;
-- Add branding assets to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS site_logo_url TEXT;
-- Migration to enhance events functionality
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS action_title TEXT DEFAULT 'Registration / Action Required',
ADD COLUMN IF NOT EXISTS action_description TEXT DEFAULT 'Follow the link to participate or register for this event.',
ADD COLUMN IF NOT EXISTS youtube_videos JSONB DEFAULT '[]'::jsonb;

-- Comment out the following if you want to keep start_date required at DB level 
-- but we'll handle it in the application.
-- ALTER TABLE events ALTER COLUMN start_date DROP NOT NULL;
-- Migration to ensure programs table has the latest required columns
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS learn_more_link TEXT;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
-- Add video support to content table
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS video_metadata JSONB DEFAULT '{}'::jsonb;

-- Helper to drop constraints if we don't know the name (though we usually do from init_schema)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop check constraints on 'content_type' column
    FOR r IN (
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.content'::regclass 
        AND contype = 'c' 
        AND pg_get_constraintdef(oid) LIKE '%content_type%'
    ) LOOP
        EXECUTE 'ALTER TABLE public.content DROP CONSTRAINT ' || r.conname;
    END LOOP;

    -- Drop check constraints on 'type' column
    FOR r IN (
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.content'::regclass 
        AND contype = 'c' 
        AND pg_get_constraintdef(oid) LIKE '%type%'
        AND pg_get_constraintdef(oid) NOT LIKE '%content_type%' -- Don't match the other column
    ) LOOP
        EXECUTE 'ALTER TABLE public.content DROP CONSTRAINT ' || r.conname;
    END LOOP;
END $$;

-- Re-add constraints with VIDEO included
ALTER TABLE public.content ADD CONSTRAINT content_type_check CHECK (content_type IN ('RICHTEXT', 'PDF', 'VIDEO'));
ALTER TABLE public.content ADD CONSTRAINT content_type_enum_check CHECK (type IN ('ARTICLE', 'PROBLEM', 'BLOG', 'RESOURCE', 'VIDEO'));
-- Add display_order column to content table for custom sorting
ALTER TABLE public.content ADD COLUMN display_order INTEGER DEFAULT 0;

-- Initialize display_order based on created_at to preserve reverse chronological order initially
WITH numbered_content AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM public.content
)
UPDATE public.content
SET display_order = numbered_content.row_num
FROM numbered_content
WHERE public.content.id = numbered_content.id;
-- Change impact stat columns from INTEGER to TEXT to support labels like "20K+", "50+", etc.
ALTER TABLE public.site_settings 
  ALTER COLUMN stat_students_count TYPE TEXT USING stat_students_count::TEXT,
  ALTER COLUMN stat_volunteers_count TYPE TEXT USING stat_volunteers_count::TEXT,
  ALTER COLUMN stat_programs_count TYPE TEXT USING stat_programs_count::TEXT,
  ALTER COLUMN stat_years_count TYPE TEXT USING stat_years_count::TEXT;
-- 20260424110000_extend_auto_purge_to_rejected.sql
-- Extends auto-purge to cover:
--   1. content_submissions with status = 'REJECTED' after 30 days
--   2. join_applications with status = 'REJECTED' after 30 days  
--   3. form_submissions with status = 'REJECTED' after 30 days
--   4. Inquiries (join_applications + form_submissions) marked RESPONDED after 30 days

-- 1. Add status_updated_at to content_submissions if not already present
ALTER TABLE public.content_submissions ADD COLUMN IF NOT EXISTS status_updated_at timestamptz DEFAULT now();

-- 2. Ensure trigger function exists (idempotent re-create)
CREATE OR REPLACE FUNCTION public.update_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        NEW.status_updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Add trigger to content_submissions
DROP TRIGGER IF EXISTS tr_content_subs_status_timestamp ON public.content_submissions;
CREATE TRIGGER tr_content_subs_status_timestamp
    BEFORE UPDATE ON public.content_submissions
    FOR EACH ROW EXECUTE FUNCTION public.update_status_timestamp();

-- 4. Replace the purge function with an extended version covering all cases
CREATE OR REPLACE FUNCTION public.purge_old_records()
RETURNS void AS $$
BEGIN
    -- Delete REJECTED content submissions older than 30 days
    DELETE FROM public.content_submissions
    WHERE status = 'REJECTED'
      AND status_updated_at < now() - interval '30 days';

    -- Delete REJECTED join applications (any type) older than 30 days
    DELETE FROM public.join_applications
    WHERE status = 'REJECTED'
      AND status_updated_at < now() - interval '30 days';

    -- Delete RESPONDED / ACCEPTED inquiries from join_applications older than 30 days
    DELETE FROM public.join_applications
    WHERE status IN ('ACCEPTED', 'APPROVED', 'RESPONDED')
      AND type = 'INQUIRY'
      AND status_updated_at < now() - interval '30 days';

    -- Delete REJECTED form submissions older than 30 days
    DELETE FROM public.form_submissions
    WHERE status = 'REJECTED'
      AND status_updated_at < now() - interval '30 days';

    -- Delete APPROVED/RESPONDED inquiry form submissions older than 30 days
    DELETE FROM public.form_submissions
    WHERE status IN ('APPROVED', 'RESPONDED')
      AND form_id IN (
          SELECT id FROM public.form_definitions WHERE category ILIKE '%inquiry%'
      )
      AND status_updated_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql;

-- 5. Reschedule the cron job to use the new unified function
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        -- Remove the old job if it exists
        PERFORM cron.unschedule('daily-inquiry-purge');
        -- Schedule the new unified purge job daily at 02:00 UTC
        PERFORM cron.schedule('daily-records-purge', '0 2 * * *', 'SELECT public.purge_old_records()');
    END IF;
END $$;
-- Add is_maintenance_mode to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS is_maintenance_mode BOOLEAN DEFAULT FALSE;

-- Force a refresh of the schema cache
NOTIFY pgrst, 'reload schema';
-- Add is_published to practice_sets
ALTER TABLE practice_sets ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;

-- Force a refresh of the schema cache
NOTIFY pgrst, 'reload schema';
-- Migration to add action_deadline to events
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS action_deadline DATE;
-- Security Hardening Migration
-- 1. Hardening Audit Log Insertion
-- Revoke direct insert on audit_log from anon and authenticated
DROP POLICY IF EXISTS "System can insert audit log" ON public.audit_log;

-- Only allow service role to insert into audit log via direct API
-- Internal database functions (triggers) bypass RLS if they are security definer,
-- but the record_audit function is not security definer yet.
CREATE POLICY "Only service role can insert audit log" ON public.audit_log
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 2. Hardening site_settings and timeline_events
DROP POLICY IF EXISTS "Allow authenticated users to manage site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to manage timeline_events" ON public.timeline_events;

CREATE POLICY "Admin/Manager manage site_settings" ON public.site_settings
  FOR ALL USING (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER','WEBSITE_MANAGER'))
  );

CREATE POLICY "Admin/Manager manage timeline_events" ON public.timeline_events
  FOR ALL USING (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER','WEBSITE_MANAGER'))
  );

-- 3. Hardening practice exams
-- These were using auth.role() = 'authenticated' which is too permissive
DROP POLICY IF EXISTS "Enable write for admin only" ON public.practice_sets;
DROP POLICY IF EXISTS "Enable write for admin only" ON public.practice_questions;

CREATE POLICY "Admin/Manager manage practice sets" ON public.practice_sets
  FOR ALL USING (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER','WEBSITE_MANAGER'))
  );

CREATE POLICY "Admin/Manager manage practice questions" ON public.practice_questions
  FOR ALL USING (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER','WEBSITE_MANAGER'))
  );

-- 4. Hardening form builder and intake reminders
DROP POLICY IF EXISTS "Admin full access templates" ON public.email_templates;
DROP POLICY IF EXISTS "Admin full access definitions" ON public.form_definitions;
DROP POLICY IF EXISTS "Admin full access submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Admin full access reminders" ON public.intake_reminders;

CREATE POLICY "Admin/Manager manage email templates" ON public.email_templates
  FOR ALL USING (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER','WEBSITE_MANAGER'))
  );

CREATE POLICY "Admin/Manager manage form definitions" ON public.form_definitions
  FOR ALL USING (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER','WEBSITE_MANAGER'))
  );

CREATE POLICY "Admin/Manager manage form submissions" ON public.form_submissions
  FOR ALL USING (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER','WEBSITE_MANAGER'))
  );

CREATE POLICY "Admin/Manager manage reminders" ON public.intake_reminders
  FOR ALL USING (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER','WEBSITE_MANAGER'))
  );

-- 5. Hardening email event mappings
ALTER TABLE public.email_event_mappings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage event mappings" ON public.email_event_mappings;
CREATE POLICY "Admin manage event mappings" ON public.email_event_mappings
  FOR ALL USING (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MANAGER','WEBSITE_MANAGER'))
  );
CREATE POLICY "Public read event mappings" ON public.email_event_mappings
  FOR SELECT USING (true);
