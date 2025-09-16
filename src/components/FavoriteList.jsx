import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather, removeFavorite } from "../features/weather/weatherSlice";

function FavoritesList() {
  const favorites = useSelector((state) => state.weather.favorites);
  const dispatch = useDispatch();

  return (
    <div className="favorites">
      <h3>Favorites</h3>
      {favorites.length === 0 ? (
        <p>No favorites yet</p>
      ) : (
        <ul>
          {favorites.map((city) => (
            <li key={city}>
              <span onClick={() => dispatch(fetchWeather(city))}>
                {city}
              </span>
              <button onClick={() => dispatch(removeFavorite(city))}>
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoritesList;
