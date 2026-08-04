// Compact Vedic astrology calculations based on Jean Meeus' algorithms.
// Accuracy is sufficient for rashi/nakshatra/lagna determination.

export const RASHI_NAMES = {
  en: [
    "Mesh (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
    "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)",
  ],
  hi: [
    "मेष", "वृषभ", "मिथुन", "कर्क",
    "सिंह", "कन्या", "तुला", "वृश्चिक",
    "धनु", "मकर", "कुंभ", "मीन",
  ],
};

export const NAKSHATRA_NAMES = {
  en: [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
  ],
  hi: [
    "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा",
    "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्व फाल्गुनी", "उत्तर फाल्गुनी",
    "हस्त", "चित्रा", "स्वाति", "विशाखा", "अनुराधा", "ज्येष्ठा",
    "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा",
    "पूर्व भाद्रपद", "उत्तर भाद्रपद", "रेवती",
  ],
};

// Major Indian cities for quick place selection (lat, lon, tz offset minutes)
export const CITIES: Record<string, [number, number, number]> = {
  "Delhi": [28.61, 77.2, 330],
  "Mumbai": [19.07, 72.87, 330],
  "Kolkata": [22.57, 88.36, 330],
  "Chennai": [13.08, 80.27, 330],
  "Bengaluru": [12.97, 77.59, 330],
  "Hyderabad": [17.38, 78.48, 330],
  "Jaipur": [26.91, 75.78, 330],
  "Lucknow": [26.85, 80.94, 330],
  "Varanasi": [25.31, 83.01, 330],
  "Patna": [25.59, 85.13, 330],
  "Ahmedabad": [23.02, 72.57, 330],
  "Pune": [18.52, 73.85, 330],
  "London": [51.5, -0.12, 60],
  "New York": [40.71, -74.0, -240],
  "Los Angeles": [34.05, -118.24, -420],
  "Toronto": [43.65, -79.38, -240],
  "Sydney": [-33.87, 151.2, 600],
  "Singapore": [1.35, 103.82, 480],
  "Dubai": [25.2, 55.27, 240],
};

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

function fixAngle(deg: number) {
  return ((deg % 360) + 360) % 360;
}

function toJulianDay(year: number, month: number, day: number, hourUtc: number) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524.5 +
    hourUtc / 24
  );
}

// Solar longitude (Meeus)
function sunLongitude(T: number) {
  const L0 = fixAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = fixAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * D2R) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * D2R) +
    0.000289 * Math.sin(3 * M * D2R);
  const omega = fixAngle(125.04 - 1934.136 * T);
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega * D2R);
  return fixAngle(lambda);
}

