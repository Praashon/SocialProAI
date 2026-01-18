import { Tone, GeneratedContent, AspectRatio, ImageSize } from "../types";

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

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
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
      throw new Error(
        `Gemini API Error: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
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

export const generateImageGemini = async (
  prompt: string,
  aspectRatio: AspectRatio,
  size: ImageSize, // eslint-disable-line @typescript-eslint/no-unused-vars
  apiKey: string,
): Promise<string> => {
  const fullPrompt = `High quality, aesthetic, professional social media image. ${prompt}. Aspect Ratio: ${aspectRatio}. 8k resolution, cinematic lighting.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: fullPrompt,
            },
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: aspectRatio,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Imagen 3 API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (
      data.predictions &&
      data.predictions[0] &&
      data.predictions[0].bytesBase64Encoded
    ) {
      return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    }

    throw new Error("No image data returned from Gemini");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate image with Gemini");
  }
};
