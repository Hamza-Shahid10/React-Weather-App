// src/utils/weatherUtils.js
export function degToCardinal(deg) {
  // 16-point compass
  const points = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const idx = Math.round(deg / 22.5) % 16;
  return points[idx];
}

export function formatLocalTime(unixUTC, tzOffsetSeconds, opts = { showDate: false }) {
  // unixUTC: dt (UTC seconds), tzOffsetSeconds: timezone shift in seconds from API
  // We create a UTC Date for (dt + tzOffset) and then read UTC hours/mins — this yields the local wall-clock time.
  const d = new Date((unixUTC + (tzOffsetSeconds || 0)) * 1000);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  if (opts.showDate) {
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
    return `${dd}/${mo} ${hh}:${mm}`;
  }
  return `${hh}:${mm}`;
}

export function uvRisk(uvi) {
  if (uvi == null) return { label: "N/A", level: "unknown" };
  if (uvi < 3) return { label: "Low", level: "low" };
  if (uvi < 6) return { label: "Moderate", level: "moderate" };
  if (uvi < 8) return { label: "High", level: "high" };
  if (uvi < 11) return { label: "Very High", level: "very-high" };
  return { label: "Extreme", level: "extreme" };
}
