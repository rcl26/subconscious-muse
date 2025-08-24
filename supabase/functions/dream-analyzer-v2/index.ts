// Dream Analyzer V3 - Complete Rewrite to Force New Deployment
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Enhanced API key detection with multiple fallbacks
const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || 
                     Deno.env.get('OPENAI_KEY') || 
                     Deno.env.get('OPEN_AI_API_KEY') ||
                     Deno.env.get('OPENAI_SECRET_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Deployment tracking
const DEPLOYMENT_VERSION = "V3.0";
const FUNCTION_START_TIME = new Date().toISOString();

serve(async (req) => {
  console.log(`🚀 Dream Analyzer ${DEPLOYMENT_VERSION} - Started at ${FUNCTION_START_TIME}`);
  console.log('📋 Request Details:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
  
  // Comprehensive environment diagnostics
  const envDiagnostics = {
    apiKeyExists: !!openAIApiKey,
    apiKeyLength: openAIApiKey ? openAIApiKey.length : 0,
    apiKeyPrefix: openAIApiKey ? openAIApiKey.substring(0, 7) + '...' : 'none',
    validFormat: openAIApiKey ? openAIApiKey.startsWith('sk-') : false,
    allEnvVars: Object.keys(Deno.env.toObject()).sort()
  };
  
  console.log('🔧 Environment Diagnostics:', JSON.stringify(envDiagnostics, null, 2));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('⚡ CORS preflight handled');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate API key presence and format
    if (!openAIApiKey) {
      const error = `API key not found. Checked variables: OPENAI_API_KEY, OPENAI_KEY, OPEN_AI_API_KEY, OPENAI_SECRET_KEY`;
      console.error('❌ API Key Error:', error);
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        details: error,
        diagnostics: envDiagnostics
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!openAIApiKey.startsWith('sk-')) {
      const error = `Invalid API key format. Expected format: sk-...`;
      console.error('❌ API Key Format Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Invalid OpenAI API key format',
        details: error
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ API key validation passed');

    // Parse request body
    const { dreamText } = await req.json();
    
    if (!dreamText) {
      throw new Error('Dream text is required');
    }

    console.log('💭 Processing dream text (length:', dreamText.length, ')');

    // Determine if this is a follow-up conversation
    const isFollowUp = dreamText.includes('Previous conversation:');
    console.log('📝 Conversation type:', isFollowUp ? 'follow-up' : 'initial analysis');
    
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

    // Prepare OpenAI request
    const requestBody = {
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

    console.log('🤖 Making OpenAI API call...');
    console.log('📊 Request payload:', JSON.stringify(requestBody, null, 2));
    
    // Set timeout for OpenAI API call
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('OpenAI API timeout after 25 seconds')), 25000);
    });
    
    const apiCall = fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const response = await Promise.race([apiCall, timeoutPromise]);

    console.log('📈 OpenAI Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI Response received successfully');
    
    const analysis = data.choices?.[0]?.message?.content;
    
    if (!analysis) {
      console.error('❌ No analysis content in response:', data);
      throw new Error('No analysis content received from OpenAI');
    }

    console.log('🎉 Dream analysis completed successfully');
    console.log('📝 Analysis preview:', analysis.substring(0, 100) + '...');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Function Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      version: DEPLOYMENT_VERSION
    });
    
    return new Response(JSON.stringify({ 
      error: error.message,
      version: DEPLOYMENT_VERSION,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});