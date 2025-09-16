import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchWeather } from "../features/weather/weatherSlice";

export default function SearchBar() {
  const [city, setCity] = useState("");
  const dispatch = useDispatch();

  const doSearch = () => {
    if (!city.trim()) return;
    dispatch(fetchWeather(city.trim()));
    setCity("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") doSearch();
  };

  return (
    <div className="search-bar">
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Search city (e.g. Karachi)"
      />
      <button onClick={doSearch}>Search</button>
    </div>
  );
}
