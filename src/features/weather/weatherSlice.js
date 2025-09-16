// src/features/weather/weatherSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = import.meta.env.VITE_WEATHER_KEY;

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city, { rejectWithValue }) => {
    try {
      // 1) Current weather
      const curRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!curRes.ok) {
        const err = await curRes.json().catch(() => ({}));
        return rejectWithValue(err.message || "City not found");
      }
      const current = await curRes.json();

      // 2) 5-day / 3-hour forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!forecastRes.ok) {
        const err = await forecastRes.json().catch(() => ({}));
        return rejectWithValue(err.message || "Forecast not available");
      }
      const forecast = await forecastRes.json();

      return { current, forecast };
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);


const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    current: null,    // response from /weather
    forecast: null,    // response from onecall (detailed)
    favorites: [],    // array of city names
    status: "idle",
    error: null,
  },
  reducers: {
    addFavorite: (state, action) => {
      if (!state.favorites.includes(action.payload)) state.favorites.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter((c) => c !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload.current;
        state.forecast = action.payload.forecast;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { addFavorite, removeFavorite } = weatherSlice.actions;
export default weatherSlice.reducer;