// Lunar longitude (Meeus, principal periodic terms)
function moonLongitude(T: number) {
  const Lp = fixAngle(
    218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T ** 3 / 538841 - T ** 4 / 65194000
  );
  const D = fixAngle(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T ** 3 / 545868 - T ** 4 / 113065000);
  const M = fixAngle(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T ** 3 / 24490000);
  const Mp = fixAngle(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T ** 3 / 69699 - T ** 4 / 14712000);
  const F = fixAngle(93.272095 + 483202.0175233 * T - 0.0036539 * T * T - T ** 3 / 3526000 + T ** 4 / 863310000);
  const A1 = fixAngle(119.75 + 131.849 * T);
  const A2 = fixAngle(53.09 + 479264.29 * T);
  const A3 = fixAngle(313.45 + 481266.484 * T);

  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const s = Math.sin;

  let d = 0;
  // Principal terms of the moon's longitude
  const terms: [number, number, number, number][] = [
    [6288774, 0, 0, 1],
    [1274027, 2, 0, -1],
    [658314, 2, 0, 0],
    [213618, 0, 0, 2],
    [-185116, 0, 1, 0],
    [-114332, 0, 0, 0],
    [58793, 2, 0, -2],
    [57066, 2, -1, 0],
    [53322, 2, 0, 1],
    [45758, 2, -1, -1],
    [-40923, 0, 1, -1],
    [-34720, 1, 0, 0],
    [-30383, 0, 1, 1],
    [15327, 2, -1, 1],
    [-12528, 0, 0, 1],
    [10980, 0, 0, 3],
    [10675, 2, 0, -3],
    [10034, 2, -2, 0],
    [8548, 2, 0, -1],
    [-7888, 2, -2, -1],
    [-6766, 2, 0, 2],
    [-5163, 2, 0, -3],
    [4987, 2, -1, -2],
    [4036, 2, 0, 1],
    [3994, 0, 1, 2],
    [3861, 2, -2, 1],
    [3665, 0, 0, 2],
    [-2689, 2, -1, 0],
    [-2602, 2, 0, 3],
  ];
  for (const [c, dCoeff, mCoeff, mpCoeff] of terms) {
    const e = Math.abs(mCoeff) === 1 ? E : mCoeff === 2 ? E * E : 1;
    const arg = (dCoeff * D + mCoeff * M + mpCoeff * Mp) * D2R;
    d += c * e * s(arg);
  }
  const additive =
    3958 * s(A1 * D2R) + 1962 * s((Lp - F) * D2R) + 318 * s(A2 * D2R);
  return fixAngle(Lp + (d + additive) / 1000000);
}

// Greenwhich mean sidereal time in degrees
function gmst(jd: number) {
  const T = (jd - 2451545.0) / 36525;
  return fixAngle(
    280.46061837 +
      360.98564736629 * (jd - 2451545.0) +
      0.000387933 * T * T -
      T ** 3 / 38710000
  );
}

function ascendant(ramc: number, lat: number, e: number) {
  const tanLat = Math.tan(lat * D2R);
  const asc = Math.atan2(
    Math.cos(ramc * D2R),
    -(Math.sin(ramc * D2R) * Math.cos(e * D2R) + tanLat * Math.sin(e * D2R))
  );
  return fixAngle(asc * R2D);
}

export interface KundliResult {
  sunRashi: number;
  moonRashi: number;
  lagnaRashi: number;
  nakshatra: number;
  ayanamsa: number;
  sunLongitudeTropical: number;
  moonLongitudeTropical: number;
}

export function calculateKundli(input: {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  lat: number;
  lon: number;
  tzOffsetMin: number; // e.g. 330 for IST
}): KundliResult {
  const [y, m, d] = input.date.split("-").map(Number);
  const [hh, mm] = input.time.split(":").map(Number);
  const localMinutes = hh * 60 + mm;
  const utcMinutes = localMinutes - input.tzOffsetMin;
  const hourUtc = utcMinutes / 60;

  const jd = toJulianDay(y, m, d, hourUtc);
  const T = (jd - 2451545.0) / 36525;

  const sunTrop = sunLongitude(T);
  const moonTrop = moonLongitude(T);

  // Lahiri ayanamsa (approx): 22.4600 + 0.01396 * (year - 1900)
  const ayanamsa = 22.46 + 0.01396 * (y - 1900);

  const sunSid = fixAngle(sunTrop - ayanamsa);
  const moonSid = fixAngle(moonTrop - ayanamsa);

  // Ascendant
  const st = gmst(jd) + input.lon; // local sidereal time (longitude east)
  const ramc = fixAngle(st);
  const e = 23.439291 - 0.0000004 * T * 36525;
  const asc = ascendant(ramc, input.lat, e);
  const ascSid = fixAngle(asc - ayanamsa);

  return {
    sunRashi: Math.floor(sunSid / 30),
    moonRashi: Math.floor(moonSid / 30),
    lagnaRashi: Math.floor(ascSid / 30),
    nakshatra: Math.floor(moonSid / (360 / 27)) % 27,
    ayanamsa,
    sunLongitudeTropical: sunTrop,
    moonLongitudeTropical: moonTrop,
  };
}
