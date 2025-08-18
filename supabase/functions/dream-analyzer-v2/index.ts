// Dream Analyzer V2 - New Function to Bypass Deployment Issues
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🟢 NEW Dream Analyzer V2 Function Started!');
  console.log('📊 Request method:', req.method);
  console.log('🔑 OpenAI API key length:', openAIApiKey ? openAIApiKey.length : 0);
  console.log('🔑 OpenAI API key starts with sk-:', openAIApiKey ? openAIApiKey.startsWith('sk-') : false);
  console.log('🔑 All env vars:', JSON.stringify(Object.keys(Deno.env.toObject()), null, 2));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('⚡ Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting dream analysis process...');
    
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found in environment variables');
      console.error('❌ Available env vars:', Object.keys(Deno.env.toObject()));
      throw new Error('OpenAI API key not configured');
    }
    
    console.log('✅ OpenAI API key verified');

    const { dreamText } = await req.json();

    if (!dreamText) {
      throw new Error('Dream text is required');
    }

    console.log('💭 Processing dream text:', dreamText.substring(0, 100) + '...');

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

    console.log('🔄 Making OpenAI API call with gpt-4o-mini...');
    
    const requestBody = {
      model: 'gpt-4o-mini',
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
      max_tokens: isFollowUp ? 400 : 600,
      temperature: 0.7,
    };

    console.log('📝 Request body:', JSON.stringify(requestBody, null, 2));
    
    const apiCall = fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const response = await Promise.race([apiCall, timeoutPromise]) as Response;

    console.log('📊 OpenAI API response status:', response.status);
    console.log('📊 OpenAI API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error response:', errorText);
      console.error('❌ OpenAI API error status:', response.status);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI API response data:', JSON.stringify(data, null, 2));
    
    const analysis = data.choices?.[0]?.message?.content;
    
    if (!analysis) {
      console.error('❌ No analysis content in OpenAI response:', data);
      throw new Error('No analysis content received from OpenAI');
    }

    console.log('✅ Dream analysis completed successfully');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error in dream-analyzer-v2 function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});