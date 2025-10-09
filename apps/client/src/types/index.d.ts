export interface UserSettings {
  voiceType: string;
  pronunciationVolume: number;
  typingSoundVolume: number;
  soundEnabled: boolean;
  autoPlayPronunciation: boolean;
  showShortcutHints: boolean;
  shortcuts: Shortcuts;
  ignoreCase: boolean;
}

export interface Shortcuts {
  resetExercise: ResetExercise;
  toggleHint: ToggleHint;
  pronunciation: Pronunciation;
  wordNavigation: WordNavigation;
}

export interface ResetExercise {
  key: string;
  modifiers: string[];
}

export interface ToggleHint {
  key: string;
  modifiers: string[];
}

export interface Pronunciation {
  key: string;
  modifiers: string[];
}

export interface WordNavigation {
  prev: Prev;
  next: Next;
}

export interface Prev {
  key: string;
  modifiers: string[];
}

export interface Next {
  key: string;
  modifiers: string[];
}
