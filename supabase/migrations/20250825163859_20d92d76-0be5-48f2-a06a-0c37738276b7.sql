-- Fix function security by setting search_path for existing functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, credits)
  VALUES (NEW.id, NEW.email, 0);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_credits(user_id_param uuid, credit_change integer, transaction_type text, description_text text DEFAULT NULL::text, stripe_payment_intent_id_param text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;