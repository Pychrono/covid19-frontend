import React, { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import GlobalDashboard from "./components/GlobalDashboard";
import ComparisonTool from "./components/ComparisonTool";
import WorldMap from "./components/WorldMap";
import SearchResults from "./components/SearchResults";
// import SearchForm from "./components/SearchResults";
import { motion } from "framer-motion";


export default function App() {
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("line");
  const [results] = useState([]);

    const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("dark") === "true";
  });

  const colors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#14b8a6", // teal
    "#e11d48", // rose
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("dark", darkMode);
  }, [darkMode]);

  const handleSearch = async () => {
    setLoading(true);
    setData(null);
    setStats(null);

    try {
      const countryAliases = {
        USA: "United States Of America",
        uk: "United Kingdom",
        uae: "United Arab Emirates",
        drc: "Democratic Republic of the Congo",
        tanzania: "United Republic of Tanzania",
      };
      
      const normalizedCountry =
        countryAliases[country.toLowerCase()] || country;
      
      const body = JSON.stringify({
        country: normalizedCountry.toLowerCase(), // if your backend expects lowercase
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

      // ✅ Smooth scroll to search result section
      setTimeout(() => {
        document
          .getElementById("search-results-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100); // slight delay to let DOM render
    } catch (err) {
      console.error("Error fetching data:", err);
    }

    setLoading(false);
  };

  return (
    <div className={`min-h-screen font-sans ${darkMode ? "bg-gray-950 text-white" : "bg-white text-black"}`}>
      <main>
        <HeroSection
          country={country}
          province={province}
          setCountry={setCountry}
          setProvince={setProvince}
          handleSearch={handleSearch}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <section
          id="search-results-section"
          className={`${stats || data ? "py-12" : "py-0"} px-4`}
        >
          {stats || data ? (
            <motion.div
              className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <SearchResults
                stats={stats}
                data={data}
                setStats={setStats}
                setData={setData}
                chartType={chartType}
                setChartType={setChartType}
                country={country}
                loading={loading}
                results={results}
                colors={colors}
              />
            </motion.div>
          ) : null}
        </section>
        <section className={stats || data ? "mt-10" : "mt-1"}>
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-7xl mx-auto">
            <GlobalDashboard />
          </div>
        </section>

        <section id="compare-section" className="py-4 px-4">
          <div>
            <ComparisonTool />
          </div>
        </section>

        <section className="mt-12">
          <WorldMap />
        </section>
      </main>
    </div>
  );
}