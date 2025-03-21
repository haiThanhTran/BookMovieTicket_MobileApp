import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";

const Terms = ({ route }) => {
  const { terms } = route.params;
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          {terms.title}
        </Text>
        {terms.content.map((item, index) => (
          <Text
            key={index}
            style={[styles.term, isDarkMode && styles.darkText]}
          >
            {item}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  term: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
  },
  darkText: {
    color: "#ffffff",
  },
});

export default Terms;
