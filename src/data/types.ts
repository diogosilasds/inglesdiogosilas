export interface SentencePair {
  en: string;
  pt: string;
  note: string;
}

export interface TextEntry {
  id: number;
  slug: string;
  url: string;
  titleEn: string;
  titlePt: string;
  fullEn: string;
  fullPt: string;
  pairs: SentencePair[];
  focus: string;
}
