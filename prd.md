# Marove's Lux
**Product Requirements Document**
Version 1.0 | React Native + Expo | April 2026

---

## 1. Overview

Marove's Lux is a mobile learning app that lets users create, organize, and study custom flashcard decks. Built with React Native and Expo, it targets students and self-learners who want a fast, distraction-free study tool on Android.

This is a beginner-friendly project designed to teach core React Native concepts including multi-screen navigation, state management, local data persistence, and basic animations.

---

## 2. Goals & Objectives

### 2.1 Product Goals
- Give users a simple tool to create and study flashcard decks
- Provide instant feedback during study sessions (got it / try again)
- Persist user data locally so decks survive app restarts
- Keep the UI clean and distraction-free

### 2.2 Learning Goals (for the developer)
- Practice React Native navigation with Expo Router
- Understand useState and useEffect hooks
- Learn AsyncStorage for local data persistence
- Implement basic card flip animation using the Animated API

---

## 3. Target Users

Primary users are students and self-learners aged 15–30 who want to memorize information quickly. They are comfortable with mobile apps and expect a smooth, intuitive experience without a learning curve.

---

## 4. Screens & Features

### 4.1 Home Screen
The entry point of the app. Displays all created decks in a scrollable list.
- Show deck name and card count for each deck
- Tap a deck to open it
- Floating action button (+) to create a new deck
- Empty state illustration when no decks exist yet
- Delete deck by long pressing

### 4.2 Deck Screen
Shows all cards inside a selected deck and entry point for studying.
- Display deck name as the screen title
- List all cards showing the question on each row
- Add new card button at the bottom
- Prominent Study Now button at the top
- Swipe to delete individual cards
- Empty state when deck has no cards yet

### 4.3 Study Screen
The core study experience. Presents cards one at a time with flip interaction.
- Show question side by default
- Tap card to flip and reveal the answer (animated flip)
- Got It button marks card as learned and moves to next
- Try Again button keeps the card in rotation
- Progress bar at the top showing X of Y cards completed
- Completion screen shown when all cards are done
- Option to restart the session from the completion screen

### 4.4 Add Card Screen
Simple form to add a new flashcard to the current deck.
- Text input for the question
- Text input for the answer
- Save button to add the card
- Cancel button to go back without saving

---

## 5. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React Native + Expo | Core app framework |
| Navigation | Expo Router | Screen routing and navigation |
| State | React useState / useReducer | Local component state |
| Storage | AsyncStorage | Persist decks and cards locally |
| Animation | React Native Animated API | Card flip animation |
| IDE | VS Code | Development environment |
| Testing | Expo Go / Android Emulator | Live preview and testing |

---

## 6. Build Phases

### Phase 1 — Navigation Skeleton
- Set up Expo project with Expo Router
- Create all 4 screens with placeholder text
- Wire up navigation between screens
- **Goal:** Tap between all screens without errors

### Phase 2 — Study Flow with Hardcoded Data
- Add hardcoded deck and cards
- Build the card flip animation
- Implement Got It / Try Again logic
- Build progress bar
- **Goal:** Full study session works end to end

### Phase 3 — Dynamic Decks and Cards
- Build Add Deck and Add Card forms
- Store everything in React state
- Render decks and cards dynamically
- **Goal:** User can create and study their own decks

### Phase 4 — Persistence
- Install and configure AsyncStorage
- Save decks and cards on every change
- Load saved data on app launch
- **Goal:** Data survives app close and reopen

### Phase 5 — Polish (Optional)
- Add empty state illustrations
- Add swipe-to-delete on cards
- Add completion screen with stats
- Improve styling and colors

---

## 7. Out of Scope (V1)

The following features are explicitly excluded from version 1 to keep scope manageable:
- User accounts or authentication
- Cloud sync or backup
- Spaced repetition algorithm (like Anki)
- Image or audio cards
- Sharing decks with other users
- Dark mode
- iOS support (Android only for now)

---

## 8. Success Criteria

Version 1 is considered complete when:
- User can create at least one deck with multiple cards
- User can complete a full study session with flip interaction
- Data persists after closing and reopening the app
- App runs without crashes on the Android emulator
- All 4 screens are navigable without errors

---

*Marove's Lux PRD | v1.0 | For learning purposes*