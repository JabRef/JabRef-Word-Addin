/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeProvider } from '@fluentui/react/lib/utilities/ThemeProvider/ThemeProvider';
import React, { createContext } from 'react';
import { Theme } from '../../../types';
import darkTheme from '../styles/themes/dark';
import lightTheme from '../styles/themes/light';

interface ThemeContextProps {
  children: React.ReactNode;
  initTheme: Theme;
}

interface ThemeContextInterface {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = createContext<ThemeContextInterface>(null);

const getTheme = (theme: Theme) => (theme === Theme.DARK ? darkTheme : lightTheme);

export function ThemeContextProvider({ children, initTheme }: ThemeContextProps): JSX.Element {
  const [theme, setTheme] = React.useState(initTheme);
  const value = { theme, setTheme };
  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={getTheme(theme)}>{children} </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextInterface => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error(
      'useTheme must be used within a ThemeContextProvider. Wrap a parent component in <ThemeContextProvider> to fix this error.'
    );
  }
  return context;
};

export default ThemeContext;
