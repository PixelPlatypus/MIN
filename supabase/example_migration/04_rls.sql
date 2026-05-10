-- ============================================================
-- 04: RLS & Policies
-- ============================================================

-- ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_event_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popup_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin/Manager read all profiles" ON public.profiles FOR SELECT USING (public.is_admin_or_manager());
CREATE POLICY "Admin update any profile" ON public.profiles FOR UPDATE USING (public.is_admin_or_manager()) WITH CHECK (public.is_admin_or_manager());
CREATE POLICY "Users update own onboarding" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Team Members
CREATE POLICY "Public read team" ON public.team_members FOR SELECT USING (TRUE);
CREATE POLICY "Admin/Manager manage team" ON public.team_members FOR ALL USING (public.is_admin_or_manager());

-- Events
CREATE POLICY "Public read published events" ON public.events FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admin/Manager see all events" ON public.events FOR SELECT USING (public.is_admin_or_manager());
CREATE POLICY "Admin/Manager manage events" ON public.events FOR ALL USING (public.is_admin_or_manager());

-- Programs
CREATE POLICY "Public read active programs" ON public.programs FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Admin/Manager manage programs" ON public.programs FOR ALL USING (public.is_admin_or_manager());

-- Content
CREATE POLICY "Public read published content" ON public.content FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Writer/Admin see all content" ON public.content FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER', 'WRITER'))
);
CREATE POLICY "Writers manage own draft content" ON public.content FOR ALL USING (submitted_by = auth.uid() AND status = 'DRAFT');
CREATE POLICY "Admin/Manager manage all content" ON public.content FOR ALL USING (public.is_admin_or_manager());

-- Content Submissions
CREATE POLICY "Anyone can submit" ON public.content_submissions FOR INSERT WITH CHECK (status = 'PENDING');
CREATE POLICY "Admin/Manager review submissions" ON public.content_submissions FOR ALL USING (public.is_admin_or_manager());

-- Site Settings
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admin/Manager manage site settings" ON public.site_settings FOR ALL USING (public.is_admin_or_manager());

-- Site Stats
CREATE POLICY "Public read stats" ON public.site_stats FOR SELECT USING (TRUE);
CREATE POLICY "Admin update stats" ON public.site_stats FOR UPDATE USING (public.is_admin_or_manager()) WITH CHECK (public.is_admin_or_manager());

-- Practice sets/questions
CREATE POLICY "Public read published practice" ON public.practice_sets FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admin/Manager manage practice" ON public.practice_sets FOR ALL USING (public.is_admin_or_manager());
CREATE POLICY "Public read practice questions" ON public.practice_questions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.practice_sets WHERE id = set_id AND is_published = TRUE)
);
CREATE POLICY "Admin/Manager manage practice questions" ON public.practice_questions FOR ALL USING (public.is_admin_or_manager());

-- Forms & Applications
CREATE POLICY "Public submit forms" ON public.form_submissions FOR INSERT WITH CHECK (status = 'PENDING');
CREATE POLICY "Public read active forms" ON public.form_definitions FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin/Manager manage forms" ON public.form_definitions FOR ALL USING (public.is_admin_or_manager());
CREATE POLICY "Admin/Manager manage submissions" ON public.form_submissions FOR ALL USING (public.is_admin_or_manager());

-- Audit Log
CREATE POLICY "Only service role can insert audit log" ON public.audit_log FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admin read audit log" ON public.audit_log FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Notifications
CREATE POLICY "Public read active notices" ON public.popup_notices FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin manage notices" ON public.popup_notices FOR ALL USING (public.is_admin_or_manager());

-- Timeline
CREATE POLICY "Public read timeline" ON public.timeline_events FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage timeline" ON public.timeline_events FOR ALL USING (public.is_admin_or_manager());

-- Email mappings/templates
CREATE POLICY "Public read event mappings" ON public.email_event_mappings FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage email system" ON public.email_templates FOR ALL USING (public.is_admin_or_manager());
CREATE POLICY "Admin manage mappings" ON public.email_event_mappings FOR ALL USING (public.is_admin_or_manager());

-- Intake reminders
CREATE POLICY "Public submit reminders" ON public.intake_reminders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin manage reminders" ON public.intake_reminders FOR ALL USING (public.is_admin_or_manager());

-- Gallery
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT USING (TRUE);
CREATE POLICY "Admin/Manager manage gallery" ON public.gallery FOR ALL USING (public.is_admin_or_manager());

-- Final Notify
NOTIFY pgrst, 'reload schema';
