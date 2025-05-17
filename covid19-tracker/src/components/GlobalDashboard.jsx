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
  Map,
  LineChart,
  LayoutDashboard,
  ChartBarIncreasing,
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

export default function GlobalDashboard() {
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
    <section className="w-full bg-white text-gray-900 py-12 px-4">
      <h2 className="text-3xl font-bold mb-10 text-center flex items-center gap-2">
        <Globe className="w-6 h-6 text-blue-500" />
        Global Overview
      </h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {globalStats ? (
          [
            {
              label: "Total Cases",
              value: globalStats.cases,
              text: "text-blue-700",
              bg: "bg-blue-50",
              icon: <Activity className="w-5 h-5 text-blue-500" />,
            },
            {
              label: "Total Deaths",
              value: globalStats.deaths,
              text: "text-red-700",
              bg: "bg-red-50",
              icon: <Skull className="w-5 h-5 text-blue-500" />,
            },
            {
              label: "Total Recoveries",
              value: globalStats.recovered,
              text: "text-green-700",
              bg: "bg-green-50",
              icon: <HeartPulse className="w-5 h-5 text-blue-500" />,
            },
            {
              label: "Active Cases",
              value: globalStats.active,
              text: "text-yellow-700",
              bg: "bg-yellow-50",
              icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`p-6 ${stat.bg} border border-gray-200 shadow-lg rounded-xl text-center`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase">
                {stat.label}
              </h3>
              <p className={`text-3xl font-bold mt-2 ${stat.text} break-words text-[1.75rem] sm:text-3xl`}>
                {Number(stat.value).toLocaleString()}
              </p>
            </motion.div>
          ))
        ) : (
          // 🔄 Skeleton loader cards
          Array(4).fill(0).map((_, idx) => (
            <div
              key={idx}
              className="p-6 bg-gray-100 border border-gray-200 shadow rounded-xl text-center animate-pulse"
            >
              <div className="h-4 w-24 bg-gray-300 mx-auto mb-4 rounded" />
              <div className="h-6 w-32 bg-gray-300 mx-auto rounded" />
            </div>
          ))
        )}
      </div>

      {/* Line + Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12 mt-8">
        <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 h-[400px] sm:p-6 p-0 pt-6 pt-2">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 p-4">
            <LineChart className="w-6 h-6 text-gray-500" /> Daily Global Cases
          </h3>
          <div className="h-64">
            <GlobalTrendChart />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 h-[400px] sm:p-6 p-0 pt-6 pt-2">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 p-4">
            <BarChart3 className="w-6 h-6 text-gray-500" />
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
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-black-600">
              <Skull className="w-5 h-5 text-red-500" />
              Top 10 Countries by Deaths
            </h3>
            <div className="space-y-3">
              {[...topDeaths]
                .sort((a, b) => b.deaths - a.deaths)
                .slice(0, 10)
                .map((country, idx, array) => {
                  const max = array[0].deaths;
                  const percent = (country.deaths / max) * 100;

                  return (
                    <div key={country.country} className="space-y-1">
                      <div className="flex justify-between text-sm text-gray-700 items-center">
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
                      <div className="w-full bg-gray-100 h-3 rounded overflow-hidden relative">
                        <div
                          className="h-3 bg-red-400 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        >
                        </div>
                      </div>
                      {idx < 9 && <hr className="border-t border-gray-100" />}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Recoveries Section */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-black-600">
              <HeartPulse className="w-5 h-5 text-green-600" />
              Top 10 Countries by Recoveries
            </h3>
            <div className="space-y-3">
              {[...topRecovered]
                .sort((a, b) => b.recovered - a.recovered)
                .slice(0, 10)
                .map((country, idx, array) => {
                  const max = array[0].recovered;
                  const percent = (country.recovered / max) * 100;

                  return (
                    <div key={country.country} className="space-y-1">
                      <div className="flex justify-between text-sm text-gray-700 items-center">
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
                      <div className="w-full bg-gray-100 h-3 rounded overflow-hidden relative">
                        <div
                          className="h-3 bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        >
                        </div>
                      </div>
                      {idx < 9 && <hr className="border-t border-gray-100" />}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
    </section>
  );
}
