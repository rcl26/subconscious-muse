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
  const now = Date.now();
  
  // Return cached key if still valid
  if (cachedApiKey && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('🔄 Using cached OpenAI API key');
    return cachedApiKey;
  }
  
  console.log('🔑 Retrieving OpenAI API key...');
  
  // Try environment variable first (fallback)
  const envKey = Deno.env.get('OPENAI_API_KEY');
  console.log('🔍 Env key exists:', !!envKey);
  console.log('🔍 Env key length:', envKey?.length || 0);
  console.log('🔍 Env key valid format:', envKey?.startsWith('sk-') || false);
  
  if (envKey && envKey.trim() && envKey.startsWith('sk-')) {
    console.log('✅ Got valid API key from environment');
    cachedApiKey = envKey;
    cacheTimestamp = now;
    return envKey;
  }
  
  console.log('⚠️ Environment key invalid, trying Supabase vault...');
  
  // Try Supabase vault access with retry logic
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase configuration missing for vault access');
  }
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  // Retry logic with exponential backoff
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`🔄 Vault access attempt ${attempt}/3`);
      
      // Try to get the secret directly from vault.secrets table
      const { data, error } = await supabase
        .from('vault.secrets')
        .select('secret')
        .eq('name', 'OPENAI_API_KEY')
        .single();
      
      if (error) {
        console.error(`❌ Vault error attempt ${attempt}:`, error.message);
        if (attempt === 3) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      
      if (data?.secret && data.secret.startsWith('sk-')) {
        console.log('✅ Got valid API key from vault');
        cachedApiKey = data.secret;
        cacheTimestamp = now;
        return data.secret;
      }
      
      console.error(`❌ Invalid key from vault attempt ${attempt}:`, data?.secret?.substring(0, 10) + '...');
      if (attempt === 3) throw new Error('Invalid API key format from vault');
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      
    } catch (vaultError) {
      console.error(`❌ Vault access failed attempt ${attempt}:`, vaultError);
      if (attempt === 3) throw vaultError;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw new Error('Failed to retrieve OpenAI API key from all sources');
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
      ? `You are a wise and empathetic dream guide continuing a conversation about someone's dream. Maintain your warm, encouraging tone and respond naturally to their question or comment. Keep your responses thoughtful and around 150-200 words for follow-ups.`
      : `You are a wise and empathetic dream guide who helps people explore their inner world through their dreams. You have a warm, encouraging tone and speak directly to the dreamer as if you're having a personal conversation.

Analyze the dream with these sections:
🌟 **What Caught My Attention**: Start with 2-3 striking elements that stood out
🔮 **The Symbols Speak**: Explore 3-4 key symbols and what they might whisper to the dreamer
💫 **The Emotional Landscape**: What feelings and inner states does this dream reveal?
🌙 **Possible Messages**: 2-3 gentle interpretations of what the dream might be offering
✨ **Questions to Ponder**: 2-3 thought-provoking questions to deepen their self-reflection

Keep your tone warm, curious, and supportive. Address the dreamer directly using "you" and "your". Make it feel like a gentle conversation with a wise friend who truly sees them. Around 350-400 words.`;

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
      max_completion_tokens: isFollowUp ? 400 : 600,
    };
    
    console.log('📤 Request payload:', JSON.stringify(requestPayload, null, 2));
    
    const apiCall = fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    const response = await Promise.race([apiCall, timeoutPromise]) as Response;

    console.log('📥 OpenAI API response status:', response.status);
    console.log('📥 OpenAI API response headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📋 Full OpenAI API response:', JSON.stringify(data, null, 2));
    
    // Enhanced response validation
    if (!data.choices || data.choices.length === 0) {
      console.error('❌ No choices in OpenAI response');
      throw new Error('OpenAI API returned no choices');
    }
    
    const choice = data.choices[0];
    console.log('🎯 First choice object:', JSON.stringify(choice, null, 2));
    
    if (!choice.message) {
      console.error('❌ No message in first choice');
      throw new Error('OpenAI API returned choice without message');
    }
    
    const content = choice.message.content;
    console.log('📝 Message content type:', typeof content);
    console.log('📝 Message content length:', content ? content.length : 0);
    console.log('📝 Message content preview:', content ? content.substring(0, 200) + '...' : 'null/undefined');
    
    if (!content || content.trim() === '') {
      console.error('❌ Empty or null content from OpenAI');
      console.error('❌ Full message object:', JSON.stringify(choice.message, null, 2));
      throw new Error('OpenAI API returned empty content');
    }
    
    const analysis = content.trim();
    console.log('✅ Dream conversation completed successfully with', analysis.length, 'characters');

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