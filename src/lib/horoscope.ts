// Gemini-powered horoscope generation with localStorage caching.
// Falls back gracefully when no API key is configured.

const CACHE_PREFIX = "horoscope:";

export function getGeminiKey(): string {
  const viaVite = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) || "";
  const viaDefine =
    typeof process !== "undefined"
      ? (process.env.GEMINI_API_KEY as string | undefined) || ""
      : "";
  return viaVite || viaDefine;
}

function periodKey(period: string, date = new Date()) {
  if (period === "daily") return date.toISOString().slice(0, 10);
  if (period === "weekly") {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = (d.getUTCDay() + 6) % 7;
    d.setUTCDate(d.getUTCDate() - day + 3);
    const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
    const firstDay = (firstThursday.getUTCDay() + 6) % 7;
    firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDay + 3);
    const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 86400000));
    return `${d.getUTCFullYear()}-W${week}`;
  }
  return date.toISOString().slice(0, 7);
}

function cacheKey(rashi: string, period: string, lang: string) {
  return `${CACHE_PREFIX}${rashi}:${period}:${lang}:${periodKey(period)}`;
}

export function getCachedHoroscope(rashi: string, period: string, lang: string): string | null {
  try {
    return localStorage.getItem(cacheKey(rashi, period, lang));
  } catch {
    return null;
  }
}

export function cacheHoroscope(rashi: string, period: string, lang: string, text: string) {
  try {
    localStorage.setItem(cacheKey(rashi, period, lang), text);
  } catch {
    // storage unavailable
  }
}

async function callGemini(prompt: string, key: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 700 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text || "")
    .join("");
  if (!text) throw new Error("Empty Gemini response");
  return text.trim();
}

export async function generateHoroscope(
  rashi: string,
  rashiHi: string,
  period: string,
  lang: string
): Promise<string | null> {
  const key = getGeminiKey();
  if (!key) return null;

  const cached = getCachedHoroscope(rashi, period, lang);
  if (cached) return cached;

  const periodWord = period === "daily" ? "daily" : period === "weekly" ? "weekly" : "monthly";
  const language = lang === "hi" ? "Hindi (in Devanagari script)" : "English";
  const prompt =
    `You are a skilled Vedic astrologer writing for ${rashi} (${rashiHi}). ` +
    `Write a ${periodWord} horoscope in ${language} of about 120-180 words. ` +
    `Give practical guidance covering career, love, health and finances. ` +
    `Keep it warm, positive and grounded. Do not add any headings or markdown.`;

  try {
    const text = await callGemini(prompt, key);
    cacheHoroscope(rashi, period, lang, text);
    return text;
  } catch (err) {
    console.error("Horoscope generation failed:", err);
    return null;
  }
}
