import React from "react";
import SearchForm from "./SearchForm";
import { motion } from "framer-motion";

import { Sun, Moon, ArrowDown } from "lucide-react";


export default function HeroSection({
  country,
  province,
  setCountry,
  setProvince,
  handleSearch,
  darkMode,
  setDarkMode,
}) {
  return (
    <motion.div
      key={darkMode ? "dark" : "light"} // triggers animation when key changes
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <section
        className="relative h-[60vh] w-full overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 "
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/${
            darkMode ? "covid-dark.jpg" : "covid-light.jpg"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* White overlay */}
        <div className="absolute inset-0 backdrop-blur-sm z-10" />

        {/* Gradient to white at bottom */}
        <div
          className={`absolute bottom-0 left-0 w-full h-32 z-20 bg-gradient-to-b from-transparent ${
            darkMode ? "to-[#000412]" : "to-white"
          }`}
        ></div>

        {/* Hero Content */}
        <div className="relative z-30 flex flex-col justify-center items-center text-center animate-fadeIn">
          <h1 className="text-3xl md:text-5xl font-bold text-black-600 mb-4 dark:text-white">
            COVID-19 Tracker & Forecast
          </h1>
          <p className="text-lg md:text-xl text-black-700 mb-6 max-w-xl dark:text-white">
            Explore real-time global data, country insights, and predictive
            trends.
          </p>

          <SearchForm
            country={country}
            province={province}
            setCountry={setCountry}
            setProvince={setProvince}
            handleSearch={handleSearch}
            darkMode={darkMode}
          />
          <button
  onClick={() => setDarkMode(!darkMode)}
  aria-label="Toggle Dark Mode"
  className="fixed top-4 right-4 z-50 flex items-center justify-center gap-2 px-4 py-2
             rounded-full font-medium shadow-md transition-all duration-300
             text-white bg-gradient-to-r from-blue-600 to-blue-800
             hover:from-blue-700 hover:to-blue-900
             dark:from-blue-400 dark:to-purple-600 dark:hover:from-blue-500 dark:hover:to-purple-700"
>
  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
</button>

        </div>

        {/* ✅ Move Compare Button Here */}
        <button
  onClick={() =>
    document
      .getElementById("compare-section")
      ?.scrollIntoView({ behavior: "smooth" })
  }
  className="hidden sm:flex items-center gap-2 absolute bottom-4 right-4 z-30 
             bg-blue-600 text-white px-4 py-2 rounded-full shadow-md 
             hover:bg-blue-700 transition-all duration-300 
             border border-blue-700 dark:border-blue-400 dark:bg-blue-500 
             dark:hover:bg-blue-600 dark:text-white backdrop-blur-sm"
>
  <ArrowDown className="w-4 h-4" />
  Compare Countries
</button>

      </section>
    </motion.div>
  );
}
