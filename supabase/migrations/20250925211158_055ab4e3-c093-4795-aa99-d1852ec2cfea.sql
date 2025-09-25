-- Clean up existing email data from user_events table for security
UPDATE public.user_events SET email = NULL;

-- Remove the email column entirely to prevent future data collection
ALTER TABLE public.user_events DROP COLUMN email;