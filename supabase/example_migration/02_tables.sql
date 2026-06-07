-- ============================================================
-- 02: Tables
-- ============================================================

-- PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    username TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'WRITER' CHECK (role IN ('ADMIN', 'MANAGER', 'WRITER', 'WEBSITE_MANAGER')),
    avatar_url TEXT,
    has_completed_onboarding BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TEAM MEMBERS
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    position TEXT NOT NULL CHECK (position IN ('President', 'Manager', 'MINion')),
    bio TEXT,
    photo_url TEXT,
    tenure TEXT NOT NULL,
    joined_date DATE NOT NULL,
    farewell_date DATE,
    social_links JSONB DEFAULT '{}',
    certificate_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_advisor BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ALUMNI', 'INACTIVE', 'REMOVED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EVENTS
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    location TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    action_deadline DATE,
    cover_url TEXT,
    gallery_urls JSONB DEFAULT '[]',
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    event_type TEXT DEFAULT 'EVENT' CHECK (event_type IN ('RECURRING', 'EVERGOING', 'SPECIAL', 'EVENT')),
    action_link TEXT,
    action_text TEXT,
    action_title TEXT DEFAULT 'Registration / Action Required',
    action_description TEXT DEFAULT 'Follow the link to participate or register for this event.',
    show_date BOOLEAN DEFAULT TRUE,
    show_action_link BOOLEAN DEFAULT TRUE,
    show_youtube_playlist BOOLEAN DEFAULT TRUE,
    youtube_playlist TEXT,
    youtube_url TEXT,
    youtube_title TEXT DEFAULT 'Event Recordings',
    youtube_videos JSONB DEFAULT '[]',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROGRAMS
CREATE TABLE public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    display_order INT DEFAULT 0,
    learn_more_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT
CREATE TABLE public.content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ARTICLE', 'PROBLEM', 'BLOG', 'RESOURCE', 'VIDEO')),
    content_type TEXT NOT NULL CHECK (content_type IN ('RICHTEXT', 'PDF', 'LINK', 'VIDEO')),
    body TEXT,
    pdf_url TEXT,
    pdf_filename TEXT,
    video_url TEXT,
    video_metadata JSONB DEFAULT '{}',
    excerpt TEXT,
    cover_url TEXT,
    tags TEXT[] DEFAULT '{}',
    author_name TEXT,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    display_order INT DEFAULT 0,
    published_at TIMESTAMPTZ,
    published_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT SUBMISSIONS
