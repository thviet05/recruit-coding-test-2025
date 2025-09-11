import { describe, expect, it } from 'vitest';
import { solve } from './solve.js';

describe('Q1 solve', () => {
  it('test run check: returns string', () => {
    expect(typeof solve('')).toBe('string');
  });

  it.skip('example 1', () => {
    const input = [
      'Adult,PG-12,11:15,1:50,F-8',
      'Young,PG-12,11:15,1:50,F-9',
    ].join('\n');
    const out = solve(input);
    expect(out).toBe(['1800円', '1200円'].join('\n'));
  });

  it.skip('example 2', () => {
    const input = [
      'Child,PG-12,18:30,1:35,D-12',
      'Young,PG-12,18:30,1:35,D-13',
    ].join('\n');
    const out = solve(input);
    expect(out).toBe(
      [
        '対象の映画の入場には大人の同伴が必要です,対象の映画は年齢制限により閲覧できません',
        '対象の映画の入場には大人の同伴が必要です',
      ].join('\n')
    );
  });

  it.skip('example 3', () => {
    const input = ['Adult,G,18:30,1:35,J-15', 'Child,G,18:30,1:35,J-16'].join(
      '\n'
    );
    const out = solve(input);
    expect(out).toBe('対象のチケットではその座席をご利用いただけません');
  });
});
