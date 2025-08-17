-- Create dreams table
CREATE TABLE public.dreams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  analysis TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dreams ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own dreams" 
ON public.dreams 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dreams" 
ON public.dreams 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dreams" 
ON public.dreams 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dreams" 
ON public.dreams 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dreams_updated_at
BEFORE UPDATE ON public.dreams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_dreams_user_id ON public.dreams(user_id);
CREATE INDEX idx_dreams_date ON public.dreams(date DESC);