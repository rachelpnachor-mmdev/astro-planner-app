// Quick script to check Rachel's profile data
import * as SecureStore from 'expo-secure-store';

async function checkRachelProfile() {
  try {
    const usersData = await SecureStore.getItemAsync('lunaria.users');
    if (!usersData) {
      console.log('No users found in storage');
      return;
    }

    const users = JSON.parse(usersData);
    console.log('Total users:', users.length);

    const rachel = users.find(u => u.email.toLowerCase() === 'rachelpnachor@gmail.com');
    if (!rachel) {
      console.log('Rachel not found in users database');
      return;
    }

    console.log('Rachel found:');
    console.log('- Email:', rachel.email);
    console.log('- Has profile:', !!rachel.profile);
    console.log('- Has birth profile:', !!rachel.profile?.birth);

    if (rachel.profile?.birth) {
      const birth = rachel.profile.birth;
      console.log('\nBirth Profile Data:');
      console.log('- Name:', birth.name);
      console.log('- Birth Date:', birth.birthDate || birth.date);
      console.log('- Birth Time:', birth.birthTime || birth.time);
      console.log('- Birth Place:', birth.birthplace || birth.place);
      console.log('- Timezone:', birth.timezone || birth.timeZone || birth.tz);

      // Check if there's any computed chart data
      if (birth.chart || birth.computed) {
        const chart = birth.chart || birth.computed;
        console.log('\nChart Data Found:');
        if (chart.points) {
          const ascendant = chart.points.find(p =>
            (p.point || p.body || '').toUpperCase() === 'ASC' ||
            (p.point || p.body || '').toUpperCase() === 'ASCENDANT'
          );
          if (ascendant) {
            console.log('- Ascendant longitude:', ascendant.ecliptic?.lonDeg);
            const signIndex = Math.floor((ascendant.ecliptic?.lonDeg || 0) / 30) % 12;
            const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
            console.log('- Ascendant sign:', signs[signIndex]);
          } else {
            console.log('- No Ascendant data found in chart');
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking profile:', error);
  }
}

export default checkRachelProfile;