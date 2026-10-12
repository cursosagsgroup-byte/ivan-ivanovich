'use client';

import { createContext, useContext } from 'react';

export type SiteTheme = 'light' | 'dark';
const SiteThemeContext = createContext<SiteTheme>('light');

export function SiteThemeProvider({ theme, children }: { theme: SiteTheme; children: React.ReactNode }) {
    return <SiteThemeContext.Provider value={theme}>{children}</SiteThemeContext.Provider>;
}

export function useSiteTheme() {
    return useContext(SiteThemeContext);
}
