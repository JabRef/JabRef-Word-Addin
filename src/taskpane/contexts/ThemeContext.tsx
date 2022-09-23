/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeProvider } from '@fluentui/react/lib/utilities/ThemeProvider/ThemeProvider';
import React, { createContext } from 'react';
import { Theme } from '../../../types/index';
import UserPreferences from '../../utils/UserPreferences';
import darkTheme from '../../theme/Dark';
import lightTheme from '../../theme/Light';

interface ThemeContextProps {
  children: React.ReactNode;
  initTheme: Theme;
}

interface ThemeContextInterface {
  theme: Theme;
  changeTheme: () => void;
}

const ThemeContext = createContext<ThemeContextInterface>(null);

const getTheme = (theme: Theme) => (theme === Theme.DARK ? darkTheme : lightTheme);

export function ThemeContextProvider({ children, initTheme }: ThemeContextProps): JSX.Element {
  const [theme, setThemeValue] = React.useState(initTheme);
  const changeTheme = () => {
    setThemeValue((prevVal) => {
      const newVal = prevVal === Theme.DARK ? Theme.LIGHT : Theme.DARK;
      UserPreferences.setTheme(newVal);
      UserPreferences.syncPreferences();
      return newVal;
    });
  };
  const value = { theme, changeTheme };
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
