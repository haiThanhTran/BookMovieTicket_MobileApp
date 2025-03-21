import {
  MD3LightTheme as PaperLightTheme,
  MD3DarkTheme as PaperDarkTheme,
  configureFonts,
} from "react-native-paper";
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import merge from "deepmerge";
import fontConfig from "../fonts/FontConfig";

const CombinedLightTheme = {
  ...PaperLightTheme,
  ...NavigationLightTheme,
  colors: {
    ...PaperLightTheme.colors,
    ...NavigationLightTheme.colors,
    primary: "#FF6B00",
    accent: "#2196F3",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    text: "#000000",
    border: "#EEEEEE",
  },
  fonts: configureFonts({ config: fontConfig, isV3: true }),
};

const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: "#FF8533",
    accent: "#64B5F6",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#FFFFFF",
    border: "#333333",
    card: "#1E1E1E",
    notification: "#FF8533",
  },
  fonts: configureFonts({ config: fontConfig, isV3: true }),
  dark: true,
};

export { CombinedLightTheme, CombinedDarkTheme };
