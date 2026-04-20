'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface OrdersChartProps {
  data: { city: string; count: number; revenue: number }[];
  isLoading: boolean;
}

export function OrdersChart({ data, isLoading }: OrdersChartProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-1">Orders by Location</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Order distribution and revenue across cities
      </p>

      {isLoading ? (
        <div className="h-72 bg-secondary/30 rounded animate-pulse" />
      ) : data.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="city"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                yAxisId="left"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) =>
                  name === 'revenue' ? [`₦${value.toLocaleString()}`, 'Revenue'] : [value, 'Orders']
                }
              />
              <Legend />
              <Bar yAxisId="left" dataKey="count" name="Orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="hsl(var(--primary) / 0.4)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
