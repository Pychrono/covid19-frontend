import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";



export default function ContinentBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchContinents = async () => {
      try {
        const res = await fetch("https://disease.sh/v3/covid-19/continents");
        const raw = await res.json();

        const formatted = raw.map((c) => ({
          continent: c.continent,
          cases: c.cases,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Failed to fetch continent data:", err);
      }
    };

    fetchContinents();
  }, []);

  const CustomTick = ({ x, y, payload }) => {
    const words = payload.value.split(" ");
    return (
      <g transform={`translate(${x},${y + 20})`}>  {/* Shift entire group down */}
        <text
          textAnchor="middle"
          fill="#6b7280"
          fontSize="12"
        >
          {words.map((word, i) => (
            <tspan key={i} x="0" dy={i === 0 ? 0 : 14}>
              {word}
            </tspan>
          ))}
        </text>
      </g>
    );
  };
  

  return (
    <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={data}
    margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
  >
    {/* Light Grid */}
    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

    

    {/* Light Axis Labels */}
    <XAxis
  dataKey="continent"
  stroke="#6b7280"
  tick={({ x, y, payload }) => {
    const words = payload.value.split(" ");
    return (
      <g transform={`translate(${x},${y + 10})`}>
        <text textAnchor="middle" fill="#6b7280" fontSize="11">
          {words.map((word, index) => (
            <tspan key={index} x="0" dy={index === 0 ? 0 : 12}>
              {word}
            </tspan>
          ))}
        </text>
      </g>
    );
  }}
/>



    <YAxis
      stroke="#6b7280"
      tick={{ fontSize: 12 }}
      tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
    />

    {/* Light Tooltip */}
    <Tooltip
      formatter={(value) => value.toLocaleString()}
      labelStyle={{ color: "#374151" }}
      contentStyle={{
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        color: "#111827",
      }}
    />

    {/* Stylish Bar */}
    <Bar
      dataKey="cases"
      fill="#3b82f6" // Tailwind blue-500
      radius={[6, 6, 0, 0]}
      barSize={40}
    />
  </BarChart>
</ResponsiveContainer>

  );
}
