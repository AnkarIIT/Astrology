// Advanced Vedic astrology using the `vedic-astro` engine (VSOP87/Meeus,
// arcminute-accurate sidereal positions with Lahiri ayanamsa) plus a full
// Vimshottari dasha (mahadasha + antardasha) computation and daily panchang.

import {
  getPlanetaryPositions,
  getPanchang,
  getMoonSign,
  getNakshatra,
  getKundali,
  signAndDegree,
  RASHIS,
  NAKSHATRAS,
  type PanchangResult,
} from "vedic-astro";

const YEAR_MS = 365.25 * 24 * 3600 * 1000;

export const PLANET_HI: Record<string, string> = {
  Sun: "सूर्य",
  Moon: "चंद्र",
  Mars: "मंगल",
  Mercury: "बुध",
  Jupiter: "गुरु",
  Venus: "शुक्र",
  Saturn: "शनि",
  Rahu: "राहु",
  Ketu: "केतु",
};

const DASHA_SEQUENCE = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

const DASHA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const GRAHA_ORDER = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

export interface Graha {
  name: string;
  hi: string;
  sign: number;
  signName: string;
  degree: number;
  retrograde: boolean;
}

export interface DashaPeriod {
  planet: string;
  hi: string;
  start: string;
  end: string;
  years: number;
}

export interface Vimshottari {
  current: DashaPeriod;
  currentSub: DashaPeriod | undefined;
  antardasha: DashaPeriod[];
  upcoming: DashaPeriod[];
}

export interface VedicKundli {
  sunRashi: number;
  moonRashi: number;
  lagnaRashi: number;
  nakshatra: number;
  nakshatraPada: number;
  nakshatraLord: string;
  ayanamsa: string;
  grahas: Graha[];
  houses: { house: number; sign: number; signName: string; planets: string[] }[];
  dasha: Vimshottari;
  panchang: PanchangResult;
  panchangDate: string;
  birthData: { date: string; time: string; lat: number; lon: number; tzOffsetMin: number };
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function tzOffsetString(min: number) {
  const sign = min < 0 ? "-" : "+";
  const abs = Math.abs(min);
  return `${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

export function toIsoWithOffset(date: string, time: string, tzOffsetMin: number) {
  const t = (time || "12:00").slice(0, 5);
  return `${date}T${t}${tzOffsetString(tzOffsetMin)}`;
}

export function computeVimshottari(moonLon: number, date: string, time: string): Vimshottari {
  const span = 360 / 27;
  const idx = Math.floor(moonLon / span) % 27;
  const currentLord = DASHA_SEQUENCE[idx % 9];
  const elapsedFrac = (moonLon - idx * span) / span;

  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time || "12:00").split(":").map(Number);
  const birth = new Date(Date.UTC(y, m - 1, d, hh, mm));

  const totalYears = DASHA_YEARS[currentLord];
  const mahadashaStart = new Date(birth.getTime() - totalYears * elapsedFrac * YEAR_MS);
  const mahadashaEnd = new Date(mahadashaStart.getTime() + totalYears * YEAR_MS);

  const current: DashaPeriod = {
    planet: currentLord,
    hi: PLANET_HI[currentLord],
    start: iso(mahadashaStart),
    end: iso(mahadashaEnd),
    years: totalYears,
  };

  const startIdx = DASHA_SEQUENCE.indexOf(currentLord);
  const antardasha: DashaPeriod[] = [];
  let cursor = mahadashaStart.getTime();
  for (let i = 0; i < 9; i++) {
    const sub = DASHA_SEQUENCE[(startIdx + i) % 9];
    const spanYears = (DASHA_YEARS[sub] / 120) * totalYears;
    antardasha.push({
      planet: sub,
      hi: PLANET_HI[sub],
      start: iso(new Date(cursor)),
      end: iso(new Date(cursor + spanYears * YEAR_MS)),
      years: spanYears,
    });
    cursor += spanYears * YEAR_MS;
  }

  const now = new Date().getTime();
  const currentSub = antardasha.find((a) => {
    const s = new Date(a.start).getTime();
    const e = new Date(a.end).getTime();
    return s <= now && now < e;
  });

  const upcoming: DashaPeriod[] = [];
  cursor = mahadashaEnd.getTime();
  for (let i = 1; i <= 9; i++) {
    const lord = DASHA_SEQUENCE[(startIdx + i) % 9];
    const yl = DASHA_YEARS[lord];
    upcoming.push({
      planet: lord,
      hi: PLANET_HI[lord],
      start: iso(new Date(cursor)),
      end: iso(new Date(cursor + yl * YEAR_MS)),
      years: yl,
    });
    cursor += yl * YEAR_MS;
  }

  return { current, currentSub, antardasha, upcoming: upcoming.slice(0, 6) };
}

export async function computeVedicKundli(input: {
  date: string;
  time: string;
  lat: number;
  lon: number;
  tzOffsetMin: number;
}): Promise<VedicKundli> {
  const { date, time, lat, lon, tzOffsetMin } = input;
  const location = { latitude: lat, longitude: lon };
  const positions = await getPlanetaryPositions(
    { iso: toIsoWithOffset(date, time, tzOffsetMin) },
    location
  );

  const moon = positions.positions.find((p) => p.name === "Moon");
  if (!moon) throw new Error("Moon position missing");

  const ms = getMoonSign(positions);
  const nak = getNakshatra(positions);
  const chart = getKundali(positions, { system: "whole-sign" });

  const sun = positions.positions.find((p) => p.name === "Sun");
  const grahas: Graha[] = positions.positions
    .filter((p) => GRAHA_ORDER.includes(p.name))
    .map((p) => {
      const sd = signAndDegree(p.longitude);
      return {
        name: p.name,
        hi: PLANET_HI[p.name] || p.name,
        sign: RASHIS.indexOf(sd.sign),
        signName: sd.sign,
        degree: sd.degree,
        retrograde: p.isRetrograde,
      };
    });

  const houses = chart.houses.map((h, i) => ({
    house: i + 1,
    sign: RASHIS.indexOf(h.sign),
    signName: h.sign,
    planets: h.planets,
  }));

  const nowIso = new Date().toISOString();
  const nowPositions = await getPlanetaryPositions({ iso: nowIso }, location);
  const panchang = getPanchang(nowPositions, location);

  return {
    sunRashi: sun ? Math.floor(sun.longitude / 30) % 12 : 0,
    moonRashi: RASHIS.indexOf(ms.rashi),
    lagnaRashi: RASHIS.indexOf(chart.ascendant),
    nakshatra: NAKSHATRAS.indexOf(nak.name),
    nakshatraPada: nak.pada,
    nakshatraLord: nak.lord,
    ayanamsa: positions.ayanamsha,
    grahas,
    houses,
    dasha: computeVimshottari(moon.longitude, date, time),
    panchang,
    panchangDate: nowIso.slice(0, 10),
    birthData: { date, time, lat, lon, tzOffsetMin },
  };
}
