// src/components/CountrySearch.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import allCountries from "../data/countriesList.json";

const pieColorMap = {
  Recovered: "#2ECC40",
  Deaths: "#FF4136",
  Active: "#0074D9",
};




export default function CountrySearch() {
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("line");

  const handleSearch = async () => {
    setLoading(true);
    setData(null);
    setStats(null);

    try {
      const body = JSON.stringify({
        country: country.toLowerCase(),
        province,
      });

      const [res1, res2] = await Promise.all([
        fetch("https://covid-tracker-server-vcv9.onrender.com/get_current_data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }),
        fetch(`https://disease.sh/v3/covid-19/countries/${country}`),
      ]);

      const timeline = await res1.json();
      const liveStats = await res2.json();

      setData(timeline);
      setStats(liveStats);
    } catch (err) {
      console.error("Error fetching data:", err);
    }

    setLoading(false);
  };

  const formattedLineData =
    data?.dates?.map((date, idx) => ({
      date,
      cases: data.cases[idx],
    })) || [];

  const pieData = stats
    ? [
        { name: "Recovered", value: stats.recovered },
        { name: "Deaths", value: stats.deaths },
        { name: "Active", value: stats.active },
      ]
    : [];
  
    const inputRef = useRef(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

  return (
    <section>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
         ref={inputRef}
          type="text"
          placeholder="🔍 Search by country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          list="country-suggestions"
          className="shadow-lg p-3 w-full max-w-md rounded-lg shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <datalist id="country-suggestions">
          {allCountries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <input
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          placeholder="Province (optional)"
          className="p-2 rounded text-black"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-6">Loading...</p>}

      {stats && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
          <div className="bg-blue-700 p-4 rounded text-center">
            <p className="text-sm">Total Cases</p>
            <p className="font-bold text-xl">{stats.cases.toLocaleString()}</p>
          </div>
          <div className="bg-green-700 p-4 rounded text-center">
            <p className="text-sm">Recovered</p>
            <p className="font-bold text-xl">
              {stats.recovered.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-700 p-4 rounded text-center">
            <p className="text-sm">Deaths</p>
            <p className="font-bold text-xl">{stats.deaths.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-600 p-4 rounded text-center">
            <p className="text-sm">Active</p>
            <p className="font-bold text-xl">{stats.active.toLocaleString()}</p>
          </div>
        </div>
      )}

      {data?.cases && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {chartType === "line"
                ? `📈 Daily Case Timeline for ${country.toUpperCase()}`
                : `📊 Current COVID-19 Breakdown for ${country.toUpperCase()}`}
            </h3>
            <button
              onClick={() =>
                setChartType(chartType === "line" ? "pie" : "line")
              }
              className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white"
            >
              Toggle to {chartType === "line" ? "Pie Chart" : "Line Chart"}
            </button>
          </div>

          <div className="h-[400px] bg-gray-900 rounded p-4">
            {chartType === "line" ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedLineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#ccc", fontSize: 12 }}
                    minTickGap={30}
                  />
                  <YAxis tick={{ fill: "#ccc" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cases"
                    stroke="#00BFFF"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {pieData.map((entry) => (
                      <linearGradient
                        id={`grad-${entry.name}`}
                        key={entry.name}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={pieColorMap[entry.name]}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor={pieColorMap[entry.name]}
                          stopOpacity={1}
                        />
                      </linearGradient>
                    ))}
                  </defs>

                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    label
                    stroke="#222"
                    strokeWidth={1}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={`url(#grad-${entry.name})`}
                        style={{
                          filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))",
                        }}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {data?.error && <p className="text-red-400 mt-4">❌ {data.error}</p>}
    </section>
  );
}
