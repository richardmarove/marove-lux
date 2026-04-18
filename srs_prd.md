# Marove's Lux: Spaced Repetition System (SRS)
**Implementation-Ready Product & Technical Requirements**
Version 1.1 | Execution Spec | April 2026

---

## 1. Summary

Marove's Lux currently lets users create decks, add cards, and run a manual study session per deck. This feature adds persisted spaced repetition so the app can decide which cards are due, surface them on the home screen, and update each card's review schedule after every study action.

This document is implementation-ready for the current Expo/React Native codebase. It makes the product and technical decisions needed to build SRS without leaving open questions about data shape, state APIs, route behavior, migration, or acceptance criteria.

### Primary Outcome
- Users can open the app and immediately see how many cards are due.
- Users can study all due cards across all decks from the home screen.
- Users can study only due cards from a single deck, or optionally cram all cards in that deck.
- Review results persist in `AsyncStorage` and survive app restarts.

---

## 2. Scope

### In Scope for SRS v1
- Persisted SRS fields on each card.
- Due-card calculation using fixed intervals.
- Home screen due summary and quick-study entry point.
- Deck-level due summary plus `Study Due` and `Cram All Cards` actions.
- Study-session updates that persist `Got It` and `Try Again`.
- Migration of existing stored cards that do not yet have SRS fields.
- Basic mastery visualization on deck card rows.

### Out of Scope for SRS v1
- User-configurable intervals.
- SM-2 or ease-factor based algorithms.
- Undo for accidental review taps.
- Search, filters, tags, or archived cards.
- Notifications or reminders outside the app.

---

## 3. Scheduling Model

The app will use a fixed six-state ladder. Internally, all timestamps are stored as Unix milliseconds using `Date.now()`.

| Level | Delay After Success | Label | Meaning |
|---|---:|---|---|
| 0 | 0 days | New | New card or missed card |
| 1 | 1 day | Learning | First successful recall |
| 2 | 3 days | Review | Early retention |
| 3 | 7 days | Familiar | Building consistency |
| 4 | 14 days | Mastery | Medium-term retention |
| 5 | 30 days | Legend | Long-term retention |

### Canonical Interval Table
```typescript
const DAY_MS = 24 * 60 * 60 * 1000;
const SRS_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30] as const;
```

### Due Rule
A card is due when:

```typescript
card.nextReviewAt <= Date.now()
```

UI copy may say "Due Today", but implementation uses `due now`, not calendar-day bucketing.

### Review Update Rules

#### On `Got It`
- Compute `nextLevel = Math.min(currentLevel + 1, 5)`.
- Set `lastReviewedAt = now`.
- Set `nextReviewAt = now + (SRS_INTERVAL_DAYS[nextLevel] * DAY_MS)`.
- Remove the card from the active session queue.

#### On `Try Again`
- Set `nextLevel = 0`.
- Set `lastReviewedAt = now`.
- Set `nextReviewAt = now`.
- Requeue the card at the end of the current session so the user sees it again before completion.

### New Card Defaults
Every newly created card must start with:

```typescript
level: 0
nextReviewAt: Date.now()
lastReviewedAt: null
```

### Existing Card Migration Defaults
Any stored card missing SRS fields must be normalized to the same defaults as a new card.

---

## 4. Product Behavior

### 4.1 Home Screen

The home screen remains the deck list, but adds a due-summary header above the list.

### Required UI
- A prominent summary block showing total due cards across all decks.
- A primary `Quick Study` button that starts a cross-deck due-only session.
- Deck list rows that show due count alongside total card count.

### Exact Behavior
- `Quick Study` includes all due cards across all decks at session start.
- `Quick Study` is disabled when total due count is `0`.
- Deck ordering does not change in v1.
- Deck subtitle format becomes:

```text
{dueCount} due • {totalCount} cards
```

### Empty State
- If there are no decks, keep the existing empty state.
- If decks exist but no cards are due, show `0 Due Today` and disable `Quick Study`.

### 4.2 Deck Screen

The deck screen keeps the card list and add-card footer, but the study controls become SRS-aware.

### Required UI
- Summary text: `{dueCount} Due / {totalCount} Total`
- Primary button: `Study Due`
- Secondary button: `Cram All Cards`

