// src/components/GlobalDashboard.jsx
import React, { useEffect, useState } from "react";
import GlobalTrendChart from "../components/GlobalTrendChart";
import ContinentBarChart from "../components/ContinentBarChart";
import { motion } from "framer-motion";
import {
  Activity,
  Skull,
  HeartPulse,
  TrendingUp,
  Globe,
  BarChart3,
  LineChart,
} from "lucide-react";

// import {
// BarChart,
// Bar,
// XAxis,
// YAxis,
// Tooltip,
// ResponsiveContainer,
// CartesianGrid,
// LabelList,
//   } from "recharts";

export default function GlobalDashboard({ darkMode }) {
  const [globalStats, setGlobalStats] = useState(null);
  const [topCountries, setTopCountries] = useState([]);
  const [topDeaths, setTopDeaths] = useState([]);
  const [topRecovered, setTopRecovered] = useState([]);

  useEffect(() => {
    fetch("https://covid-tracker-server-vcv9.onrender.com/get_global_stats")
      .then((res) => res.json())
      .then((data) => {
        setGlobalStats(data.global);

        const topCases = [...data.countries]
          .sort((a, b) => b.cases - a.cases)
          .slice(0, 10);

        const topDeaths = [...data.countries]
          .sort((a, b) => b.deaths - a.deaths)
          .slice(0, 10);

        const topRecovered = [...data.countries]
          .sort((a, b) => b.recovered - a.recovered)
          .slice(0, 10);

        setTopCountries(topCases);
        setTopDeaths(topDeaths);
        setTopRecovered(topRecovered);
      });
  }, []);

  return (
    <section className="w-full bg-white text-gray-900 py-12 px-4  dark:bg-surface dark:text-white">
      <h2 className="text-3xl font-bold mb-10 text-center flex items-center gap-2">
        <Globe className="w-6 h-6 text-blue-500" />
        Global Overview
      </h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {globalStats
          ? [
              {
                label: "Total Cases",
                value: globalStats.cases,
                lightText: "text-blue-700",
                lightBg: "bg-blue-50",
                darkText: "text-blue-400",
                darkBg: "bg-blue-900/10",
                darkRing: "ring-1 ring-blue-400/30",
                icon: <Activity className="w-5 h-5 text-blue-500" />,
              },
              {
                label: "Total Deaths",
                value: globalStats.deaths,
                lightText: "text-red-700",
                lightBg: "bg-red-50",
                darkText: "text-red-400",
                darkBg: "bg-red-900/10",
                darkRing: "ring-1 ring-red-400/30",
                icon: <Skull className="w-5 h-5 text-red-500" />,
              },
              {
                label: "Total Recoveries",
                value: globalStats.recovered,
                lightText: "text-green-700",
                lightBg: "bg-green-50",
                darkText: "text-green-400",
                darkBg: "bg-green-900/10",
                darkRing: "ring-1 ring-green-400/30",
                icon: <HeartPulse className="w-5 h-5 text-green-500" />,
              },
              {
                label: "Active Cases",
                value: globalStats.active,
                lightText: "text-yellow-700",
                lightBg: "bg-yellow-50",
                darkText: "text-yellow-400",
                darkBg: "bg-yellow-900/10",
                darkRing: "ring-1 ring-yellow-400/30",
                icon: <TrendingUp className="w-5 h-5 text-yellow-500" />,
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`p-6 rounded-xl text-center transition-all duration-500 backdrop-blur-sm
          border shadow-lg
          ${
            darkMode
              ? `${stat.darkBg} ${stat.darkRing} ${stat.darkText} border-white/10`
              : `${stat.lightBg} ${stat.lightText} border-gray-200`
          }
        `}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="mb-2 flex justify-center">{stat.icon}</div>
                <h3
                  className={`text-sm font-semibold uppercase mb-1 ${
                    darkMode ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {stat.label}
                </h3>
                <p className="text-[1.75rem] sm:text-3xl font-bold break-words">
                  {Number(stat.value).toLocaleString()}
                </p>
              </motion.div>
            ))
          : Array(4)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gray-100 dark:bg-[#000412]/50 dark:border-white/10 border border-gray-200 shadow rounded-xl text-center animate-pulse"
                >
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 mx-auto mb-4 rounded" />
                  <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 mx-auto rounded" />
                </div>
              ))}
      </div>

      {/* Line + Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12 mt-8">
        <div className="bg-white  dark:bg-surface dark:text-white dark:border-none border border-gray-200 rounded-xl shadow-xl p-6 h-[400px] sm:p-6 p-0 pt-6 pt-2">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 p-4">
            <LineChart className="w-6 h-6 text-gray-500 dark:text-blue-500" />{" "}
            Daily Global Cases
          </h3>
          <div className="h-64">
            <GlobalTrendChart />
          </div>
        </div>
        <div className="bg-white dark:border-none border border-gray-200  dark:bg-surface dark:text-white rounded-xl shadow-xl p-6 h-[400px] sm:p-6 p-0 pt-6 pt-2">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 p-4">
            <BarChart3 className="w-6 h-6 text-gray-500 dark:text-blue-500" />
            Active Cases by Continent
          </h3>
          <div className="h-64">
            <ContinentBarChart />
          </div>
        </div>
      </div>

      {/* Top 10 Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Deaths Section */}
        <div
          className="rounded-xl shadow-xl p-6 border transition-colors duration-500
    bg-white text-black border-gray-200
    dark:bg-[#000412]/70 dark:text-white dark:border-white/10 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-black dark:text-white">
            <Skull className="w-5 h-5 text-red-500" />
            Top 10 Countries by Deaths
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {[...topDeaths]
  .sort((a, b) => b.deaths - a.deaths)
  .slice(0, 10)
  .map((country, idx, array) => {
    const max = array[0].deaths;
    const percent = (country.deaths / max) * 100;

    return (
      <motion.div
        key={country.country}
        className="space-y-1"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex justify-between text-sm text-gray-700 dark:text-white items-center">
          <span className="flex items-center gap-2">
            <img
              src={country.flag}
              alt={country.country}
              className="w-5 h-3 rounded-sm"
            />
            <span className="text-[13px]">{country.country}</span>
          </span>
          <span className="font-medium text-sm">
            {country.deaths.toLocaleString()}
          </span>
        </div>

        <div className="w-full bg-gray-100 dark:bg-white/10 h-3 rounded overflow-hidden">
          <div
            className="h-3 bg-red-500 dark:bg-red-500/80 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        {idx < 9 && <hr className="border-t border-gray-100 dark:border-white/5" />}
      </motion.div>
    );
  })}

          </div>
        </div>

        {/* Recoveries Section */}
        <div
          className="bg-white border border-gray-200 text-black rounded-xl shadow-xl p-6
             dark:bg-[#000412]/70 dark:text-white dark:border-white/10 backdrop-blur-sm transition-colors duration-500"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-black dark:text-white">
            <HeartPulse className="w-5 h-5 text-green-600" />
            Top 10 Countries by Recoveries
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {[...topRecovered]
              .sort((a, b) => b.recovered - a.recovered)
              .slice(0, 10)
              .map((country, idx, array) => {
                const max = array[0].recovered;
                const percent = (country.recovered / max) * 100;

                return (
                  <motion.div
                    key={country.country}
                    className="space-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex justify-between text-sm items-center text-gray-700 dark:text-white">
              <span className="flex items-center gap-2">
                <img
                  src={country.flag}
                  alt={country.country}
                  className="w-5 h-3 rounded-sm"
                />
                <span className="text-[13px]">{country.country}</span>
              </span>
              <span className="font-medium text-sm">
                {country.recovered.toLocaleString()}
              </span>
            </div>

            <div className="w-full bg-gray-100 dark:bg-white/10 h-3 rounded overflow-hidden">
              <div
                className="h-3 bg-green-500 dark:bg-green-500/80 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            {idx < 9 && <hr className="border-t border-gray-100 dark:border-white/5" />}
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
