import { useState, useEffect } from "react";
import { OpenAI } from "openai";

// TODO: Replace with your OpenAI API key from https://platform.openai.com/api-keys
const OPENAI_API_KEY = "sk-your-api-key-here";

export const useOpenAI = () => {
  const [client, setClient] = useState<OpenAI | null>(null);

  useEffect(() => {
    if (OPENAI_API_KEY && OPENAI_API_KEY !== "sk-your-api-key-here") {
      setClient(new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      }));
    }
  }, []);

  const analyzeDream = async (dreamText: string) => {
    if (!client) throw new Error("OpenAI client not initialized - please add your API key");

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

  const hasApiKey = !!client;

  return {
    hasApiKey,
    analyzeDream,
  };
};