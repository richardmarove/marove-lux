# MyFirstApp overview
- Purpose: Expo/React Native flashcard app named Marove's Lux with decks, cards, and a per-deck study flow.
- Stack: Expo Router, React 19, React Native 0.81, TypeScript, AsyncStorage for persistence, expo-haptics.
- Structure: `app/` contains routes/screens, `components/` shared UI, `context/DataContext.tsx` persistence and app state, `types/index.ts` shared types, `theme/` design tokens.
- Current behavior: users create decks, add cards, study a deck by flipping cards and marking `Got It`/`Try Again` within the session only; no persisted SRS yet.
