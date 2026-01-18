import { Tone, GeneratedContent } from "../types";

export const generateDraftsGemini = async (
  idea: string,
  tone: Tone,
  apiKey: string,
): Promise<GeneratedContent> => {
  const prompt = `Generate social media drafts for six platforms: Instagram, Facebook, Twitter, LinkedIn, X, TikTok based on the following idea and tone. Use available tools to verify facts if the topic involves current events or specific knowledge.

  Idea: ${idea}
  Tone: ${tone}

  Requirements:
  - LinkedIn: Professional, Insightful, Informative. (3–5 hashtags)
  - Twitter/X: Witty, Punchy, Conversational. (1–2 hashtags)
  - Instagram: Aesthetic, Visual, Inspiring. (5–10 hashtags)
  - Facebook: Relatable, Community-focused, Casual. (0–2 hashtags)
  - TikTok: Raw, Authentic, Fast-paced. (3–6 hashtags)
  - Reddit: Informative, Engaging, Informative. (3–5 hashtags)
  - Suggest aspect ratios: LinkedIn: 16:9, Twitter/X: 16:9, Instagram: 1:1, Facebook: 16:9, TikTok: 9:16, Reddit: 16:9

  RETURN ONLY a JSON object with structure and content (no markdown formatting):
  {
    "drafts":[
        {
           "platform": "Instagram",
           "content": "...",
           "suggestedAspectRatio":"16:9"
        },
        {
           "platform": "Facebook",
           "content": "...",
           "suggestedAspectRatio":"16:9"
        },
        {
           "platform": "Twitter",
           "content": "...",
           "suggestedAspectRatio":"16:9"
        },
        {
           "platform": "LinkedIn",
           "content": "...",
           "suggestedAspectRatio":"16:9"
        },
        {
           "platform": "X",
           "content": "...",
           "suggestedAspectRatio":"16:9"
        },
        {
           "platform": "TikTok",
           "content": "...",
           "suggestedAspectRatio":"16:9"
        },
        {
           "platform": "Reddit",
           "content": "...",
           "suggestedAspectRatio":"16:9"
        }
    ]
  }`;

  const makeRequest = async (model: string) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [
            {
              google_search_retrieval: {
                dynamic_retrieval_config: {
                  mode: "dynamic",
                  dynamic_threshold: 0.7,
                },
              },
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${model}): ${errText}`);
    }

    return response.json();
  };

  try {
    let data;
    try {
      data = await makeRequest("gemini-2.0-flash");
    } catch {
      try {
        data = await makeRequest("gemini-1.5-flash");
      } catch {
        data = await makeRequest("gemini-pro");
      }
    }

    let text = data.candidates[0].content.parts[0].text;
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to generate drafts with Gemini");
  }
};
