import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GlobalTrendChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=all");
        const data = await res.json();
        const cases = data.cases;
  
        const formatted = Object.keys(cases).map((date, index, arr) => {
          const prevVal = index > 0 ? cases[arr[index - 1]] : 0;
          const daily = cases[date] - prevVal;
          return {
            date,
            cases: daily < 0 ? 0 : daily,
          };
        });
        
  
        console.log("Formatted daily cases data:", formatted); // ✅ now it's safe
        setChartData(formatted);
      } catch (err) {
        console.error("Failed to load global trend data:", err);
      }
    };
  
    fetchTrend();
  }, []);
  

  return (
    <section>
      {/* <h2 className="text-xl font-bold mb-4"></h2> */}
      <div className="bg-white-500  h-64">
      <ResponsiveContainer width="100%" height="100%">
  <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
    <XAxis
      dataKey="date"
      tick={{ fill: "#4b5563", fontSize: 12 }}
      minTickGap={30}
    />
   <YAxis
  tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
  tick={{ fill: "#4b5563", fontSize: 12 }}
/>

<Tooltip
  labelStyle={{ color: "#374151" }}
  formatter={(value) => `${value.toLocaleString()} cases`}
  contentStyle={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}
/>

<Line
  type="monotone"
  dataKey="cases"
  stroke="#3b82f6"
  strokeWidth={2}
  dot={false}
/>

  </LineChart>
</ResponsiveContainer>

      </div>
    </section>
  );
}
