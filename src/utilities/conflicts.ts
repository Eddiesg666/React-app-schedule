// src/utilities/conflicts.ts
const isEmpty = (s: string | undefined | null) => !s || s.trim() === '';

type Meeting = { days: Set<string>; start: number; end: number };

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const parseMeeting = (meets: string): Meeting | null => {
  if (isEmpty(meets)) return null;
  const [dayPart, timePart] = meets.trim().split(/\s+/, 2);
  if (!dayPart || !timePart) return null;
  const dayTokens = dayPart.match(/(M|Tu|W|Th|F|Sa|Su)/g);
  if (!dayTokens || dayTokens.length === 0) return null;
  const [startS, endS] = timePart.split('-', 2);
  if (!startS || !endS) return null;
  const start = toMinutes(startS);
  const end = toMinutes(endS);
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
  if (!ma || !mb) return false;
  return daysOverlap(ma, mb) && timesOverlap(ma, mb);
};

export const conflictsWithAny = <T extends { term: string; meets: string }>(
  c: T,
  selected: T[]
): boolean => selected.some((s) => coursesConflict(c, s));
