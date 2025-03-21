import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";

const CompanyInfo = ({ route }) => {
  const { companyInfo } = route.params;
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          {companyInfo.name}
        </Text>
        <Text style={[styles.info, isDarkMode && styles.darkText]}>
          Địa chỉ: {companyInfo.address}
        </Text>
        <Text style={[styles.info, isDarkMode && styles.darkText]}>
          Điện thoại: {companyInfo.phone}
        </Text>
        <Text style={[styles.info, isDarkMode && styles.darkText]}>
          Email: {companyInfo.email}
        </Text>
        <Text style={[styles.info, isDarkMode && styles.darkText]}>
          Website: {companyInfo.website}
        </Text>
        <Text style={[styles.info, isDarkMode && styles.darkText]}>
          {companyInfo.businessLicense}
        </Text>
        <Text style={[styles.info, isDarkMode && styles.darkText]}>
          {companyInfo.issuedBy}
        </Text>
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
  info: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  darkText: {
    color: "#ffffff",
  },
});

export default CompanyInfo;
