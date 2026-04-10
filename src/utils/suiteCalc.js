// AEXS Suite-Tier Financial Model — pure calculation logic.
// Extracted so it can be imported by FinancialModel.jsx and tested independently.
//
// Architecture: one unified suite with three tier prices.
// A customer buys one suite tier; all three modules are included at their tier.
// Revenue, burn, and cash are tracked as a single company-level stream.

export const suiteDefaults = {
  // Canonical suite tier prices (founder-approved 2026-04-09)
  starter: 499,
  growth: 1999,
  enterprise: 8500,

  // Tier mix — % of customer base in each tier
  starterPct: 50,
  growthPct: 35,
  entPct: 15,

  // Growth and churn (monthly %)
  growthRate: 14,
  churn: 3,

  // Cost of goods sold (%)
  cogs: 27,

  // Starting customer base at launch
  initCustomers: 28,

  // Combined monthly operating burn across all three modules ($)
  // = CoS $40K + Governance $48K + Decision Support $53K
  burnBase: 141000,
};

/**
 * Run a 36-month suite-tier projection.
 * @param {typeof suiteDefaults} cfg
 * @returns {Array<{
 *   month, label, customers, mrr, arr,
 *   grossProfit, burn, netBurn, cashBalance, grossMargin
 * }>}
 */
export function calcSuite(cfg) {
  const months = [];
  let customers = cfg.initCustomers;
  let cashBalance = 1_500_000; // approved seed capital

  for (let m = 1; m <= 36; m++) {
    const newCust = Math.round(customers * (cfg.growthRate / 100));
    const churned = Math.round(customers * (cfg.churn / 100));
    customers = customers + newCust - churned;

    const s = Math.round(customers * cfg.starterPct / 100);
    const g = Math.round(customers * cfg.growthPct / 100);
    const e = Math.round(customers * cfg.entPct / 100);
    const mrr = s * cfg.starter + g * cfg.growth + e * cfg.enterprise;

    const cogs = mrr * cfg.cogs / 100;
    const grossProfit = mrr - cogs;
    const burn = cfg.burnBase * (1 + m * 0.01);
    const netBurn = grossProfit - burn;
    cashBalance += netBurn;

    months.push({
      month: m,
      label: m <= 12 ? `M${m}` : m <= 24 ? `Y2M${m - 12}` : `Y3M${m - 24}`,
      customers: Math.round(customers),
      mrr: Math.round(mrr),
      arr: Math.round(mrr * 12),
      grossProfit: Math.round(grossProfit),
      burn: Math.round(burn),
      netBurn: Math.round(netBurn),
      cashBalance: Math.round(cashBalance),
      grossMargin: mrr > 0 ? (grossProfit / mrr) * 100 : 0,
    });
  }
  return months;
}
