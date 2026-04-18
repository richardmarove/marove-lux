import { Card, ReviewResult, ReviewState, SrsLevel } from '../types';

export const DAY_MS = 24 * 60 * 60 * 1000;
export const SRS_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30] as const;

const LEVEL_LABELS: Record<SrsLevel, string> = {
  0: 'L0 New',
  1: 'L1 Learning',
  2: 'L2 Review',
  3: 'L3 Familiar',
  4: 'L4 Mastery',
  5: 'L5 Legend',
};

export function clampSrsLevel(value: unknown): SrsLevel {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isInteger(value)) {
    return 0;
  }

  const clampedValue = Math.min(5, Math.max(0, Math.round(value)));
  return clampedValue as SrsLevel;
}

export function isCardDue(card: Card, now = Date.now()): boolean {
  return card.nextReviewAt <= now;
}

export function getNextReviewState(
  level: SrsLevel,
  result: ReviewResult,
  now = Date.now()
): ReviewState {
  const nextLevel = result === 'success' ? Math.min(level + 1, 5) : 0;

  return {
    level: nextLevel as SrsLevel,
    nextReviewAt: now + SRS_INTERVAL_DAYS[nextLevel] * DAY_MS,
    lastReviewedAt: now,
  };
}

export function getLevelLabel(level: SrsLevel): string {
  return LEVEL_LABELS[level];
}

export function formatNextReviewMessage(nextReviewAt: number, now = Date.now()): string {
  const dayCount = Math.max(0, Math.round((nextReviewAt - now) / DAY_MS));

  if (dayCount === 0) {
    return 'Next review: now';
  }

  if (dayCount === 1) {
    return 'Next review: tomorrow';
  }

  return `Next review: in ${dayCount} days`;
}
