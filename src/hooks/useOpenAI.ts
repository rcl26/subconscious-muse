import { useState, useEffect } from "react";
import { OpenAI } from "openai";

export const useOpenAI = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [client, setClient] = useState<OpenAI | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setClient(new OpenAI({
        apiKey: savedKey,
        dangerouslyAllowBrowser: true, // Note: For production, use backend
      }));
    }
  }, []);

  const setNewApiKey = (newKey: string) => {
    setApiKey(newKey);
    setClient(new OpenAI({
      apiKey: newKey,
      dangerouslyAllowBrowser: true,
    }));
  };

  const analyzeDream = async (dreamText: string) => {
    if (!client) throw new Error("OpenAI client not initialized");

    const response = await client.chat.completions.create({
      model: "gpt-4.1-2025-04-14",
      messages: [
        {
          role: "system",
          content: `You are a dream analyst with expertise in psychology and symbolism. Analyze the following dream and provide insights about:

1. Key Symbols: Identify 3-5 main symbols and their potential meanings
2. Emotional Themes: What emotions or psychological states might this dream reflect?
3. Possible Interpretations: 2-3 different ways to interpret this dream
4. Questions for Reflection: 2-3 questions to help the dreamer explore further

Keep your response thoughtful, non-judgmental, and around 300-400 words. Format your response with clear sections.`
        },
        {
          role: "user",
          content: `Please analyze this dream: "${dreamText}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    return response.choices[0]?.message?.content || "Unable to analyze dream.";
  };

  const clearApiKey = () => {
    localStorage.removeItem("openai_api_key");
    setApiKey(null);
    setClient(null);
  };

  return {
    apiKey,
    hasApiKey: !!apiKey,
    setApiKey: setNewApiKey,
    clearApiKey,
    analyzeDream,
  };
};