import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, Image } from "react-native";
import { Appbar, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { env } from "../../config/enviroment";

const BASE_URL = env.API_URL;

const CinemaListScreen = () => {
  const [cinemas, setCinemas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu rạp phim từ API
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/cinemas/cinemas`);
        console.log("Dữ liệu rạp phim:", response.data);
        setCinemas(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCinemas();
  }, []);

  // Hàm render từng mục rạp phim
  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Image
        source={{ uri: item.image || "https://static.vecteezy.com/system/resources/previews/003/065/406/non_2x/flat-design-concept-cinema-icon-free-vector.jpg" }} // Thay bằng URL ảnh từ API nếu có
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.address}</Text>
        <Text style={styles.phone}>{item.phone || "1900 2224"}</Text> 
      </View>
    </View>
  );

  // Hiển thị khi đang tải
  if (isLoading) {
    return <ActivityIndicator animating={true} size="large" style={styles.center} />;
  }

  // Hiển thị lỗi nếu có


  // Giao diện chính
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content
          title="Rạp phim"
          subtitle="Toàn quốc"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>
      <FlatList
        data={cinemas}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

// Định nghĩa styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appbar: {
    backgroundColor: "#fff",
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  appbarTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  listItem: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#000",
    marginTop: 2,
  },
  phone: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CinemaListScreen;