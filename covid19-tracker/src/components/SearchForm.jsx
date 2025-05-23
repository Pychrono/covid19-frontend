import React from "react";
import allCountries from "../data/countriesList.json";
import Select from "react-select";

const countryOptions = allCountries.map((c) => ({
  value: c,
  label: c,
}));

export default function SearchForm({
  country,
  setCountry,
  handleSearch,
  darkMode,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex justify-center">
        <Select
  value={country ? { label: country, value: country } : null}
  onChange={(selected) => setCountry(selected.value)}
  options={countryOptions}
  placeholder="🔍 Search a country"
  className="w-full sm:w-[320px]"
  classNamePrefix="react-select"
  styles={{
    control: (base) => ({
      ...base,
      borderRadius: "1rem",
      borderColor: "#d1d5db",
      backgroundColor: "#ffffff",
      color: "#111827", // gray-900
      boxShadow: "none",
      "&:hover": {
        borderColor: "#3b82f6", // blue-500
      },
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

      </div>

      <datalist id="country-suggestions">
        {allCountries.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-3xl transition-colors duration-200"
>
        Search
      </button>
    </div>
  );
}
