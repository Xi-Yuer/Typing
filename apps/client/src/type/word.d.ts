export interface Word {
  id: string;
  languageId: string;
  categoryId: string;
  word: string;
  transliteration: string;
  usPhonetic: string;
  ukPhonetic: string;
  meaning: string;
  example: string;
  audioUrl: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  language: Language;
  category: Category;
}

export interface Language {
  id: number;
  name: string;
  code: string;
  script: string;
  isActive: boolean;
  createTime: string;
  updateTime: string;
  deleteTime: string;
}

export interface Category {
  id: string;
  languageId: string;
  name: string;
  description: string;
  difficulty: number;
  createTime: string;
  updateTime: string;
  deleteTime: string;
  language: Language;
}

export interface Language {
  id: number;
  name: string;
  code: string;
  script: string;
  isActive: boolean;
  createTime: string;
  updateTime: string;
  deleteTime: string;
}
