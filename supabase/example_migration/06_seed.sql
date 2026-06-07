-- ============================================================
-- 06: Seed Data (Modular & Generic)
-- ============================================================

-- 1. AUTH ADMIN USER
-- Email: admin@example.com
-- Password: securepassword123
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
  created_at, updated_at, confirmation_token, recovery_token, 
  email_change_token_new, email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'admin@example.com',
  crypt('securepassword123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "MIN Admin", "role": "ADMIN", "username": "admin"}',
  now(), now(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Profile is auto-created by trigger, but let's ensure it has the correct role and username
UPDATE public.profiles 
SET role = 'ADMIN', username = 'admin' 
WHERE id = '00000000-0000-0000-0000-000000000000';

-- 2. SITE SETTINGS (Core Configuration)
INSERT INTO public.site_settings (
  id, hero_title, hero_subtitle, hero_badge, hero_cta_text, hero_cta_link,
  mission_title, mission_description, mission_badge, 
  mission_rec_title, mission_rec_desc,
  about_hero_title, about_hero_description, about_vision_text, about_mission_text,
  about_rec_title, about_rec_description, about_rec_badge_title, about_rec_badge_desc,
  team_title, team_subtitle, team_description,
  events_title, events_subtitle, events_description,
  gallery_title, gallery_subtitle, gallery_description,
  join_title, join_subtitle, join_description,
  contact_title, contact_subtitle, contact_description,
  rto_title, rto_subtitle, rto_description,
  rto_stages, rto_roadmap, rto_resources,
  join_badge, join_features, join_paths, join_faqs,
  dmopractice_title, dmopractice_subtitle, dmopractice_description, dmopractice_badge,
  stat_students_count, stat_volunteers_count, stat_programs_count, stat_years_count,
  facebook_url, instagram_url, youtube_url, linkedin_url, contact_email,
  default_team_photo, default_event_cover, default_notice_image, default_program_image, default_content_image
) VALUES (
  'main',
  'Elevating Nepal Through Mathematics.',
  'Igniting curiosity and fostering excellence across Nepal. We''re building a future where every student views mathematics as a tool for innovation.',
  'Global Innovation Award Winner',
  'Join the Movement',
  '/join',
  
  -- Mission
  'Empowering the next generation of thinkers and problem solvers.',
  'At MIN, we believe that mathematics is more than just numbers and formulas. It''s a powerful tool for understanding the world, driving innovation, and creating impact.',
  'Our Mission',
  'Recognized Globally',
  'Top 100 Global Education Innovations by HundrED.',
  
  -- About Page
  'Transforming Math Education in Nepal',
  'Mathematics Initiatives in Nepal (MIN) is a non-profit organization dedicated to making mathematics accessible, engaging, and inspiring for all students across the country.',
  'To build a Nepal where every student is empowered with logical thinking and problem-solving skills.',
  'To democratize math education through innovative programs, community outreach, and high-quality digital resources.',
  'Globally Recognized Innovation',
  'Our commitment to excellence was recognized by HundrED, identifying MIN as one of the Top 100 most inspiring global education innovations.',
  'HundrED Top 100',
  'Global Education Innovation Award',

  -- Page Headers
  'Our Team', 'Meet the MIN Family', 'A diverse group of educators, volunteers, and math enthusiasts working together.',
  'Events & Programs', 'Learning Beyond the Classroom', 'Join our upcoming workshops, olympiads, and bootcamps.',
  'Visual Journey', 'Capturing Moments of Impact', 'Explore our activities through our curated collection of photographs.',
  'Join the Movement', 'Become a Part of MIN', 'Help us transform mathematics education in Nepal.',
  'Get in Touch', 'We''d Love to Hear From You', 'Have questions about our programs or want to collaborate?',

  -- RTO
  'The Challenge Awaits', 'Road to Olympiad', 'Your comprehensive guide to navigating the RTO process.',
  '[
    {"id": "DMO", "name": "District Math Olympiad", "desc": "The first step. Open to thousands of students across districts in Nepal.", "icon": "MapPin"},
    {"id": "PMO", "name": "Provincial Math Olympiad", "desc": "Top performers from districts compete at the provincial level.", "icon": "Flag"},
    {"id": "NMO", "name": "National Math Olympiad", "desc": "The elite few battle it out nationally to enter the training camp.", "icon": "Award"},
    {"id": "IMO", "name": "International Math Olympiad", "desc": "Representing Nepal on the global stage.", "icon": "Globe"}
  ]',
  '[
    {"phase": "Phase 1 - Foundation", "timeline": "Before DMO", "goal": "Build strong fundamentals.", "color": "from-blue-500/20 to-cyan-500/20", "borderColor": "border-blue-500/30", "iconColor": "text-blue-500", "items": [{"label": "Arithmetic & Algebra", "desc": "Revise school concepts"}, {"label": "Number Theory", "desc": "GCD, LCM, Modular arithmetic"}]},
    {"phase": "Phase 2 - PMO Prep", "timeline": "Intermediate", "goal": "Deepen concepts.", "color": "from-emerald-500/20 to-teal-500/20", "borderColor": "border-emerald-500/30", "iconColor": "text-emerald-500", "items": [{"label": "Inequalities", "desc": "AM-GM, Cauchy-Schwarz"}, {"label": "Geometry", "desc": "Cyclic quadrilaterals"}]}
  ]',
  '[
    {"title": "Books", "icon": "Library", "items": [{"name": "AoPS Vol 1", "url": "#"}, {"name": "Problem Solving Strategies", "url": "#"}]},
    {"title": "Online", "icon": "Globe", "items": [{"name": "Brilliant.org", "url": "https://brilliant.org"}]}
  ]',

  -- Join Us Page
  'Identify Your Path',
  '[
    {"title": "Purpose Driven", "desc": "Contribute to projects that improve math education in Nepal."},
    {"title": "Global Network", "desc": "Collaborate with innovators from across the globe."}
  ]',
  '[
    {"id": "vol", "slug": "volunteer", "title": "Volunteer", "desc": "Join our operational teams.", "perks": ["Certificate", "Networking"], "icon": "Heart"},
    {"id": "amb", "slug": "ambassador", "title": "Ambassador", "desc": "Lead the movement in your region.", "perks": ["Leadership Role", "Mentorship"], "icon": "Globe"}
  ]',
  '[
    {"question": "Can I join remotely?", "answer": "Yes, many of our roles are fully remote."},
    {"question": "Do I need a math degree?", "answer": "Not at all! We need writers, designers, and organizers."}
  ]',

  -- DMO Practice
  'Master the DMO', 'Experience the Competition', 'Practice with our curated mock exams to prepare for the District Math Olympiad.', 'Official Practice Portal',

  -- Stats
  '1400+', '50+', '15+', '5+',

  -- Socials & Email
  '#', '#', '#', '#', 'contact@example.com',

  -- Assets (Generic placeholders)
  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1000'
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 3. TIMELINE EVENTS
INSERT INTO public.timeline_events (year, title, description, sort_order) VALUES
('2020', 'Foundation', 'Established by a group of passionate math enthusiasts.', 1),
('2021', 'Expansion', 'Launched nationwide programs reaching students across Nepal.', 2),
('2024', 'Global Recognition', 'Identified as a top global education innovation.', 3);

