import {
    MD3LightTheme as PaperLightTheme,
    MD3DarkTheme as PaperDarkTheme,
    configureFonts,
  } from 'react-native-paper';
  import {
    DefaultTheme as NavigationLightTheme,
    DarkTheme as NavigationDarkTheme,
  } from '@react-navigation/native';
  import merge from 'deepmerge';
  import fontConfig from '../fonts/FontConfig';
  
  const CombinedLightTheme = {
    ...merge(PaperLightTheme, NavigationLightTheme),
    fonts: configureFonts({ config: fontConfig, isV3: true }),
  };
  
  const CombinedDarkTheme = {
    ...merge(PaperDarkTheme, NavigationDarkTheme),
    fonts: configureFonts({ config: fontConfig, isV3: true }),
  };
  
  export { CombinedLightTheme, CombinedDarkTheme };
  