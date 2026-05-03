-- ============================================================
-- 03: Functions & Triggers
-- ============================================================

-- PROFILE HANDLING
-- Trigger for new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'WRITER')
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- UTILITIES
-- Slugify function for team members
CREATE OR REPLACE FUNCTION public.slugify(value TEXT) RETURNS TEXT AS $$
BEGIN
    RETURN trim(BOTH '-' FROM regexp_replace(lower(value), '[^a-z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

-- ROLE HELPERS
-- Shared Admin/Manager/WebsiteManager role check helper
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER', 'WEBSITE_MANAGER')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- AUDIT LOGGING
-- Audit log recorder
CREATE OR REPLACE FUNCTION public.record_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_log (actor_id, action, entity_type, entity_id, meta)
    VALUES (auth.uid(), TG_ARGV[0], TG_TABLE_NAME, (NEW).id, jsonb_build_object('data', row_to_json(NEW)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STATUS TRACKING
-- Status timestamp updater
CREATE OR REPLACE FUNCTION public.update_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        NEW.status_updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_join_apps_status_timestamp
    BEFORE UPDATE ON public.join_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_status_timestamp();

CREATE TRIGGER tr_form_subs_status_timestamp
    BEFORE UPDATE ON public.form_submissions
    FOR EACH ROW EXECUTE FUNCTION public.update_status_timestamp();

-- MAINTENANCE
-- Purge old records
CREATE OR REPLACE FUNCTION public.purge_old_records()
RETURNS void AS $$
BEGIN
    -- Delete REJECTED applications older than 30 days
    DELETE FROM public.join_applications
    WHERE status = 'REJECTED' AND status_updated_at < NOW() - INTERVAL '30 days';

    -- Delete RESPONDED inquiries
    DELETE FROM public.join_applications
    WHERE status IN ('ACCEPTED', 'APPROVED', 'RESPONDED')
      AND type = 'INQUIRY'
      AND status_updated_at < NOW() - INTERVAL '30 days';

    -- Delete REJECTED form submissions
    DELETE FROM public.form_submissions
    WHERE status = 'REJECTED' AND status_updated_at < NOW() - INTERVAL '30 days';

    -- Delete APPROVED/RESPONDED inquiry form submissions
    DELETE FROM public.form_submissions
    WHERE status IN ('APPROVED', 'RESPONDED')
      AND form_id IN (SELECT id FROM public.form_definitions WHERE category = 'INQUIRY')
      AND status_updated_at < NOW() - INTERVAL '30 days';

    -- Delete old audit logs
    DELETE FROM public.audit_log
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