-- 4. PROGRAMS
INSERT INTO public.programs (name, slug, tagline, status, display_order) VALUES
('District Math Olympiad (DMO)', 'dmo', 'The first step for thousands.', 'ACTIVE', 1),
('Provincial Math Olympiad (PMO)', 'pmo', 'Competitive stage for top performers.', 'ACTIVE', 2),
('National Math Olympiad (NMO)', 'nmo', 'The elite battle for camp selection.', 'ACTIVE', 3);

-- 5. TEAM MEMBERS
INSERT INTO public.team_members (name, slug, position, tenure, joined_date, status, is_active) VALUES
('Example Member 1', 'example-1', 'President', '2024', '2020-01-01', 'ACTIVE', TRUE),
('Example Member 2', 'example-2', 'Manager', '2025', '2021-06-15', 'ACTIVE', TRUE),
('Example Member 3', 'example-3', 'MINion', '2025', '2022-03-10', 'ACTIVE', TRUE);

-- 6. CONTENT (Articles & Videos)
INSERT INTO public.content (title, slug, type, content_type, excerpt, author_name, status, display_order, video_url, cover_url) VALUES
('Getting Started with Number Theory', 'getting-started-nt', 'ARTICLE', 'RICHTEXT', 'A basic guide to number theory for beginners.', 'Academic Team', 'PUBLISHED', 1, NULL, 'https://images.unsplash.com/photo-1509228468518-180dd4864904'),
('Sample Video Resource', 'sample-video', 'VIDEO', 'VIDEO', 'An educational video exploring logic.', 'Video Team', 'PUBLISHED', 2, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg');

-- 7. PRACTICE SYSTEM
INSERT INTO public.practice_sets (id, name, time_limit, is_published) VALUES
('d1111111-1111-1111-1111-111111111111', 'Sample Mock Exam', 60, TRUE);

INSERT INTO public.practice_questions (set_id, question_text, option_a, option_b, option_c, option_d, correct_option, marks, sort_order, youtube_url) VALUES
('d1111111-1111-1111-1111-111111111111', 'What is 1 + 1?', '1', '2', '3', '4', 'B', 1, 1, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

-- 8. EMAIL TEMPLATES
INSERT INTO public.email_templates (id, name, subject, body_markdown) VALUES
('application_received', 'Application Received', 'Hi {{name}}, we have received your application.'),
('inquiry_response', 'Message Received', 'Thank you for reaching out, {{applicant_name}}!');

INSERT INTO public.email_event_mappings (event_key, template_id) VALUES
('inquiry_received', 'inquiry_response');
