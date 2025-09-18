// scripts/verifyAscendant.js - Verify Ascendant calculation for Rachel's profile
import * as SecureStore from 'expo-secure-store';

const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

async function verifyRachelAscendant() {
  console.log('=== ASCENDANT VERIFICATION FOR RACHEL ===');

  try {
    // 1. Load user data from SecureStore
    const usersData = await SecureStore.getItemAsync('lunaria.users');
    if (!usersData) {
      console.log('❌ No users found in SecureStore');
      return;
    }

    const users = JSON.parse(usersData);
    console.log('✅ Found', users.length, 'users in storage');

    // 2. Find Rachel's profile
    const rachel = users.find(u => u.email.toLowerCase() === 'rachelpnachor@gmail.com');
    if (!rachel) {
      console.log('❌ Rachel not found in users database');
      return;
    }

    console.log('✅ Rachel found in database');
    console.log('- Email:', rachel.email);
    console.log('- Has profile:', !!rachel.profile);
    console.log('- Has birth profile:', !!rachel.profile?.birth);

    // 3. Check birth profile data
    const birth = rachel.profile?.birth;
    if (!birth) {
      console.log('❌ No birth profile data found');
      return;
    }

    console.log('\n📋 BIRTH PROFILE DATA:');
    console.log('- Name:', birth.name);
    console.log('- Birth Date:', birth.birthDate || birth.date);
    console.log('- Birth Time:', birth.birthTime || birth.time);
    console.log('- Birth Place:', birth.birthplace || birth.place);
    console.log('- Timezone:', birth.timezone || birth.timeZone || birth.tz);

    // 4. Check for computed chart data
    const chart = birth.chart || birth.computed;
    if (!chart || !chart.points) {
      console.log('❌ No computed chart data found');
      return;
    }

    console.log('✅ Chart data found with', chart.points.length, 'points');

    // 5. Find Ascendant data
    const ascendant = chart.points.find(p => {
      const pointName = (p.point || p.body || '').toUpperCase();
      return pointName === 'ASC' || pointName === 'ASCENDANT';
    });

    if (!ascendant) {
      console.log('❌ No Ascendant point found in chart data');
      console.log('Available points:', chart.points.map(p => p.point || p.body).join(', '));
      return;
    }

    console.log('\n🌅 ASCENDANT DATA:');
    console.log('- Point name:', ascendant.point || ascendant.body);
    console.log('- Raw data:', JSON.stringify(ascendant, null, 2));

    // 6. Calculate sign from longitude
    const lonDeg = Number(ascendant.ecliptic?.lonDeg);
    if (!Number.isFinite(lonDeg)) {
      console.log('❌ Invalid longitude data:', ascendant.ecliptic?.lonDeg);
      return;
    }

    const signIndex = Math.floor(lonDeg / 30) % 12;
    const signName = SIGNS[signIndex];
    const degInSign = ((lonDeg % 30) + 30) % 30;

    console.log('\n🔍 CALCULATION RESULTS:');
    console.log('- Longitude:', lonDeg, '°');
    console.log('- Sign Index:', signIndex);
    console.log('- Sign Name:', signName);
    console.log('- Degrees in Sign:', degInSign.toFixed(2), '°');
    console.log('- Full Position:', signName, degInSign.toFixed(2) + '°');

    // 7. Verify this matches what the UI shows
    console.log('\n✅ VERIFICATION:');
    console.log('- Expected Sign: Aquarius');
    console.log('- Calculated Sign:', signName);
    console.log('- Match:', signName === 'Aquarius' ? '✅ YES' : '❌ NO');

    // 8. Show chart computation timestamp
    if (chart.computedAt) {
      const computedDate = new Date(chart.computedAt);
      console.log('- Chart computed at:', computedDate.toLocaleString());
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

export default verifyRachelAscendant;