import { createTheme } from '@fluentui/react';
import globalStyles from '.';

const darkTheme = createTheme({
  defaultFontStyle: { fontFamily: globalStyles.fontFamily },
  palette: {
    themePrimary: '#106ebe',
    themeLighterAlt: '#010408',
    themeLighter: '#02111f',
    themeLight: '#052139',
    themeTertiary: '#094173',
    themeSecondary: '#0d60a8',
    themeDarkAlt: '#2279c6',
    themeDark: '#3e8bcf',
    themeDarker: '#6aa7db',
    neutralLighterAlt: '#302e2e',
    neutralLighter: '#383636',
    neutralLight: '#464444',
    neutralQuaternaryAlt: '#4e4c4c',
    neutralQuaternary: '#555353',
    neutralTertiaryAlt: '#727070',
    neutralTertiary: '#eaeaea',
    neutralSecondary: '#eeeeee',
    neutralPrimaryAlt: '#f1f1f1',
    neutralPrimary: '#e0e0e0',
    neutralDark: '#f8f8f8',
    black: '#fbfbfb',
    white: '#272626',
  },
});
export default darkTheme;
