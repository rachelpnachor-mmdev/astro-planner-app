const toNum = (v:any) => typeof v==='number' ? v : (typeof v==='string' ? parseFloat(v) : NaN);
const norm360 = (x:number) => ((x % 360) + 360) % 360;

export function normalizePointsToCanonical(rawPoints: any[]): any[] {
  return (rawPoints ?? []).map((p:any) => {
    // Handle FreeAstrologyAPI format (has fullDegree, normDegree, planet.en, zodiac_sign)
    if (p.fullDegree !== undefined && p.planet?.en) {
      const fullDegreeNum = toNum(p.fullDegree);
      const lonDeg = Number.isFinite(fullDegreeNum) ? norm360(fullDegreeNum) : 0;
      const normDegreeNum = toNum(p.normDegree);
      const degInSign = Number.isFinite(normDegreeNum) ? normDegreeNum : (lonDeg % 30);
      const signIndexAries0 = Math.floor(lonDeg / 30);

      return {
        point: p.planet.en,  // "Sun", "Moon", etc.
        body: p.planet.en,
        ecliptic: {
          lonDeg,
          degInSign,
          signIndexAries0,
          // Preserve original data from API
          fullDegree: p.fullDegree,
          normDegree: p.normDegree,
          isRetro: p.isRetro,
          zodiac_sign: p.zodiac_sign,  // Original sign name from API
          // Add API data for easy access (with safe defaults)
          apiSignName: typeof p.zodiac_sign === 'string' ? p.zodiac_sign : null,
          apiDegInSign: Number.isFinite(normDegreeNum) ? normDegreeNum : null
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
