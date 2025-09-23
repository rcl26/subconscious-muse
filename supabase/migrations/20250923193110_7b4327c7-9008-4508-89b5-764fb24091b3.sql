-- Reset onboarding status for testing
UPDATE public.profiles 
SET onboarding_completed = false 
WHERE id = (SELECT id FROM auth.users WHERE email = 'ryanlatorre26@gmail.com');