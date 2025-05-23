// src/components/ComparisonTool.jsx
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { ChartLine } from "lucide-react"
import Select from "react-select";
import { motion } from "framer-motion";
import Spinner from "./Spinner";




import allCountries from "../data/countriesList.json"; // create a JSON file listing all countries

export default function ComparisonTool() {
  const [countries, setCountries] = useState(["", "", ""]);
  const [days, setDays] = useState(180);
  const [results, setResults] = useState([]);
  const [loading] = useState(false);

  const handleCompare = async () => {
    const queries = countries.filter(Boolean);
    const predictions = [];

    for (const country of queries) {
      const lowerCaseCountry = country.toLowerCase();
      try {
        const histRes = await fetch("https://covid-tracker-server-vcv9.onrender.com/get_current_data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: lowerCaseCountry }),
        });
        console.log("Got hist + pred for:", country);
        const hist = await histRes.json();

        const predRes = await fetch("https://covid-tracker-server-vcv9.onrender.com/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: lowerCaseCountry, future_days: days }),
        });
        
        const pred = await predRes.json();

        if (!hist.dates || !pred.predicted_dates) continue; // skip if invalid

        predictions.push({ country: country.toUpperCase(), hist, pred });
      } catch (err) {
        console.error("Error predicting for", country);
      }
    }
    setResults(predictions);
  };

  const today = new Date();
  const todayDateStr = today.toISOString().split("T")[0];

  const colors = ["#00BFFF", "#FF5733", "#FFD700"];

  const countryOptions = allCountries.map((c) => ({
    value: c,
    label: c,
  }));
  

  return (
    <section id="compare-section">
    <div className="bg-white dark:border-none border border-gray-200  dark:bg-surface dark:text-white rounded-xl shadow-md p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black-600">
        <ChartLine className="w-6 h-6 text-blue-600" />
        Compare & Predict
      </h2>
  
      {/* Input Controls */}
<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8 transition-all duration-500">
  {countries.map((c, idx) => (
    <Select
      key={idx}
      value={c ? { value: c, label: c } : null}
      onChange={(selected) => {
        const copy = [...countries];
        copy[idx] = selected.value;
        setCountries(copy);
      }}
      options={countryOptions}
      placeholder={`Country ${idx + 1}`}
      className="w-full"
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: "1rem",
          padding: "2px",
          backgroundColor: "#ffffff", // always white
          borderColor: "#d1d5db",
          boxShadow: "none",
          "&:hover": { borderColor: "#3b82f6" },
        }),
        menu: (base) => ({
      ...base,
      backgroundColor: "#ffffff",
      color: "#111827",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#111827",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#e5e7eb" : "transparent", // gray-200 on hover
      color: "#111827",
      cursor: "pointer",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280", // gray-500
    }),
      }}
    />
  ))}

  {/* Days input */}
  <input
    type="number"
    value={days}
    onChange={(e) => setDays(e.target.value)}
    min="7"
    max="365"
    placeholder="Days"
    className="p-3 rounded-3xl border border-gray-300 dark:border-white/10 dark:bg-[#000412]/50 dark:text-white bg-white shadow-sm w-full transition-all duration-300 focus:ring-2 focus:ring-blue-400"
  />

  {/* Predict Button */}
  <button
    onClick={handleCompare}
    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl shadow w-full transition-colors duration-300"
  >
    Predict
  </button>
</div>

  
      {/* Prediction Results Chart */}
      {loading ? (
  <Spinner />
) : results.length > 0 ? (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-white text-black border border-gray-200 rounded-xl shadow-xl p-6 dark:bg-[#000412]/70 dark:text-white dark:border-white/10 backdrop-blur-sm transition-all duration-500"
  >
    <h3 className="text-lg font-bold mb-2">Predictions & Current (Next {days} days)</h3>

    <p className="text-sm mb-4">
      Comparing:&nbsp;
      {results.map((res, idx) => (
        <span
          key={res.country}
          className="font-semibold"
          style={{ color: colors[idx % colors.length] }}
        >
          {idx > 0 && " • "}
          {res.country.toUpperCase()}
        </span>
      ))}
    </p>

    <ResponsiveContainer width="100%" height={350}>
      <LineChart>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-white/10" />

        <XAxis
          dataKey="date"
          stroke="#6b7280"
          allowDuplicatedCategory={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={{ stroke: "#6b7280" }}
        />
        <YAxis
          stroke="#6b7280"
          tickFormatter={(val) => `${(val / 1_000_000).toFixed(1)}M`}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={{ stroke: "#6b7280" }}
        />

        <Tooltip
          formatter={(value) => value.toLocaleString()}
          labelStyle={{ color: "#374151" }}
          contentStyle={{
            backgroundColor: "var(--tooltip-bg, #f9fafb)",
            borderColor: "var(--tooltip-border, #e5e7eb)",
            color: "var(--tooltip-text, #111827)",
            fontSize: "0.85rem",
          }}
        />

        <ReferenceLine
          x={todayDateStr}
          stroke="#111827"
          label={{ value: "Today", fill: "#111827", position: "top" }}
        />

        {results.map((res, idx) => {
          const color = colors[idx % colors.length];
          const combined = [];

          if (res.hist?.dates?.forEach && res.pred?.predicted_dates?.forEach) {
            res.hist.dates.forEach((date, i) => {
              combined.push({
                date,
                [`${res.country}_actual`]: res.hist.cases[i],
              });
            });

            res.pred.predicted_dates.forEach((date, i) => {
              combined.push({
                date,
                [`${res.country}_predicted`]: res.pred.predicted_cases[i],
              });
            });
          }

          return (
            <React.Fragment key={res.country}>
              <Line
                data={combined}
                dataKey={`${res.country}_actual`}
                name={`${res.country} (Actual)`}
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                data={combined}
                dataKey={`${res.country}_predicted`}
                name={`${res.country} (Predicted)`}
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </React.Fragment>
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  </motion.div>
): null}
    </div>
  </section>
  
  );
}

