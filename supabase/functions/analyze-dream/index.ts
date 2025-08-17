import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
        temperature: 0.7,
        max_tokens: isFollowUp ? 400 : 600,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content || "Unable to analyze dream.";

    console.log('Dream conversation completed successfully');

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