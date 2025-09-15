import { Stack } from "expo-router";
import React from "react";
import HamburgerMenu from "../../components/ui/HamburgerMenu";

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => <HamburgerMenu />,
        }}
      />
      {/* ...other screens... */}
    </Stack>
  );
}
