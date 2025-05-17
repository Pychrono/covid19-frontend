import React from "react";
import allCountries from "../data/countriesList.json";
import Select from "react-select";



const countryOptions = allCountries.map((c) => ({
  value: c,
  label: c,
}));

export default function SearchForm({ country, setCountry, handleSearch }) {
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
              padding: "2px",
              fontSize: "14px",
              boxShadow: "none",
              "&:hover": { borderColor: "#3b82f6" },
            }),
            placeholder: (base) => ({
              ...base,
              textAlign: "left",
              color: "#9ca3af", // Tailwind gray-400
              fontWeight: 400,
            }),
            singleValue: (base) => ({
              ...base,
              textAlign: "left",
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-3xl"
      >
        Search
      </button>
    </div>
  );
}
