import React, { useContext } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import AppRouter from "./navigations/Router";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import { CombinedLightTheme, CombinedDarkTheme } from "./assets/themes/Theme";

const Main = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const theme = isDarkMode ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppRouter />
    </PaperProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
};

export default App;