### Exact Behavior
- `Study Due` starts a deck-scoped due-only session.
- `Cram All Cards` starts a deck-scoped session containing every card in the deck.
- `Study Due` is disabled when `dueCount === 0`.
- `Cram All Cards` is disabled when `totalCount === 0`.
- Existing add/delete card behavior remains unchanged.

### 4.3 Study Sessions

There are three session types in v1:

1. Global due session from Home.
2. Deck due session from Deck.
3. Deck cram session from Deck.

### Queue Construction
- Global due session: all due cards across all decks, shuffled once at session start.
- Deck due session: all due cards in the selected deck, shuffled once at session start.
- Deck cram session: all cards in the selected deck, shuffled once at session start.

### Queue Stability
- The initial card set is fixed at session start.
- A failed card is requeued within the current session.
- Cards that become due elsewhere while the session is open are not injected into the active queue.

### Study Screen Requirements
- Reuse the current study experience: tap card to flip, then choose `Try Again` or `Got It`.
- Persist the SRS update immediately when the user taps either action.
- Show progress based on successful completions within the current session.
- After `Got It`, show transient feedback text for approximately 1.5 seconds:

```text
Next review: tomorrow
Next review: in 3 days
Next review: in 30 days
```

- Do not use a blocking `Alert` for interval feedback.

### Progress Labels
- Due sessions:

```text
{remainingCount} remaining of {initialCount} due
```

- Cram sessions:

```text
{completedCount} of {initialCount} reviewed
```

### Mixed-Deck Context
The global due session must show deck context for each card because cards are stored inside decks and do not carry `deckId`.

Required display:
- Show the source deck name above the flashcard or as a small subtitle within the study view.

### Completion
- Reuse the existing completion screen.
- Due sessions should describe completion as clearing due cards.
- Cram sessions can keep the generic completion messaging.

### 4.4 Mastery Visualization

Deck card rows should surface card mastery without adding a new screen.

### Minimum Requirement
- Each card row in the deck screen shows a compact label based on `level`.
- Recommended label format:

```text
L0 New
L1 Learning
L2 Review
L3 Familiar
L4 Mastery
L5 Legend
```

This is sufficient for v1; no charts or analytics are required.

---

## 5. Data Model and State APIs

### 5.1 Data Shape Decision

The app will keep the existing nested storage shape:

```typescript
interface Deck {
  id: string;
  name: string;
  cards: Card[];
  createdAt: number;
}
```

`Card` will **not** gain a persisted `deckId` field. Deck ownership remains implicit through `Deck.cards`.

This avoids a larger storage refactor and stays consistent with the current app architecture.

### 5.2 Card Type

```typescript
export type SrsLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface Card {
  id: string;
  question: string;
  answer: string;
  level: SrsLevel;
  nextReviewAt: number;
  lastReviewedAt: number | null;
}
```

### 5.3 Session-Only Mixed Queue Item

For cross-deck study only, the screen can construct a non-persisted view model:

```typescript
interface StudyQueueItem {
  deckId: string;
  deckName: string;
  card: Card;
}
```

This object exists only in session state and is never saved to `AsyncStorage`.

### 5.4 Required Pure Utilities

Implement pure helpers for consistent behavior:

```typescript
isCardDue(card: Card, now?: number): boolean
getNextReviewState(level: SrsLevel, result: 'success' | 'failure', now?: number): {
  level: SrsLevel;
  nextReviewAt: number;
  lastReviewedAt: number;
}
getLevelLabel(level: SrsLevel): string
formatNextReviewMessage(nextReviewAt: number, now?: number): string
```

### 5.5 `DataContext` Additions

The context must continue to own persistence and expose the SRS operations needed by screens.

Required additions:

```typescript
reviewCard(deckId: string, cardId: string, result: 'success' | 'failure'): {
  level: SrsLevel;
  nextReviewAt: number;
  lastReviewedAt: number;
}

getDueCountForDeck(deckId: string): number
getDueCardsForDeck(deckId: string): Card[]
getAllDueCards(): StudyQueueItem[]
```

### Notes
- `reviewCard` must update state and return the computed result so the study screen can show inline next-review feedback without recalculating it separately.
- Due selectors may be implemented as memoized helpers or plain functions inside context; the public behavior is what matters.

