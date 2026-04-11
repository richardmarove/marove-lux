import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Deck, Card } from '../types';

interface DataContextType {
  decks: Deck[];
  addDeck: (name: string) => void;
  deleteDeck: (id: string) => void;
  addCard: (deckId: string, question: string, answer: string) => void;
  deleteCard: (deckId: string, cardId: string) => void;
  isLoaded: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const STORAGE_KEY = '@maroves_lux_decks';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setDecks(JSON.parse(stored));
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
          cards: [...deck.cards, {
            id: Math.random().toString(36).substring(2, 9),
            question,
            answer,
          }],
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

  return (
    <DataContext.Provider value={{ decks, addDeck, deleteDeck, addCard, deleteCard, isLoaded }}>
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
