import { describe, it, expect } from 'vitest';
import { calcSuite, suiteDefaults } from './suiteCalc';
import { fmtK, fmtPct } from './format';

// ---------------------------------------------------------------------------
// calcSuite — suite-tier projection
// ---------------------------------------------------------------------------

describe('calcSuite', () => {
  const months = calcSuite(suiteDefaults);

  it('returns exactly 36 months', () => {
    expect(months).toHaveLength(36);
  });

  it('month 1: customers grew from initCustomers', () => {
    expect(months[0].month).toBe(1);
    expect(months[0].customers).toBeGreaterThan(suiteDefaults.initCustomers);
  });

  it('month 1: positive MRR and ARR', () => {
    expect(months[0].mrr).toBeGreaterThan(0);
    expect(months[0].arr).toBe(months[0].mrr * 12);
  });

  it('month 1: cash balance below seed capital (burn > revenue early)', () => {
    // Early months are pre-revenue; cash should be decreasing
    expect(months[0].cashBalance).toBeLessThan(1_500_000);
  });

  it('month 12 (Y1): ARR is approximately $2.6M', () => {
    const y1arr = months[11].arr;
    expect(y1arr).toBeGreaterThan(2_400_000);
    expect(y1arr).toBeLessThan(2_900_000);
  });

  it('month 24 (Y2): ARR is approximately $9.2M', () => {
    const y2arr = months[23].arr;
    expect(y2arr).toBeGreaterThan(8_800_000);
    expect(y2arr).toBeLessThan(9_600_000);
  });

  it('month 36 (Y3): ARR is approximately $32.2M', () => {
    const y3arr = months[35].arr;
    expect(y3arr).toBeGreaterThan(30_000_000);
    expect(y3arr).toBeLessThan(34_000_000);
  });

  it('break-even occurs by month 15', () => {
    const beIdx = months.findIndex(m => m.netBurn >= 0);
    expect(beIdx).toBeGreaterThanOrEqual(0); // must break even within 36 months
    expect(beIdx + 1).toBeLessThanOrEqual(15);
  });

  it('seed capital ($1.5M): cash never goes negative within 36 months', () => {
    const goesNegative = months.some(m => m.cashBalance <= 0);
    expect(goesNegative).toBe(false);
  });

  it('month 36: gross margin is approximately 73%', () => {
    const gm = months[35].grossMargin;
    expect(gm).toBeGreaterThan(72);
    expect(gm).toBeLessThan(74.5);
  });

  it('ARR grows monotonically', () => {
    for (let i = 1; i < months.length; i++) {
      expect(months[i].arr).toBeGreaterThanOrEqual(months[i - 1].arr);
    }
  });

  it('burn grows monotonically (overhead scales with company)', () => {
    for (let i = 1; i < months.length; i++) {
      expect(months[i].burn).toBeGreaterThan(months[i - 1].burn);
    }
  });
});

// ---------------------------------------------------------------------------
// format utilities — boundary cases
// ---------------------------------------------------------------------------

describe('fmtK', () => {
  it('formats sub-$1K values as plain dollars', () => {
    expect(fmtK(0)).toBe('$0');
    expect(fmtK(500)).toBe('$500');
    expect(fmtK(999)).toBe('$999');
  });

  it('formats $1K–$999K as K', () => {
    expect(fmtK(1_000)).toBe('$1K');
    expect(fmtK(50_000)).toBe('$50K');
    expect(fmtK(999_000)).toBe('$999K');
  });

  it('formats $1M+ as M', () => {
    expect(fmtK(1_000_000)).toBe('$1.0M');
    expect(fmtK(32_200_000)).toBe('$32.2M');
  });

  it('handles negative values', () => {
    expect(fmtK(-50_000)).toBe('$-50K');
  });
});

describe('fmtPct', () => {
  it('formats a percentage to one decimal place', () => {
    expect(fmtPct(73)).toBe('73.0%');
    expect(fmtPct(12.5)).toBe('12.5%');
    expect(fmtPct(0)).toBe('0.0%');
  });
});
