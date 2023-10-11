import { useState } from "react";
import { ColorScheme, ColorSchemeProvider, MantineProvider, MantineThemeOverride } from "@mantine/core";
import { NotificationsProvider } from '@mantine/notifications';

import { getCookie, setCookie } from 'cookies-next'
import { THEME_COOKIE } from './configs/appsettings';
import { ModalsProvider } from "@mantine/modals";

export const theme: MantineThemeOverride = {
  colorScheme: "dark",
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {

  const colorscheme = getCookie(THEME_COOKIE);

  const [colorScheme, setColorScheme] = useState<any>(colorscheme as string);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie(THEME_COOKIE, nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: colorScheme, fontFamily: 'NeueMontrealBook,Arial,sans-serif' }}>
        <ModalsProvider>
          <NotificationsProvider>
            {children}
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
