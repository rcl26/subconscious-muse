-- Fix security warnings by setting search_path in functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits)
  VALUES (NEW.id, NEW.email, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.update_user_credits(
  user_id_param UUID,
  credit_change INTEGER,
  transaction_type TEXT,
  description_text TEXT DEFAULT NULL,
  stripe_payment_intent_id_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Get current credits
  SELECT credits INTO current_credits FROM public.profiles WHERE id = user_id_param;
  
  -- Check if user has enough credits for usage (negative changes)
  IF credit_change < 0 AND current_credits + credit_change < 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Update credits
  UPDATE public.profiles 
  SET credits = credits + credit_change, updated_at = NOW() 
  WHERE id = user_id_param;
  
  -- Record transaction
  INSERT INTO public.credit_transactions (user_id, type, amount, description, stripe_payment_intent_id)
  VALUES (user_id_param, transaction_type, credit_change, description_text, stripe_payment_intent_id_param);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';