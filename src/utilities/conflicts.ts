// src/utilities/conflicts.ts

/** Empty/whitespace -> no meeting (never conflicts) */
const isEmpty = (s: string | undefined | null) => !s || s.trim() === '';

/** "HH:MM" -> minutes since 00:00 */
const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Parse "MWF 11:00-11:50" or "TuTh 14:00-15:20" into {days:Set, start,end} */
export type Meeting = { days: Set<string>; start: number; end: number };

export const parseMeeting = (meets: string): Meeting | null => {
  if (isEmpty(meets)) return null;

  // Split to day-part and time-part
  const [dayPart, timePart] = meets.trim().split(/\s+/, 2);
  if (!dayPart || !timePart) return null;

  // Extract day tokens: supports M, Tu, W, Th, F, Sa, Su in any combo
  const dayTokens = dayPart.match(/(M|Tu|W|Th|F|Sa|Su)/g);
  if (!dayTokens || dayTokens.length === 0) return null;

  const [startS, endS] = timePart.split('-', 2);
  if (!startS || !endS) return null;

  const start = toMinutes(startS);
  const end = toMinutes(endS);
  if (!(start < end)) return null; // guard

  return { days: new Set(dayTokens), start, end };
};

/** Any common day? */
const daysOverlap = (a: Meeting, b: Meeting) => {
  for (const d of a.days) if (b.days.has(d)) return true;
  return false;
};

/** Half-open overlap: [s1,e1) intersects [s2,e2) */
const timesOverlap = (a: Meeting, b: Meeting) =>
  a.start < b.end && b.start < a.end;

/** Two courses conflict if same term, non-empty meets, and overlap by day & time */
export const coursesConflict = (
  a: { term: string; meets: string },
  b: { term: string; meets: string }
): boolean => {
  if (a.term !== b.term) return false;
  const ma = parseMeeting(a.meets);
  const mb = parseMeeting(b.meets);
  if (!ma || !mb) return false; // empty or unparsable meets => no conflict
  return daysOverlap(ma, mb) && timesOverlap(ma, mb);
};

/** Does course `c` conflict with ANY course in `selected`? */
export const conflictsWithAny = <T extends { term: string; meets: string }>(
  c: T,
  selected: T[]
): boolean => selected.some((s) => coursesConflict(c, s));
