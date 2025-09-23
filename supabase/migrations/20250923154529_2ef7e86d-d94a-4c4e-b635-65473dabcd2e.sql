-- Add onboarding columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN preferred_name TEXT,
ADD COLUMN dream_frequency TEXT,
ADD COLUMN goals_with_oneira TEXT,
ADD COLUMN referral_source TEXT;