-- Create user_events table for analytics tracking
CREATE TABLE public.user_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Create policies for user privacy
CREATE POLICY "Users can view their own events" 
ON public.user_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events" 
ON public.user_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can manage all events" 
ON public.user_events 
FOR ALL 
USING (true);

-- Create indexes for efficient querying
CREATE INDEX idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX idx_user_events_event_type ON public.user_events(event_type);
CREATE INDEX idx_user_events_created_at ON public.user_events(created_at);
CREATE INDEX idx_user_events_user_type_date ON public.user_events(user_id, event_type, created_at);

-- Create function to get Weekly Active Users (excluding sign-in-only users)
CREATE OR REPLACE FUNCTION public.get_weekly_active_users(start_date DATE DEFAULT CURRENT_DATE - INTERVAL '7 days')
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT user_id)
    FROM public.user_events
    WHERE created_at >= start_date
    AND created_at < start_date + INTERVAL '7 days'
    AND user_id IS NOT NULL
    AND event_type IN ('journal_page_viewed', 'record_dream_clicked', 'dream_saved', 'dream_explored')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create function to get dream funnel metrics
CREATE OR REPLACE FUNCTION public.get_dream_funnel_metrics(start_date DATE DEFAULT CURRENT_DATE - INTERVAL '7 days')
RETURNS TABLE(
  clicked_record INTEGER,
  saved_dream INTEGER,
  explored_dream INTEGER,
  click_to_save_rate NUMERIC,
  save_to_explore_rate NUMERIC
) AS $$
DECLARE
  clicked_count INTEGER;
  saved_count INTEGER;
  explored_count INTEGER;
BEGIN
  -- Get counts for each funnel step
  SELECT COUNT(*) INTO clicked_count
  FROM public.user_events
  WHERE event_type = 'record_dream_clicked'
  AND created_at >= start_date
  AND created_at < start_date + INTERVAL '7 days';
  
  SELECT COUNT(*) INTO saved_count
  FROM public.user_events
  WHERE event_type = 'dream_saved'
  AND created_at >= start_date
  AND created_at < start_date + INTERVAL '7 days';
  
  SELECT COUNT(*) INTO explored_count
  FROM public.user_events
  WHERE event_type = 'dream_explored'
  AND created_at >= start_date
  AND created_at < start_date + INTERVAL '7 days';
  
  -- Return results with conversion rates
  RETURN QUERY SELECT
    clicked_count,
    saved_count,
    explored_count,
    CASE WHEN clicked_count > 0 THEN ROUND((saved_count::NUMERIC / clicked_count::NUMERIC) * 100, 2) ELSE 0 END,
    CASE WHEN saved_count > 0 THEN ROUND((explored_count::NUMERIC / saved_count::NUMERIC) * 100, 2) ELSE 0 END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;