---

## 6. Routes and Screen Responsibilities

### 6.1 Existing Route Reuse

Keep the current deck study route:

```text
/study/[id]
```

Where `id` is the deck ID.

### Deck Route Query Parameter
The deck study screen will accept:

```text
mode=due | all
```

Examples:
- `/study/abc123?mode=due`
- `/study/abc123?mode=all`

### 6.2 New Global Due Route

Add a new route for cross-deck due study:

```text
/study/due
```

This route does not take a deck ID. It pulls its queue from `getAllDueCards()`.

### 6.3 Screen Ownership

Recommended implementation split:
- Home screen owns due summary and `Quick Study` entry.
- Deck screen owns deck-scoped due summary and study mode buttons.
- Study screens own queue state, flip state, progress, and inline feedback.
- `DataContext` owns persistence, migration, and review mutation logic.

---

## 7. Persistence and Migration

### 7.1 Storage Key

Keep the existing key:

```typescript
const STORAGE_KEY = '@maroves_lux_decks';
```

### 7.2 Load-Time Normalization

When data is loaded from `AsyncStorage`, normalize every deck and card before calling `setDecks`.

### Required Normalization Rules
- If `level` is missing or invalid, set it to `0`.
- If `level` is outside `0..5`, clamp it into range.
- If `nextReviewAt` is missing or invalid, set it to `Date.now()`.
- If `lastReviewedAt` is missing, set it to `null`.
- Preserve all existing deck names, IDs, cards, and `createdAt`.

### 7.3 Save Behavior

- Continue saving the full `decks` array after state changes.
- Migrated data should be written back on the next successful save cycle.
- No separate migration version flag is required for v1.

---

## 8. Implementation Targets

This feature should primarily touch:

- `types/index.ts`
- `context/DataContext.tsx`
- `app/index.tsx`
- `components/DeckCard.tsx`
- `app/deck/[id].tsx`
- `app/study/[id].tsx`
- `app/study/due.tsx` (new)
- `components/CardRow.tsx`

The exact component structure can vary, but these responsibilities must be preserved.

---

## 9. Test Plan

### 9.1 Data and Migration
- Existing users keep all decks and cards after upgrade.
- Existing cards without SRS fields are loaded as `level 0`, `nextReviewAt = now`, `lastReviewedAt = null`.
- New cards are immediately due after creation.

### 9.2 Due Calculation
- Cards with `nextReviewAt <= now` are counted as due.
- Cards with `nextReviewAt > now` are not counted as due.
- Home total due count equals the sum of all deck due counts.

### 9.3 Review Logic
- `Got It` from level 0 promotes to level 1 and schedules for 1 day later.
- `Got It` from level 4 promotes to level 5 and schedules for 30 days later.
- `Got It` from level 5 stays at level 5 and schedules for 30 days later.
- `Try Again` from any level resets to level 0 and schedules for now.
- Both outcomes update `lastReviewedAt`.

### 9.4 Study Flows
- Home `Quick Study` includes only due cards and works across multiple decks.
- Deck `Study Due` includes only due cards from that deck.
- Deck `Cram All Cards` includes all cards from that deck, even when not due.
- Failed cards are requeued during the same session.
- Successful cards leave the queue.

### 9.5 UI States
- `Quick Study` is disabled when no cards are due.
- `Study Due` is disabled when the selected deck has no due cards.
- `Cram All Cards` is disabled when the selected deck has no cards.
- Deck list rows show `{due} due • {total} cards`.
- Deck card rows show the mastery label.
- Global due sessions show the source deck name for each card.

---

## 10. Acceptance Criteria

This feature is complete when all of the following are true:

- A user with existing stored decks can update the app without losing data.
- The home screen clearly shows total due cards and can launch a due-only session across decks.
- Each deck shows due count and supports both `Study Due` and `Cram All Cards`.
- Tapping `Got It` or `Try Again` persists the new SRS state immediately.
- Due counts change correctly after a review and remain correct after app restart.
- The implementation keeps the nested `Deck.cards` storage model and does not require a database refactor.

---

*Marove's Lux | SRS PRD v1.1*
