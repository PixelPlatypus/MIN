-- ============================================================
-- 05: Indexes
-- ============================================================

-- TEAM MEMBERS
CREATE INDEX idx_team_members_status ON public.team_members (status);
CREATE INDEX idx_team_members_tenure ON public.team_members (tenure);
CREATE INDEX idx_team_members_display_order ON public.team_members (display_order);

-- CONTENT
CREATE INDEX idx_content_published_status_type ON public.content (type, published_at DESC) WHERE status = 'PUBLISHED';
CREATE INDEX idx_content_status ON public.content (status);
CREATE INDEX idx_content_submitted_by ON public.content (submitted_by);

-- EVENTS
CREATE INDEX idx_events_status_date ON public.events (status, start_date DESC);
CREATE INDEX idx_events_slug ON public.events (slug);

-- PROGRAMS
CREATE INDEX idx_programs_status ON public.programs (status);

-- GALLERY
CREATE INDEX idx_gallery_event_id ON public.gallery (event_id);
CREATE INDEX idx_gallery_album ON public.gallery (album);
CREATE INDEX idx_gallery_display_order ON public.gallery (display_order);

-- AUDIT LOG
CREATE INDEX idx_audit_log_created_at ON public.audit_log (created_at DESC);
CREATE INDEX idx_audit_log_actor_id ON public.audit_log (actor_id);
CREATE INDEX idx_audit_log_entity_type_id ON public.audit_log (entity_type, entity_id);

-- APPLICATIONS
CREATE INDEX idx_join_applications_status ON public.join_applications (status);
CREATE INDEX idx_join_applications_created_at ON public.join_applications (created_at DESC);
CREATE INDEX idx_join_applications_batch_name ON public.join_applications (batch_name);

-- PROFILES
CREATE INDEX idx_profiles_role ON public.profiles (role);

-- FORMS
CREATE INDEX idx_form_definitions_slug ON public.form_definitions (slug);
CREATE INDEX idx_form_definitions_category ON public.form_definitions (category);
CREATE INDEX idx_form_submissions_form_id ON public.form_submissions (form_id);
CREATE INDEX idx_form_submissions_status ON public.form_submissions (status);

-- PRACTICE
CREATE INDEX idx_practice_sets_is_published ON public.practice_sets (is_published) WHERE is_published = TRUE;
