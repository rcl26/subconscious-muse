-- Fix RLS policies on user_events table for secure analytics

-- Drop the dangerous policy that gives public access to all events
DROP POLICY IF EXISTS "Service role can manage all events" ON public.user_events;

-- Drop the policy that allows users to view their own events (not needed for analytics)
DROP POLICY IF EXISTS "Users can view their own events" ON public.user_events;

-- Create a secure service role policy that ONLY allows the actual service_role to manage events
CREATE POLICY "Service role can manage events" 
ON public.user_events 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Recreate the insert policy to be more explicit for event tracking
DROP POLICY IF EXISTS "Users can insert their own events" ON public.user_events;
CREATE POLICY "Allow event tracking" 
ON public.user_events 
FOR INSERT 
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));