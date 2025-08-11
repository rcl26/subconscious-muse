-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  plan_type TEXT CHECK (plan_type IN ('monthly_300')),
  credits_per_month INTEGER DEFAULT 300,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
  FOR ALL WITH CHECK (true);

-- Create credit transactions table for tracking purchases and usage
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('purchase', 'usage', 'subscription_grant')),
  amount INTEGER NOT NULL,
  description TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for credit transactions
CREATE POLICY "Users can view own transactions" ON public.credit_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage transactions" ON public.credit_transactions
  FOR ALL WITH CHECK (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits)
  VALUES (NEW.id, NEW.email, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update credits
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
$$ LANGUAGE plpgsql SECURITY DEFINER;