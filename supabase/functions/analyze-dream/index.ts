// Dream Analysis Edge Function - v6.0 - Robust Secret Access
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache for API key to avoid repeated vault calls
let cachedApiKey: string | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getOpenAIApiKey(): Promise<string> {
  console.log('🔑 Retrieving OpenAI API key...');
  
  // Get the API key from environment
  const envKey = Deno.env.get('OPENAI_API_KEY');
  console.log('🔍 Env key exists:', !!envKey);
  console.log('🔍 Env key length:', envKey?.length || 0);
  console.log('🔍 Env key starts with sk-:', envKey?.startsWith('sk-') || false);
  
  // Log all environment variables for debugging
  const allEnvVars = Object.keys(Deno.env.toObject());
  console.log('🔍 Available env vars:', allEnvVars.filter(k => k.includes('OPENAI') || k.includes('API')));
  
  if (!envKey || !envKey.trim()) {
    console.error('❌ OpenAI API key is empty or missing');
    throw new Error('OpenAI API key not configured in environment variables');
  }
  
  if (!envKey.startsWith('sk-')) {
    console.error('❌ OpenAI API key has invalid format (should start with sk-)');
    throw new Error('OpenAI API key has invalid format');
  }
  
  console.log('✅ Got valid API key from environment');
  return envKey;
}

serve(async (req) => {
  console.log('🚀 Dream Analysis Function v6.0 - Robust Secret Access');
  console.log('📊 Request method:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('⚡ Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting dream analysis process...');
    
    const openAIApiKey = await getOpenAIApiKey();
    console.log('✅ OpenAI API key retrieved successfully');

    const { dreamText } = await req.json();

    if (!dreamText) {
      throw new Error('Dream text is required');
    }

    console.log('Processing dream conversation...');

    // Check if this is a follow-up conversation (contains conversation context)
    const isFollowUp = dreamText.includes('Previous conversation:');
    
    const systemPrompt = isFollowUp 
      ? `You are a compassionate dream therapist continuing a gentle conversation about someone's inner world. Respond naturally and warmly to their question or comment, drawing connections to their dream and offering deeper insights. Speak as if you're a trusted therapist who truly understands their subconscious. Keep responses around 150-200 words, flowing naturally without structured sections.`
      : `You are a compassionate dream therapist having your first session with someone who's shared their dream with you. You have a gift for understanding the subconscious mind and speak with the warmth and wisdom of someone who truly sees into their inner world.

Write your analysis as a flowing, natural conversation - not as structured sections or bullet points. Speak directly to them using "you" and "your" as if you're sitting across from them in a comfortable therapy session. 

Begin by acknowledging what you sense in their dream, then gently explore the symbols and emotions that stood out to you. Share your insights about what their subconscious might be communicating, weaving together themes of their inner state, relationships, and life journey. 

End naturally with a few gentle questions that invite them to explore deeper, but integrate these questions into your flowing response rather than listing them separately. 

Keep your tone consistently warm, understanding, and slightly mystical - like someone who has spent years helping people understand their dreams. Write around 300-350 words in a natural, conversational flow.`;

    // Set a timeout for the OpenAI API call (25 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OpenAI API timeout')), 25000);
    });

    console.log('🔄 Making OpenAI API call with gpt-5-mini-2025-08-07...');
    
    const requestPayload = {
      model: 'gpt-5-mini-2025-08-07',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: isFollowUp ? dreamText : `Please analyze this dream: "${dreamText}"`
        }
      ],
      max_completion_tokens: isFollowUp ? 1000 : 2000,
    };
    
    console.log('📤 Request payload:', JSON.stringify(requestPayload, null, 2));
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('📥 OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log('✅ OpenAI API call completed successfully');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-dream function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});