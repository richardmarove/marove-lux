import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Deck, ReviewResult, ReviewState, StudyQueueItem } from '../types';
import { clampSrsLevel, getNextReviewState, isCardDue } from '../utils/srs';

interface DataContextType {
  decks: Deck[];
  addDeck: (name: string) => void;
  deleteDeck: (id: string) => void;
  addCard: (deckId: string, question: string, answer: string) => void;
  deleteCard: (deckId: string, cardId: string) => void;
  reviewCard: (deckId: string, cardId: string, result: ReviewResult) => ReviewState;
  getDueCountForDeck: (deckId: string) => number;
  getDueCardsForDeck: (deckId: string) => Card[];
  getAllDueCards: () => StudyQueueItem[];
  isLoaded: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const STORAGE_KEY = '@maroves_lux_decks';

function normalizeCard(card: Partial<Card>, now: number): Card {
  return {
    id: card.id ?? Math.random().toString(36).substring(2, 9),
    question: card.question ?? '',
    answer: card.answer ?? '',
    level: clampSrsLevel(card.level),
    nextReviewAt:
      typeof card.nextReviewAt === 'number' && !Number.isNaN(card.nextReviewAt)
        ? card.nextReviewAt
        : now,
    lastReviewedAt:
      typeof card.lastReviewedAt === 'number' && !Number.isNaN(card.lastReviewedAt)
        ? card.lastReviewedAt
        : null,
  };
}

function normalizeDecks(rawDecks: unknown, now = Date.now()): Deck[] {
  if (!Array.isArray(rawDecks)) {
    return [];
  }

  return rawDecks.map(rawDeck => {
    const deck = rawDeck as Partial<Deck>;

    return {
      id: deck.id ?? Math.random().toString(36).substring(2, 9),
      name: deck.name ?? 'Untitled Deck',
      cards: Array.isArray(deck.cards) ? deck.cards.map(card => normalizeCard(card, now)) : [],
      createdAt:
        typeof deck.createdAt === 'number' && !Number.isNaN(deck.createdAt)
          ? deck.createdAt
          : now,
    };
  });
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setDecks(normalizeDecks(JSON.parse(stored)));
        }
      } catch (e) {
        console.error('Failed to load decks', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // Save on every change
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(decks)).catch(e => {
        console.error('Failed to save decks', e);
      });
    }
  }, [decks, isLoaded]);

  const addDeck = (name: string) => {
    const newDeck: Deck = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      cards: [],
      createdAt: Date.now(),
    };
    setDecks(prev => [newDeck, ...prev]);
  };

  const deleteDeck = (id: string) => {
    setDecks(prev => prev.filter(d => d.id !== id));
  };

  const addCard = (deckId: string, question: string, answer: string) => {
    setDecks(prev => prev.map(deck => {
      if (deck.id === deckId) {
        return {
          ...deck,
          cards: [
            ...deck.cards,
            {
              id: Math.random().toString(36).substring(2, 9),
              question,
              answer,
              level: 0,
              nextReviewAt: Date.now(),
              lastReviewedAt: null,
            },
          ],
        };
      }
      return deck;
    }));
  };

  const deleteCard = (deckId: string, cardId: string) => {
    setDecks(prev => prev.map(deck => {
      if (deck.id === deckId) {
        return {
          ...deck,
          cards: deck.cards.filter(c => c.id !== cardId),
        };
      }
      return deck;
    }));
  };

  const reviewCard = (deckId: string, cardId: string, result: ReviewResult): ReviewState => {
    const deck = decks.find(currentDeck => currentDeck.id === deckId);
    const card = deck?.cards.find(currentCard => currentCard.id === cardId);

    if (!card) {
      throw new Error(`Unable to review missing card "${cardId}" in deck "${deckId}".`);
    }

    const reviewState = getNextReviewState(card.level, result);

    setDecks(prev => prev.map(currentDeck => {
      if (currentDeck.id !== deckId) {
        return currentDeck;
      }

      return {
        ...currentDeck,
        cards: currentDeck.cards.map(currentCard =>
          currentCard.id === cardId ? { ...currentCard, ...reviewState } : currentCard
        ),
      };
    }));

    return reviewState;
  };

  const getDueCardsForDeck = (deckId: string): Card[] => {
    const deck = decks.find(currentDeck => currentDeck.id === deckId);

    if (!deck) {
      return [];
    }

    const now = Date.now();
    return deck.cards.filter(card => isCardDue(card, now));
  };

  const getDueCountForDeck = (deckId: string): number => {
    return getDueCardsForDeck(deckId).length;
  };

  const getAllDueCards = (): StudyQueueItem[] => {
    const now = Date.now();

    return decks.flatMap(deck =>
      deck.cards
        .filter(card => isCardDue(card, now))
        .map(card => ({
          deckId: deck.id,
          deckName: deck.name,
          card,
        }))
    );
  };

  return (
    <DataContext.Provider
      value={{
        decks,
        addDeck,
        deleteDeck,
        addCard,
        deleteCard,
        reviewCard,
        getDueCountForDeck,
        getDueCardsForDeck,
        getAllDueCards,
        isLoaded,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
