import React from "react";
import SearchBar from "./components/SearchBar";
import WeatherDetails from "./components/WeatherDetail";
import "./App.css"; // your base styles
import FavoritesList from "./components/FavoriteList";

function App() {
  return (
    <div className="app-shell">
      <h1 className="app-title">🌦️ Weather Dashboard</h1>
      <SearchBar />
      <WeatherDetails />
      <FavoritesList/>
    </div>
  );
}

export default App;
