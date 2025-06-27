interface KPIData {
  grossRevenue: number;
  grossProfit: number;
  grossMargin: number;
  expenses: number;
  totalSalaries: number;
  revenueByProduct: Array<{
    product: string;
    revenue: number;
  }>;
}

interface RevenueDataPoint {
  date: string;
  revenue: number;
  total: number;
  cumulativeRevenue: number;
}

interface transactionsDataPoint {
  date: string;
  total: number;
}

const getTransactionsTimeSeries = async (
  from: Date,
  to: Date
): Promise<transactionsDataPoint[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const transactions = [
    { date: "2025-01-01", total: 100 },
    { date: "2025-01-02", total: 200 },
    { date: "2025-01-03", total: 300 },
  ];
  return transactions;
};

const getRevenueTimeSeries = async (
  from: Date,
  to: Date
): Promise<RevenueDataPoint[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const revenue: RevenueDataPoint[] = [
    { date: "2025-01-01", revenue: 100, total: 100, cumulativeRevenue: 100 },
    { date: "2025-01-02", revenue: 200, total: 200, cumulativeRevenue: 200 },
    { date: "2025-01-03", revenue: 300, total: 300, cumulativeRevenue: 300 },
  ];
  return revenue;
};

const getKPIs = async (from: Date, to: Date): Promise<KPIData> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const kpis = {
    grossRevenue: 100,
    grossProfit: 200,
    grossMargin: 300,
    expenses: 400,
    totalSalaries: 500,
    revenueByProduct: [
      { product: "Product 1", revenue: 100 },
      { product: "Product 2", revenue: 200 },
      { product: "Product 3", revenue: 300 },
    ],
  };
  return kpis;
};

const getPreviousKPIs = async (from: Date, to: Date): Promise<KPIData> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const previousKPIs = {
    grossRevenue: 100,
    grossProfit: 200,
    grossMargin: 300,
    expenses: 400,
    totalSalaries: 500,
    revenueByProduct: [
      { product: "Product 1", revenue: 100 },
      { product: "Product 2", revenue: 200 },
      { product: "Product 3", revenue: 300 },
    ],
  };
  return previousKPIs;
};

export {
  getTransactionsTimeSeries,
  getRevenueTimeSeries,
  getPreviousKPIs,
  getKPIs,
};
