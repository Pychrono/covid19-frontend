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


import allCountries from "../data/countriesList.json"; // create a JSON file listing all countries

export default function ComparisonTool() {
  const [countries, setCountries] = useState(["", "", ""]);
  const [days, setDays] = useState(180);
  const [results, setResults] = useState([]);

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
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black-600">
        <ChartLine className="w-6 h-6 text-blue-600" />
        Compare & Predict
      </h2>
  
      {/* Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
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
        borderRadius: '1rem',
        padding: '2px',
        borderColor: '#d1d5db', // Tailwind gray-300
        boxShadow: 'none',
        '&:hover': { borderColor: '#3b82f6' }, // purple-400
      }),
    }}
  />
))}



  <input
    type="number"
    value={days}
    onChange={(e) => setDays(e.target.value)}
    className="p-3 rounded-3xl border border-gray-300  focus:ring-blue-400 w-full"
    min="7"
    max="365"
    placeholder="Days"
  />

  <button
    onClick={handleCompare}
    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl shadow w-full"
  >
    Predict
  </button>
</div>

  
      {/* Prediction Results Chart */}
      {results.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-2 text-gray-800">
           Predictions & Current (Next {days} days)
          </h3>
  
          <p className="text-sm text-gray-600 mb-4">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                allowDuplicatedCategory={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#6b7280"
                tickFormatter={(val) => `${(val / 1_000_000).toFixed(1)}M`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => value.toLocaleString()}
                labelStyle={{ color: "#374151" }}
                contentStyle={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}
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
                      stroke="#4b5563"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </React.Fragment>
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  </section>
  
  );
}

