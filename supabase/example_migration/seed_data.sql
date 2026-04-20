-- MIN Dummy Data for Local Development
-- This file contains example data for the (MIN) codebase.
-- Contributors can use this to quickly populate their local Supabase instances.

-- 1. Site Settings (Core configuration)
INSERT INTO public.site_settings (
  id, 
  hero_title, 
  hero_subtitle, 
  hero_badge,
  hero_cta_text,
  hero_cta_link,
  rto_title,
  rto_subtitle,
  dmopractice_badge,
  dmopractice_title,
  dmopractice_subtitle,
  dmopractice_description,
  contact_email,
  about_hero_title,
  about_hero_description,
  about_vision_text,
  about_mission_text,
  team_title,
  team_subtitle,
  team_description,
  events_title,
  events_subtitle,
  events_description,
  gallery_title,
  gallery_subtitle,
  gallery_description,
  join_title,
  join_subtitle,
  join_description,
  contact_title,
  contact_subtitle,
  contact_description
) VALUES (
  'main', 
  'Empowering Students Across Nepal', 
  'Through innovative mathematics education, we are bridging the gap to global excellence.', 
  'Top Innovation Program',
  'Join Us',
  '/join',
  'The Challenge Awaits',
  'Road to Olympiad',
  'Official Practice Portal',
  'Master the DMO <br />',
  'One Set at a Time.',
  'Experience a realistic competition environment with our curated mock exams.',
  'hello@mathsinitiatives.org.np',
  
  -- About Page
  'Who We Are',
  'We are a network of passionate educators and alumni.',
  'Our vision is to see a mathematically empowered Nepal.',
  'Finding and training the brightest minds.',
  
  -- Team Page
  'Meet the Minds',
  'The Team Behind MIN',
  'A diverse group of volunteers and professionals dedicated to our cause.',
  
  -- Events Page
  'Program Overview',
  'Our Active Initiatives',
  'Explore the workshops, seminars, and camps we organize throughout the year.',
  
  -- Gallery Page
  'Visual Journey',
  'A Look Back',
  'Memories from our previous olympiads and training camps.',
  
  -- Join Page
  'Become a Part of It',
  'Join the Movement',
  'Whether as a student, volunteer, or sponsor, there is a place for you.',
  
  -- Contact Page
  'Reach Out to Us',
  'Let us connect',
  'Have questions? We are here to help.'
) ON CONFLICT (id) DO NOTHING;

-- 2. Timeline Events
INSERT INTO public.timeline_events (id, year, title, description, sort_order) VALUES
(gen_random_uuid(), '2020', 'Foundation of MIN', 'Started by passionate math olympiad alumni to democratize access.', 1),
(gen_random_uuid(), '2021', 'First ETA', 'Successfully conducted the ETA across multiple locations.', 2),
(gen_random_uuid(), '2025', 'Digital Expansion', 'Launched the central online hub for students and volunteers.', 3);

-- 3. Programs
INSERT INTO public.programs (id, name, tagline, description, status) VALUES
(gen_random_uuid(), 'District Math Olympiad (DMO)', 'The entry point', 'Open to thousands of students across districts in Nepal to test their mathematical limits.', 'ACTIVE'),
(gen_random_uuid(), 'Provincial Math Olympiad (PMO)', 'The next stage', 'Top performers from districts compete at the provincial level.', 'ACTIVE'),
(gen_random_uuid(), 'National Math Olympiad (NMO)', 'Elite tier competition', 'The nationwide battle deciding who gets into the central training camp.', 'INACTIVE');

-- 4. Practice Sets (DMO Mock Exams)
INSERT INTO public.practice_sets (id, name, time_limit) VALUES
(gen_random_uuid(), 'DMO Official Mock Exam 1', 90),
(gen_random_uuid(), 'DMO Official Mock Exam 2', 120);

-- 5. Notice Popups
INSERT INTO public.popup_notices (id, title, body, cta_text, cta_url, is_active, target_pages) VALUES
(gen_random_uuid(), 'DMO Registrations Open!', 'The 2026 District Math Olympiad is now accepting applications. Secure your spot today.', 'Register Now', '/join', true, ARRAY['ALL']);

-- 6. Team Members
INSERT INTO public.team_members (id, name, position, bio, tenure, joined_date) VALUES
(gen_random_uuid(), 'Jane Doe', 'Executive Director', 'Former IMO participant dedicated to math education in Nepal.', '2024', current_date),
(gen_random_uuid(), 'John Smith', 'Academic Head', 'Curriculum designer for the National Camp.', '2025', current_date);

-- 7. Local Admin Setup (Auth User)
-- Email: admin@mathsinitiatives.org.np
-- Username: admin
-- Password: password123
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@mathsinitiatives.org.np',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Local Admin", "role": "ADMIN", "username": "admin"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Force the profile to be an ADMIN and set the custom username in case the trigger didn't map it properly
UPDATE public.profiles 
SET 
  role = 'ADMIN',
  username = 'admin'
WHERE email = 'admin@mathsinitiatives.org.np';
