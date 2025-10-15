// src/utilities/conflicts.ts

const isEmpty = (s: string | undefined | null) => !s || s.trim() === '';

export type Meeting = { days: Set<string>; start: number; end: number };

// strict HH:MM (00–23):(00–59)
const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

const toMinutes = (hhmm: string): number => {
  const m = hhmm.match(TIME_RE);
  if (!m) return NaN;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  return h * 60 + mm;
};

// Order matters when matching multi-letter tokens (Tu, Th, Sa, Su)
const DAY_RE = /(Tu|Th|Sa|Su|M|W|F)/g;

export const parseMeeting = (meets: string): Meeting | null => {
  if (isEmpty(meets)) return null;

  const trimmed = meets.trim();
  // split into "<days> <start>-<end>"
  const [dayPart, timePart] = trimmed.split(/\s+/, 2);
  if (!dayPart || !timePart) return null;

  // extract day tokens
  const dayTokens = dayPart.match(DAY_RE);
  if (!dayTokens || dayTokens.length === 0) return null;

  // extract start and end
  const [startS, endS] = timePart.split('-', 2);
  if (!startS || !endS) return null;

  const start = toMinutes(startS);
  const end = toMinutes(endS);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (!(start < end)) return null;

  return { days: new Set(dayTokens), start, end };
};

const daysOverlap = (a: Meeting, b: Meeting) => {
  for (const d of a.days) if (b.days.has(d)) return true;
  return false;
};

const timesOverlap = (a: Meeting, b: Meeting) =>
  a.start < b.end && b.start < a.end;

export const coursesConflict = (
  a: { term: string; meets: string },
  b: { term: string; meets: string }
): boolean => {
  if (a.term !== b.term) return false;
  const ma = parseMeeting(a.meets);
  const mb = parseMeeting(b.meets);
  if (!ma || !mb) return false; // empty/invalid meetings never conflict
  return daysOverlap(ma, mb) && timesOverlap(ma, mb);
};

export const conflictsWithAny = <T extends { term: string; meets: string }>(
  c: T,
  selected: T[]
): boolean => selected.some((s) => coursesConflict(c, s));
