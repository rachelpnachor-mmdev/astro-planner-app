// test-normalization.js - Test our data normalization
// Run with: node test-normalization.js

// Import the normalization function (we'll simulate it)
const toNum = (v) => typeof v==='number' ? v : (typeof v==='string' ? parseFloat(v) : NaN);
const norm360 = (x) => ((x % 360) + 360) % 360;

function normalizePointsToCanonical(rawPoints) {
  return (rawPoints ?? []).map((p) => {
    // Handle FreeAstrologyAPI format (has fullDegree, normDegree, planet.en, zodiac_sign)
    if (p.fullDegree !== undefined && p.planet?.en) {
      const lonDeg = norm360(toNum(p.fullDegree));
      const degInSign = toNum(p.normDegree) ?? (lonDeg % 30);
      const signIndexAries0 = Math.floor(lonDeg / 30);

      return {
        point: p.planet.en,  // "Sun", "Moon", etc.
        body: p.planet.en,
        ecliptic: {
          lonDeg,
          degInSign,
          signIndexAries0,
          // Preserve original data
          fullDegree: p.fullDegree,
          normDegree: p.normDegree,
          isRetro: p.isRetro,
          zodiac_sign: p.zodiac_sign
        }
      };
    }

    // Handle other formats (existing logic)
    const e = p?.ecliptic ?? p?.ecl ?? {};
    // Prefer absolute longitude
    let lonDeg =
      toNum(e?.lonDeg) ??
      toNum(e?.longitude?.deg) ?? toNum(e?.lon?.deg) ??
      toNum(e?.longitude) ?? toNum(e?.lon);
    if (!Number.isFinite(lonDeg)) {
      const si = toNum(e?.signIndex ?? e?.sign ?? e?.sign_id);
      const di = toNum(e?.degree ?? e?.deg ?? e?.degrees);
      if (Number.isFinite(si) && Number.isFinite(di)) lonDeg = si*30 + di;
    }
    lonDeg = Number.isFinite(lonDeg) ? norm360(lonDeg) : NaN;

    const degInSign = Number.isFinite(lonDeg) ? (lonDeg % 30) : toNum(e?.degInSign);
    const signIndexAries0 = Number.isFinite(lonDeg) ? Math.floor(lonDeg/30) : toNum(e?.signIndexAries0);

    return { ...p, ecliptic: { ...e, lonDeg, degInSign, signIndexAries0 } };
  });
}

// Sample FreeAstrologyAPI data from our test
const sampleApiData = [
  {
    "planet": { "en": "Sun" },
    "fullDegree": 60.6660012856823,
    "normDegree": 0.6660012856822988,
    "isRetro": "False",
    "zodiac_sign": { "number": 3, "name": { "en": "Gemini" } }
  },
  {
    "planet": { "en": "Moon" },
    "fullDegree": 324.42936815794417,
    "normDegree": 24.429368157944168,
    "isRetro": "False",
    "zodiac_sign": { "number": 11, "name": { "en": "Aquarius" } }
  },
  {
    "planet": { "en": "Ascendant" },
    "fullDegree": 169.9757473235387,
    "normDegree": 19.975747323538712,
    "isRetro": "False",
    "zodiac_sign": { "number": 6, "name": { "en": "Virgo" } }
  }
];

console.log('🧪 Testing normalization...');
console.log('📥 Sample API data:', sampleApiData.length, 'points');

const normalized = normalizePointsToCanonical(sampleApiData);

console.log('📤 Normalized data:');
normalized.forEach((point, i) => {
  console.log(`${i + 1}. ${point.point}:`);
  console.log(`   lonDeg: ${point.ecliptic.lonDeg}°`);
  console.log(`   degInSign: ${point.ecliptic.degInSign}°`);
  console.log(`   signIndex: ${point.ecliptic.signIndexAries0} (${['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][point.ecliptic.signIndexAries0]})`);
  console.log(`   isRetro: ${point.ecliptic.isRetro}`);
  console.log('');
});

// Verify the Sun position matches expected
const sun = normalized.find(p => p.point === 'Sun');
if (sun) {
  const expectedSign = 'Gemini'; // Should be Gemini based on API response
  const actualSignIndex = sun.ecliptic.signIndexAries0;
  const actualSign = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][actualSignIndex];

  console.log('☉ Sun Verification:');
  console.log(`   Expected: ${expectedSign}`);
  console.log(`   Actual: ${actualSign}`);
  console.log(`   ✅ ${actualSign === expectedSign ? 'PASS' : 'FAIL'}`);
}