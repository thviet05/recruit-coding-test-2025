export type Age = 'Adult' | 'Young' | 'Child';
export type Rating = 'G' | 'PG-12' | 'R18+';

export type Ticket = {
  age: Age;
  rating: Rating;
  startHH: number; // 0-23
  startMM: number; // 0-59
  durH: number; // >=0
  durM: number; // 0-59
  row: string; // 'A'-'L'
  col: number; // 1-24
};

const PRICE: Record<Age, number> = { Adult: 1800, Young: 1200, Child: 800 };
export const solve = (input: string): string => {
  const lines = input
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length === 0) return '';

  // 解析
  const tickets: Ticket[] = [];
  for (const line of lines) {
    const t = parseLine(line);
    if (!t) {
      // 方針: 不正入力なら全体を 1 行で終了
      return '不正な入力です';
    }
    tickets.push(t);
  }

  // セット属性（同時購入内の Adult の存在）
  const hasAdult = tickets.some((t) => t.age === 'Adult');

  // 共通パラメータ（前提として同一上映）
  const rating = tickets[0].rating;
  const endMinutes = calcEndMinutes(tickets[0]);

  const results: string[] = [];

  for (const t of tickets) {
    const reasons: string[] = [];

    // 同伴必要（時刻）
    if (!checkTimeRule(t, endMinutes, hasAdult)) {
      reasons.push('対象の映画の入場には大人の同伴が必要です');
    }

    // 年齢制限（レーティング）
    if (!checkRating(t.age, rating, hasAdult)) {
      reasons.push('対象の映画は年齢制限により閲覧できません');
    }

    // 座席制限
    if (!checkSeat(t)) {
      reasons.push('対象のチケットではその座席をご利用いただけません');
    }

    // 出力合成
    if (reasons.length === 0) {
      results.push(`${PRICE[t.age]}円`);
    } else {
      // 表示順の安定化（既に順序どおり push しているが保険で unique）
      results.push(uniqueStable(reasons).join(','));
    }
  }

  return results.join('\n');
};

const parseLine = (line: string): Ticket | null => {
  const parts = line.split(',').map((s) => s.trim());
  if (parts.length !== 5) return null;
  const [ageRaw, ratingRaw, startRaw, durRaw, seatRaw] = parts;

  if (!['Adult', 'Young', 'Child'].includes(ageRaw)) return null;
  if (!['G', 'PG-12', 'R18+'].includes(ratingRaw)) return null;

  const start = startRaw.match(/^(\d{1,2}):(\d{2})$/);
  const dur = durRaw.match(/^(\d{1,2}):(\d{2})$/);
  const seat = seatRaw.match(/^([A-L])-(\d{1,2})$/i);
  if (!start || !dur || !seat) return null;

  const startHH = parseInt(start[1], 10);
  const startMM = parseInt(start[2], 10);
  const durH = parseInt(dur[1], 10);
  const durM = parseInt(dur[2], 10);
  const row = seat[1].toUpperCase();
  const col = parseInt(seat[2], 10);

  if (startHH < 0 || startHH > 23 || startMM < 0 || startMM > 59) return null;
  if (durH < 0 || durM < 0 || durM > 59) return null;
  if (col < 1 || col > 24) return null;

  return {
    age: ageRaw as never,
    rating: ratingRaw as never,
    startHH,
    startMM,
    durH,
    durM,
    row,
    col,
  };
};

const calcEndMinutes = (t: Ticket): number => {
  const start = t.startHH * 60 + t.startMM;
  const end = start + t.durH * 60 + t.durM;
  return end; // 日跨ぎは今年は考慮しない前提
};

const checkRating = (
  age: Age,
  rating: Rating,
  hasAdultInSet: boolean
): boolean => {
  if (rating === 'G') return true;
  if (rating === 'R18+') return age === 'Adult';
  // PG-12: Child は Adult 同時購入がなければ NG
  if (rating === 'PG-12' && age === 'Child' && !hasAdultInSet) return false;
  return true;
};

const checkSeat = (t: Ticket): boolean => {
  // J-L は Child NG
  if (t.age === 'Child') {
    const code = t.row.charCodeAt(0);
    const j = 'J'.charCodeAt(0);
    const l = 'L'.charCodeAt(0);
    if (code >= j && code <= l) return false;
  }
  return true;
};

const checkTimeRule = (
  t: Ticket,
  endMinutes: number,
  hasAdultInSet: boolean
): boolean => {
  // しきい値: Child 16:00、Young 18:00（超えると同伴必要）
  const limit =
    t.age === 'Child' ? 16 * 60 : t.age === 'Young' ? 18 * 60 : null;
  if (limit == null) return true; // Adult は対象外
  if (endMinutes > limit && !hasAdultInSet) return false; // ちょうどは許可
  return true;
};

const uniqueStable = <T>(arr: T[]): T[] => {
  const seen = new Set<T>();
  const out: T[] = [];
  for (const x of arr) {
    if (!seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
};
