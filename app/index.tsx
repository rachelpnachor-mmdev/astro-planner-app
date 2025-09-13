

import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../lib/authSession';

type GateHref = '/(tabs)' | '/sign-in';

export default function Index() {
  const [href, setHref] = useState<GateHref | null>(null);

  useEffect(() => {
    (async () => {
      const session = await getCurrentUser();
      setHref(session?.email ? '/(tabs)' : '/sign-in');
    })();
  }, []);

  if (!href) return null; // prevent flicker while checking session
  return <Redirect href={href} />;
}
