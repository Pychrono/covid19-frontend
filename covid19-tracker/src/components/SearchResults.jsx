import React from "react";
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
  ReferenceLine,
} from "recharts";
import { LineChart as LineChartIcon, ChartPie } from "lucide-react";
import { motion } from "framer-motion";

// import { ChartPie } from "lucide-reacts"

const pieColorMap = {
  Recovered: "#2ECC40",
  Deaths: "#FF4136",
  Active: "#0074D9",
};

export default function SearchResults({
  stats,
  data,
  setStats,
  setData,
  chartType,
  setChartType,
  loading,
  country,
  results,
  colors,
  darkMode,
}) {
  const pieData = stats
    ? [
        { name: "Recovered", value: stats.recovered },
        { name: "Deaths", value: stats.deaths },
        { name: "Active", value: stats.active },
      ]
    : [];

  if (loading) return <p className="mt-6">Loading...</p>;
  if (!stats && !data) return null;

  const todayDateStr = new Date().toISOString().split("T")[0]; // e.g. "2025-05-11"

  const combinedData = [];

  if (results && results.length > 0) {
    const allDates = new Set();

    results.forEach((res) => {
      res.hist?.dates?.forEach?.((d) => allDates.add(d));
      res.pred?.predicted_dates?.forEach?.((d) => allDates.add(d));
    });

    const sortedDates = Array.from(allDates).sort();

    sortedDates.forEach((date) => {
      const entry = { date };
      results.forEach((res) => {
        const countryKey = res.country.replace(/\s+/g, "_").toLowerCase();

        const histIdx = res.hist?.dates?.indexOf(date);
        const predIdx = res.pred?.predicted_dates?.indexOf(date);

        if (histIdx >= 0 && res.hist.cases) {
          entry[`${countryKey}_actual`] = res.hist.cases[histIdx];
        }
        if (predIdx >= 0 && res.pred.predicted_cases) {
          entry[`${countryKey}_predicted`] = res.pred.predicted_cases[predIdx];
        }
      });
      combinedData.push(entry);
    });
  }

  const hasChartData = data?.dates?.length > 0 && data?.cases?.length > 0;

  if (!hasChartData && stats) {
    console.warn("No time-series chart data for:", country);
  }

  const formattedLineData =
    data?.dates?.map((date, idx) => ({
      date,
      cases: data.cases[idx],
    })) || [];

  return (
    <motion.div
      className={`rounded-2xl p-6 shadow-md transition-colors duration-300 ${
        darkMode ? "bg-[#000412] text-white" : "bg-white text-black"
      }`}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mt-10">
        {stats && (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => {
                  setStats(null);
                  setData(null);
                }}
                aria-label="Close"
                className="w-8 h-8 flex items-center justify-center rounded-full
      text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700
      shadow-sm transition-all duration-200
      dark:bg-[#000412]/50 dark:text-blue-400 dark:border-blue-400 dark:hover:border-blue-300"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 transition-all duration-500">
              {[
                {
                  label: "Total Cases",
                  value: stats.cases,
                  lightText: "text-blue-700",
                  lightBg: "bg-blue-50",
                  darkText: "text-blue-400",
                  darkBg: "bg-blue-900/10",
                  darkBorder: "border-blue-400/30",
                },
                {
                  label: "Deaths",
                  value: stats.deaths,
                  lightText: "text-red-600",
                  lightBg: "bg-red-50",
                  darkText: "text-red-400",
                  darkBg: "bg-red-900/10",
                  darkBorder: "border-red-400/30",
                },
                {
                  label: "Recovered",
                  value: stats.recovered,
                  lightText: "text-green-700",
                  lightBg: "bg-green-50",
                  darkText: "text-green-400",
                  darkBg: "bg-green-900/10",
                  darkBorder: "border-green-400/30",
                },
                {
                  label: "Active",
                  value: stats.active,
                  lightText: "text-yellow-600",
                  lightBg: "bg-yellow-50",
                  darkText: "text-yellow-400",
                  darkBg: "bg-yellow-900/10",
                  darkBorder: "border-yellow-400/30",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`
        p-6 rounded-xl text-center shadow-lg backdrop-blur-sm transition-all duration-500
        border ${
          darkMode
            ? `${stat.darkBg} ${stat.darkBorder} ${stat.darkText} shadow-[0_4px_20px_rgba(0,0,0,0.4)]`
            : `${stat.lightBg} ${stat.lightText} border-gray-200 shadow-md`
        }
      `}
                >
                  <h3
                    className={`text-sm font-semibold uppercase mb-1 ${
                      darkMode ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {stat.label}
                  </h3>
                  <p
                    className={`text-2xl sm:text-3xl font-bold ${
                      darkMode ? stat.darkText : stat.lightText
                    }`}
                  >
                    {Number(stat.value).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {data?.cases && (
          <div className="mt-8 bg-white dark:bg-surface dark:text-white border border-gray-200 dark:border-none rounded-2xl shadow-lg px-2 py-4 sm:p-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-white sm:text-md">
                {chartType === "line" ? (
                  <>
                    <LineChartIcon className="w-5 h-5 text-blue-500 dark:text-blue-500" />
                    Daily Case Timeline for {country.toUpperCase()}
                  </>
                ) : (
                  <>
                    <ChartPie className="w-5 h-5 text-blue-500 dark:text-blue-500" />
                    Current COVID-19 Breakdown for {country.toUpperCase()}
                  </>
                )}
              </h3>

              <button
                onClick={() =>
                  setChartType(chartType === "line" ? "pie" : "line")
                }
                className="text-sm bg-gray-100 dark:bg-[#005ACB] dark:text-white border border-gray-300 dark:border-none hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Toggle to {chartType === "line" ? "Pie Chart" : "Line Chart"}
              </button>
            </div>

            <div className="px-2 sm:px-4 pt-4">
              <div className="w-full h-[350px] sm:h-[400px] overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart
                      data={results.length ? combinedData : formattedLineData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
                      <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        allowDuplicatedCategory={false}
                      />
                      <YAxis
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(val) =>
                          `${(val / 1_000_000).toFixed(1)}M`
                        }
                      />
                      <Tooltip
                        labelStyle={{ color: "#374151", fontWeight: 600 }}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                        }}
                        itemStyle={{ color: "#111827" }}
                      />
                      <ReferenceLine
                        x={todayDateStr}
                        stroke="#9ca3af"
                        strokeDasharray="2 2"
                        label={{
                          value: "Today",
                          fill: "#6b7280",
                          fontSize: 12,
                          position: "top",
                          fontWeight: 600,
                        }}
                      />
                      {!results.length && (
                        <Line
                          type="monotone"
                          dataKey="cases"
                          strokeWidth={2}
                          stroke={darkMode ? "#38bdf8" : "#3b82f6"}
                          fill={darkMode ? "#1e3a8a" : "#93c5fd"}
                          isAnimationActive={true}
                          animationDuration={1500}
                          dot={false}
                        />
                      )}
                      {results.map((res, idx) => {
                        const countryKey = res.country
                          .replace(/\s+/g, "_")
                          .toLowerCase();
                        const color = colors[idx % colors.length];
                        return (
                          <React.Fragment key={res.country}>
                            <Line
                              dataKey={`${countryKey}_actual`}
                              name={`${res.country} (Actual)`}
                              stroke={color}
                              strokeWidth={2}
                              dot={false}
                              type="monotone"
                            />
                            <Line
                              dataKey={`${countryKey}_predicted`}
                              name={`${res.country} (Predicted)`}
                              stroke="#9ca3af"
                              strokeWidth={2}
                              strokeDasharray="4 4"
                              dot={false}
                              type="monotone"
                            />
                          </React.Fragment>
                        );
                      })}
                    </LineChart>
                  ) : (
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
                        innerRadius={50}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        stroke="#222"
                        strokeWidth={1}
                      >
                        {pieData.map((entry) => (
                          <Cell
                            key={`cell-${entry.name}`}
                            fill={`url(#grad-${entry.name})`}
                            style={{
                              filter:
                                "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))",
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend className="hidden sm:block" />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
