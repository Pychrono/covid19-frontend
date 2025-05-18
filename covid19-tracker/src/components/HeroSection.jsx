import React from "react";
import SearchForm from "./SearchForm";

export default function HeroSection({
  country,
  province,
  setCountry,
  setProvince,
  handleSearch,
}) {
  return (
<section
  className="relative h-[60vh] w-full overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
  style={{
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/covid-hero.jpg)`

  }}
>
  {/* White overlay */}
  <div className="absolute inset-0 backdrop-blur-sm z-10" />

  {/* Gradient to white at bottom */}
  <div className="absolute bottom-0 left-0 w-full h-32 z-20 bg-gradient-to-b from-transparent to-white" />

  {/* Hero Content */}
  <div className="relative z-30 flex flex-col justify-center items-center text-center animate-fadeIn">
    <h1 className="text-3xl md:text-5xl font-bold text-black-600 mb-4">
      COVID-19 Tracker & Forecast
    </h1>
    <p className="text-lg md:text-xl text-black-700 mb-6 max-w-xl">
      Explore real-time global data, country insights, and predictive trends.
    </p>
    <SearchForm
      country={country}
      province={province}
      setCountry={setCountry}
      setProvince={setProvince}
      handleSearch={handleSearch}
    />
  </div>

  {/* ✅ Move Compare Button Here */}
  <button
  onClick={() =>
    document
      .getElementById("compare-section")
      ?.scrollIntoView({ behavior: "smooth" })
  }
  className="hidden sm:block absolute bottom-4 right-4 z-30 bg-blue-500 text-gray-100 text-sm px-4 py-2 rounded-md-3xl rounded-3xl border border-gray-300 hover:bg-blue-650 transition-all shadow-sm hover:shadow-md backdrop-blur-sm"
>
  Compare Countries
</button>


</section>

  );
}
