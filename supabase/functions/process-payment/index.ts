import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === "paid" && session.metadata?.user_id) {
      const userId = session.metadata.user_id;
      
      if (session.mode === "payment") {
        // One-time payment - add credits
        const credits = parseInt(session.metadata.credits || "0");
        
        const { data, error } = await supabaseService.rpc('update_user_credits', {
          user_id_param: userId,
          credit_change: credits,
          transaction_type: 'purchase',
          description_text: `Purchased ${credits} credits`,
          stripe_payment_intent_id_param: session.payment_intent as string
        });

        if (error) {
          throw error;
        }

        return new Response(JSON.stringify({ 
          success: true, 
          credits_added: credits 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: false, 
      message: "Payment not completed or invalid" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
    
  } catch (error) {
    console.error("Payment processing error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});