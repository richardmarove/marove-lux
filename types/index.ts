export type SrsLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type ReviewResult = 'success' | 'failure';

export interface Card {
  id: string;
  question: string;
  answer: string;
  level: SrsLevel;
  nextReviewAt: number;
  lastReviewedAt: number | null;
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  createdAt: number;
}

export interface StudyQueueItem {
  deckId: string;
  deckName: string;
  card: Card;
}

export interface ReviewState {
  level: SrsLevel;
  nextReviewAt: number;
  lastReviewedAt: number;
}