CREATE TABLE public.content_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submitter_name TEXT NOT NULL,
    submitter_email TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('RICHTEXT', 'PDF', 'LINK')),
    body TEXT,
    pdf_url TEXT,
    pdf_filename TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    status_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GALLERY
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    album TEXT,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    taken_at DATE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE SETTINGS
CREATE TABLE public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    site_logo_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    linkedin_url TEXT,
    contact_email TEXT DEFAULT 'contact@mathsinitiatives.org.np',
    hero_badge TEXT DEFAULT 'Global Innovation Award Winner',
    hero_title TEXT DEFAULT 'Elevating Nepal Through Mathematics.',
    hero_subtitle TEXT DEFAULT 'Igniting curiosity and fostering excellence across Nepal.',
    hero_cta_text TEXT DEFAULT 'Join the Movement',
    hero_cta_link TEXT DEFAULT '/join',
    hero_image_url TEXT,
    mission_badge TEXT DEFAULT 'Our Mission',
    mission_title TEXT DEFAULT 'Empowering the next generation of thinkers.',
    mission_description TEXT,
    mission_image_url TEXT,
    mission_rec_title TEXT DEFAULT 'Recognized Globally',
    mission_rec_desc TEXT DEFAULT 'Top 100 Global Education Innovations by HundrED.',
    recognition_image_url TEXT,
    mission_f1_title TEXT, mission_f1_desc TEXT,
    mission_f2_title TEXT, mission_f2_desc TEXT,
    mission_f3_title TEXT, mission_f3_desc TEXT,
    mission_f4_title TEXT, mission_f4_desc TEXT,
    about_hero_title TEXT, about_hero_description TEXT,
    about_vision_text TEXT, about_mission_text TEXT,
    about_rec_title TEXT, about_rec_description TEXT,
    about_rec_badge_title TEXT, about_rec_badge_desc TEXT,
    about_rec_image TEXT,
    team_title TEXT, team_subtitle TEXT, team_description TEXT,
    events_title TEXT, events_subtitle TEXT, events_description TEXT,
    gallery_title TEXT, gallery_subtitle TEXT, gallery_description TEXT,
    join_title TEXT, join_subtitle TEXT, join_description TEXT,
    contact_title TEXT, contact_subtitle TEXT, contact_description TEXT,
    programs_title TEXT DEFAULT 'Our Strategic Programs',
    programs_subtitle TEXT DEFAULT 'Shaping the Future of Math',
    stats_title TEXT DEFAULT 'Our Growing Impact',
    stats_subtitle TEXT DEFAULT 'Numbers that drive our mission forward',
    stat_students_count TEXT DEFAULT '1400+',
    stat_volunteers_count TEXT DEFAULT '50+',
    stat_programs_count TEXT DEFAULT '15+',
    stat_years_count TEXT DEFAULT '5+',
    rto_title TEXT, rto_subtitle TEXT, rto_description TEXT,
    rto_stages JSONB DEFAULT '[]',
    rto_roadmap JSONB DEFAULT '[]',
    rto_resources JSONB DEFAULT '[]',
    dmopractice_badge TEXT,
    dmopractice_title TEXT,
    dmopractice_subtitle TEXT,
    dmopractice_description TEXT,
    join_badge TEXT DEFAULT 'Identify Your Path',
    join_features JSONB DEFAULT '[]',
    join_paths JSONB DEFAULT '[]',
    join_faqs JSONB DEFAULT '[]',
    active_volunteer_batch TEXT DEFAULT 'General',
    join_cta_title TEXT,
    join_cta_description TEXT,
    join_cta_btn_text TEXT,
    join_cta_image_url TEXT,
    join_cta_stat_title TEXT,
    join_cta_stat_desc TEXT,
    default_team_photo TEXT,
    default_event_cover TEXT,
    default_notice_image TEXT,
    default_program_image TEXT,
    default_content_image TEXT,
    team_identity_assets JSONB DEFAULT '[]',
    footer_description TEXT,
    is_maintenance_mode BOOLEAN DEFAULT FALSE,
    updated_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE STATS (Singleton)
CREATE TABLE public.site_stats (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    students_reached INT DEFAULT 1400,
    volunteers_count INT DEFAULT 50,
    programs_count INT DEFAULT 15,
    years_of_impact INT DEFAULT 5,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.site_stats (id) VALUES (1) ON CONFLICT DO NOTHING;

-- TIMELINE EVENTS
CREATE TABLE public.timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRACTICE SYSTEM
CREATE TABLE public.practice_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    time_limit INTEGER DEFAULT 60,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.practice_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    set_id UUID REFERENCES public.practice_sets(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    marks INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    image_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- APPLICATIONS & FORMS
CREATE TABLE public.join_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    type TEXT NOT NULL,
    motivation TEXT,
    experience TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED', 'RESPONDED')),
    notes TEXT,
    form_data JSONB DEFAULT '{}',
    batch_name TEXT DEFAULT 'General',
    status_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.email_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    body_markdown TEXT NOT NULL,
    action TEXT,
    from_name TEXT DEFAULT 'Mathematics Initiatives in Nepal',
    from_email TEXT DEFAULT 'no-reply@mathsinitiatives.org.np',
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.form_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('VOLUNTEER', 'ORGANIZATION', 'AMBASSADOR', 'OTHER', 'INQUIRY')) DEFAULT 'VOLUNTEER',
    fields JSONB NOT NULL DEFAULT '[]',
    email_template_id TEXT REFERENCES public.email_templates(id) ON UPDATE CASCADE ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    deadline TIMESTAMPTZ,
    batch_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.form_definitions(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'APPROVED', 'REJECTED', 'WAITLISTED', 'RESPONDED')),
    notes TEXT,
    status_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.email_event_mappings (
    event_key TEXT PRIMARY KEY,
    template_id TEXT REFERENCES public.email_templates(id) ON UPDATE CASCADE ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.intake_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(email, category)
);

-- AUDIT & MAINTENANCE
CREATE TABLE public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.popup_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    cta_text TEXT,
    cta_url TEXT,
    image_url TEXT,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    target_pages TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
