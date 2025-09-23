-- Add referral_source_detail column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN referral_source_detail text;