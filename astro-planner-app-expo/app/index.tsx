import React from 'react';
import BottomTabs from '../navigation/BottomTabs';
import { EntitlementProvider } from '../context/EntitlementContext';

export default function App() {
  return (
    <EntitlementProvider>
      <BottomTabs />
    </EntitlementProvider>
  );
}
