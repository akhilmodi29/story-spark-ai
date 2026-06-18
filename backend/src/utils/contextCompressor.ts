import { get_encoding } from "tiktoken";

export interface LorePayload {
  characters: CharacterEntry[];
  setting: string[];
  core_events: string[];
}

export interface CharacterEntry {
  name: string;
  traits: string[];
  lastSeen?: string;
}

export interface StoryNode {
  id: string;
  text: string;
  branchId?: string;
}

export interface CompressedContext {
  lore: LorePayload;
  window: StoryNode[];
  totalTokens: number;
  droppedNodeCount: number;
}

export function countTokens(text: string): number {
  try {
    const enc = get_encoding("cl100k_base");
    const tokens = enc.encode(text).length;
    enc.free();
    return tokens;
  } catch {
    return Math.ceil(text.split(/\s+/).length / 0.75);
  }
}
