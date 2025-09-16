import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite } from "../features/weather/weatherSlice";
import { degToCardinal, formatLocalTime, uvRisk } from "./weatherUtils";
import "./weatherDetail.css";

export default function WeatherDetails() {
  const dispatch = useDispatch();
  const { current, forecast, status, error } = useSelector((s) => s.weather);

  if (status === "loading") return <div className="loader">Loading…</div>;
  if (status === "failed") return <div className="error">Error: {error}</div>;
  if (!current || !forecast) return <div className="no-data">Search for a city to see details</div>;

  const w = current.weather[0];
  const main = current.main;
  const ocIcon = `https://openweathermap.org/img/wn/${w.icon}@4x.png`;

  const tz = current.timezone ?? 0; // offset in seconds
  const sunrise = current.sys?.sunrise;
  const sunset = current.sys?.sunset;
  const nowUnix = current.dt;
  const dayProgress =
    sunrise && sunset
      ? Math.max(0, Math.min(100, ((nowUnix - sunrise) / (sunset - sunrise)) * 100))
      : 0;

  const windDir = degToCardinal(current.wind?.deg ?? 0);
  const windDeg = current.wind?.deg ?? 0;

  // 🕒 Hourly = first 12 forecast entries (≈ next 36h)
  const hourly = forecast.list.slice(0, 12);

  // 📅 Daily = group forecast.list by day
  const daysMap = {};
  forecast.list.forEach((f) => {
    const day = formatLocalTime(f.dt, tz, { showDate: true }).split(" ")[0];
    if (!daysMap[day]) {
      daysMap[day] = { min: f.main.temp, max: f.main.temp, icon: f.weather[0].icon, pop: f.pop ?? null };
    } else {
      daysMap[day].min = Math.min(daysMap[day].min, f.main.temp);
      daysMap[day].max = Math.max(daysMap[day].max, f.main.temp);
    }
  });
  const daily = Object.entries(daysMap).slice(0, 7);

  return (
    <div className="weather-card">
      <header className="weather-top">
        <div className="loc">
          <h2>
            {current.name}, {current.sys?.country}
          </h2>
          <p className="localtime">
            Local: {formatLocalTime(current.dt, tz, { showDate: true })}
          </p>
        </div>

        <div className="icon-block">
          <img className="ow-icon" src={ocIcon} alt={w.description} />
          <div className="cond">
            <h3>{Math.round(main.temp)}°C</h3>
            <p>
              {w.main} — {w.description}
            </p>
            <p className="feels">Feels like {Math.round(main.feels_like)}°C</p>
          </div>
        </div>
      </header>

      <section className="metrics">
        <div className="metric">
          <div className="label">💧 Humidity</div>
          <div className="value">{main.humidity}%</div>
          <div className="bar">
            <div className="fill" style={{ width: `${main.humidity}%` }} />
          </div>
        </div>

        <div className="metric">
          <div className="label">🌬 Wind</div>
          <div className="value">
            {current.wind?.speed ?? 0} m/s • {windDir}
          </div>
          <div className="wind-visual">
            <div className="wind-arrow" style={{ transform: `rotate(${windDeg}deg)` }}>
              ➤
            </div>
          </div>
        </div>

        <div className="metric">
          <div className="label">☁ Clouds</div>
          <div className="value">{current.clouds?.all ?? 0}%</div>
        </div>

        <div className="metric">
          <div className="label">🌡 Pressure</div>
          <div className="value">{main.pressure} hPa</div>
        </div>

        <div className="metric">
          <div className="label">👁 Visibility</div>
          <div className="value">{(current.visibility ?? 0) / 1000} km</div>
        </div>

        <div className="metric">
          <div className="label">💧 Dew point</div>
          <div className="value">N/A (not in free API)</div>
        </div>

        <div className="metric">
          <div className="label">☀ Sunrise / 🌙 Sunset</div>
          <div className="value">
            {formatLocalTime(sunrise, tz)} · {formatLocalTime(sunset, tz)}
          </div>
          <div className="sun-bar">
            <div className="sun-fill" style={{ width: `${dayProgress}%` }} />
          </div>
        </div>

        <div className="metric uv">
          <div className="label">🔆 UV index</div>
          <div className={`uvi-badge low`}>N/A · Not in free API</div>
        </div>

        <div className="metric">
          <div className="label">🌧 Precip (last 1h)</div>
          <div className="value">N/A (only in paid API)</div>
        </div>
      </section>

      <section className="forecast">
        <h4>Hourly (next 36h)</h4>
        <div className="hourly-scroll">
          {hourly.map((h) => (
            <div className="hour-card" key={h.dt}>
              <div className="hour-time">{formatLocalTime(h.dt, tz)}</div>
              <img
                src={`https://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`}
                alt={h.weather[0].description}
              />
              <div className="hour-temp">{Math.round(h.main.temp)}°</div>
              <div className="hour-pop">
                {h.pop != null ? `${Math.round(h.pop * 100)}%` : "-"}
              </div>
            </div>
          ))}
        </div>

        <h4>Daily (7 days)</h4>
        <div className="daily-grid">
          {daily.map(([day, d]) => (
            <div className="day-card" key={day}>
              <div className="day-name">{day}</div>
              <img
                src={`https://openweathermap.org/img/wn/${d.icon}@2x.png`}
                alt=""
              />
              <div className="day-temp">
                {Math.round(d.max)}° / {Math.round(d.min)}°
              </div>
              <div className="day-pop">
                {d.pop != null ? `${Math.round(d.pop * 100)}%` : "-"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="card-footer">
        <button
          onClick={() => dispatch(addFavorite(current.name))}
          className="fav-btn"
        >
          ⭐ Add to favorites
        </button>
      </footer>
    </div>
  );
}
