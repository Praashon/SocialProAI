export enum Tone {
  PROFESSIONAL = "Professional",
  WITTY = "Witty",
  URGENT = "Urgent",
  INSPIRATIONAL = "Inspirational",
  FUNNY = "Funny",
}

export enum Platform {
  LINKEDIN = "LinkedIn",
  TWITTER = "Twitter",
  INSTAGRAM = "Instagram",
  X = "X",
  REDDIT = "Reddit",
  FACEBOOK = "Facebook",
}

export enum ImageSize {
  S1K = "1K",
  S2K = "2K",
  S4K = "4K",
}

export type AspectRatio =
  | "1:1"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:3"
  | "4:5"
  | "5:4"
  | "9:16"
  | "16:9"
  | "21:9";

export interface PlatformDraft {
  platform: Platform;
  content: string;
  suggestedAspectRatio: AspectRatio;
  imageUrl?: string;
  isGeneratingImage: boolean;
}

export interface GeneratedContent {
  drafts: PlatformDraft[];
}
