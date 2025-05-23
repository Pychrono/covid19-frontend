// src/components/WorldMap.jsx
import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Tooltip } from "react-tooltip";
import { Globe } from "lucide-react";

import Spinner from "./Spinner";


const countryNameMap = {
  "United States of America": "USA",
  "Russian Federation": "Russia",
  Iran: "Iran",
  Vietnam: "Viet Nam",
  Syria: "Syrian Arab Republic",
  Venezuela: "Venezuela",
  Tanzania: "Tanzania",
  Bolivia: "Bolivia",
  Moldova: "Moldova",
  "Ivory Coast": "Côte d'Ivoire",
  Czechia: "Czechia",
  "North Macedonia": "North Macedonia",
  "Republic of the Congo": "Congo",
  "South Korea": "S. Korea",
  "North Korea": "N. Korea",
  "Democratic Republic of the Congo": "Democratic Republic of the Congo", // ✅ FIX
  "Dominican Rep.": "Dominican Republic",
  "Puerto Rico": "Puerto Rico",
  "United Kingdom": "UK",
  "Eq. Guinea": "Equatorial Guinea",
  "e.Swatini": "Eswatini",
  "Bosnia and Herz.": "Bosnia", // ✅ FIX
  Turkmenistan: "Turkmenistan",
  "United Arab Emirates": "UAE",
  Laos: "Lao People's Democratic Republic",
  "Central African Rep.": "Central African Republic",
  "S. Sudan": "South Sudan",
  Libya: "Libyan Arab Jamahiriya",
  Somaliland: "Somalia",
  "W. Sahara": "Western Sahara",
  Antarctica: null,
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const normalizeName = (name) => name?.toLowerCase().replace(/[^a-z]/g, "");

export default function WorldMap() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("https://covid-tracker-server-vcv9.onrender.com/get_global_stats")
      .then((res) => res.json())
      .then((data) => setCountries(data.countries))
      .catch((err) => console.error("Error loading countries for map:", err));
  }, []);

  const colorScale = scaleLinear()
    .domain([0, 100000, 500000, 1000000, 20000000, 40000000, 80000000, 120000000])
    .range(["#ffffcc", "#ffcc00", "#ff9933", "#ff6600", "#cc0000", "#660000", "#660000"]);

  if (!countries.length) return <Spinner />;


return (
  <section>
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 max-w-7xl mx-auto
                    dark:bg-[#000412]/70 dark:text-white dark:border-white/10 backdrop-blur-sm transition-all duration-500">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        <Globe className="w-6 h-6 text-blue-500" />
        Global COVID Severity Map
      </h2>

      {/* Map Card */}
      <div className="rounded-md overflow-hidden border border-gray-300 dark:border-white/10 transition-all duration-500">
        <ComposableMap projectionConfig={{ scale: 170 }} className="w-full">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName = geo?.properties?.name;
                const mappedName = countryNameMap[geoName] || geoName;

                const countryData = countries.find(
                  (c) =>
                    normalizeName(c?.country) === normalizeName(mappedName)
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      typeof countryData?.cases === "number"
                        ? colorScale(Math.min(countryData.cases, 80000000))
                        : "#eee"
                    }
                    data-tooltip-id="map-tooltip"
                    data-tooltip-content={`${mappedName}: ${
                      countryData?.cases?.toLocaleString() || "No Reported data"
                    }`}
                    stroke={
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "#1f2937"
                        : "#ccc"
                    }
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <Tooltip
        id="map-tooltip"
        place="top"
        className="!rounded-md !bg-gray-900 !text-white !text-xs !px-2 !py-1 !border !border-white/10 shadow-md"
      />

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Darker countries represent higher total reported cases.
      </p>

      {/* Legend */}
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
        <p><span className="inline-block w-4 h-4 rounded bg-[#ffffcc] mr-2"></span>0–100k cases</p>
        <p><span className="inline-block w-4 h-4 rounded bg-[#ffcc00] mr-2"></span>100k–500k cases</p>
        <p><span className="inline-block w-4 h-4 rounded bg-[#ff9933] mr-2"></span>500k–1M cases</p>
        <p><span className="inline-block w-4 h-4 rounded bg-[#ff6600] mr-2"></span>1M–20M cases</p>
        <p><span className="inline-block w-4 h-4 rounded bg-[#cc0000] mr-2"></span>20M–40M cases</p>
        <p><span className="inline-block w-4 h-4 rounded bg-[#660000] mr-2"></span>40M–80M+ cases</p>
      </div>
    </div>
  </section>
);

}
