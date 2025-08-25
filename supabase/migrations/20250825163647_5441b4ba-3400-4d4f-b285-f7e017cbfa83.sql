-- Add conversations column to dreams table to store chat history
ALTER TABLE public.dreams 
ADD COLUMN conversations JSONB DEFAULT '[]'::jsonb;