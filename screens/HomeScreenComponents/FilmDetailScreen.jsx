import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native"; // Import ScrollView, Image
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import axios from "react-native-axios";
import { useRoute, useNavigation } from "@react-navigation/native"; // Import useNavigation
import { Card, Title, Button, Paragraph, Avatar } from "react-native-paper"; // Import Paragraph
import { getData } from "../../config/AsyncStorageConfig";
import { env } from "../../config/enviroment";
const BASE_URL = env.API_URL;

const renderShowtimeItem = ({ item, navigation }) => {
  const handleBookTicket = async () => {
    const userInfo = await getData("userInfo");
    if (userInfo) {
      navigation.navigate("Đặt Chỗ", { showtimeId: item._id, screenId: item.screenId._id });
    } else {
      navigation.navigate("ProfileStackNavigation");
    }
  };

  return (
    <Card style={styles.showtimeCard}>
      <Card.Content>
        <Title style={styles.showtimeCinemaName}>{item.screenId.cinemaId.name}</Title>
        <Paragraph style={styles.showtimeScreenName}>
          Phòng: {item.screenId.name} - {item.screenId.cinemaId.name}
        </Paragraph>
        <Text style={styles.showtimeTime}>
          Thời gian: {new Date(item.startTime).toLocaleTimeString()} -{" "}
          {new Date(item.endTime).toLocaleTimeString()}
        </Text>
        <Text style={styles.showtimePrice}>
          Giá vé thường: {item.price.standard} VNĐ
        </Text>
        <Button
          mode="contained"
          style={styles.bookButton}
          onPress={handleBookTicket}
        >
          Đặt vé
        </Button>
      </Card.Content>
    </Card>
  );
};

const SuatChieuRoute = React.memo(() => {
  // Component cho tab "Suất chiếu"
  const route = useRoute();
  const { movieId } = route.params;
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Gọi useNavigation ở SuatChieuRoute

  useEffect(() => {
    const fetchShowtimes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/showtime/movies/${movieId}/showtimes`
        );
        setShowtimes(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch suất chiếu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#ffc83d"
        style={styles.loadingTab}
      />
    );
  }

  return (
    <FlatList
      data={showtimes}
      renderItem={(props) => renderShowtimeItem({ ...props, navigation })}
      keyExtractor={(item) => item._id}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      contentContainerStyle={styles.showtimeListContainer}
      nestedScrollEnabled={true} // Thêm dòng này
    />
  );
});

const ThongTinRoute = React.memo(() => {
  const route = useRoute();
  const { movieId } = route.params; // Lấy movieId từ params

  const [detailFilm, setDetailFilm] = useState(null); // Dữ liệu phim
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mô tả mở rộng

  useEffect(() => {
    const fetchDetailFilm = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/movie/movie/${movieId}`);
        console.log("Phim hiện tại:", response.data);
        setDetailFilm(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch thông tin phim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailFilm();
  }, [movieId]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#ffc83d"
        style={styles.loadingTab}
      />
    );
  }

  if (!detailFilm) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin phim!</Text>
      </View>
    );
  }

  const description = detailFilm.description || "";
  const truncatedDescription = isExpanded
    ? description
    : description.slice(0, 200) + "...";

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderActorItem = ({ item }) => (
    <View style={styles.actorItemContainer}>
      <Avatar.Text
        size={40}
        label={item[0].toUpperCase()}
        style={styles.actorAvatar}
      />
      <Text style={styles.actorName}>{item}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.scene}>
      {/* Nội dung phim */}
      <Text style={styles.infoTitle}>Nội dung</Text>
      <Text style={styles.infoText}>{truncatedDescription}</Text>
      {description.length > 200 && (
        <TouchableOpacity
          onPress={handleToggleExpand}
          style={styles.seeMoreButton}
        >
          <Text style={styles.seeMoreButtonText}>
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Đạo diễn */}
      <View style={styles.directorContainer}>
        <Text style={styles.infoSubtitle}>Đạo diễn:</Text>
        <View style={styles.directorInfo}>
          <Avatar.Text
            size={48}
            label={
              detailFilm.director ? detailFilm.director[0].toUpperCase() : "?"
            }
            style={styles.directorAvatar}
          />
          <Text style={styles.directorName}>{detailFilm.director}</Text>
        </View>
      </View>

      {/* Danh sách diễn viên */}
      <View style={styles.actorsContainer}>
        <Text style={styles.infoSubtitle}>Diễn viên:</Text>
        <FlatList
          horizontal
          data={detailFilm.actors}
          renderItem={renderActorItem}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actorsListContainer}
        />
      </View>
    </ScrollView>
  );
});

const renderScene = ({ route }) => {
  switch (route.key) {
    case "suatchieu":
      return <SuatChieuRoute />;
    case "thongtin":
      return <ThongTinRoute />;
    default:
      return null;
  }
};

const initialLayout = { width: Dimensions.get("window").width };

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "#054E9B" }} // Stays the same - indicator color
    style={{ backgroundColor: "#054E9B", color: "#054E9B" }} // Changed to white
    renderLabel={({ route, color }) => (
      <Text style={{ color: "#054E9B", fontWeight: "400", margin: 8 }}>
        {" "}
        {/* Changed to #054E9B */}
        {route.title}
      </Text>
    )}
  />
);

const FilmDetailScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "suatchieu", title: "Suất chiếu" },
    { key: "thongtin", title: "Thông tin" },
  ]);

  return (
    <View style={styles.container}>
      {/* Bao bọc TabView trong View container */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
        lazy // Thêm dòng này
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Style cho View container bao ngoài
    flex: 1,
    backgroundColor: "#fff",
  },
  scene: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    // justifyContent: 'center', // Bỏ justifyContent và alignItems để nội dung tab "Thông tin" hiển thị top-left
    // alignItems: 'center',
  },
  loadingTab: {
    marginTop: "50%",
  },
  showtimeListContainer: {
    padding: 16,
  },
  showtimeCard: {
    marginBottom: 16,
    elevation: 2, // Thêm elevation cho Card suất chiếu
  },
  showtimeCinemaName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  showtimeScreenName: {
    fontSize: 14,
    color: "gray",
    marginBottom: 3,
  },
  showtimeTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff", // Màu xanh dương cho thời gian
    marginBottom: 8,
  },
  showtimePrice: {
    fontSize: 14,
    color: "#4CAF50", // Màu xanh lá cây cho giá vé
  },
  bookButton: {
    marginTop: 10,
  },
  infoSubtitle: {
    marginBottom: "20px",
  },
  directorContainer: {
    // Style cho container thông tin đạo diễn
    marginTop: 20,
    marginBottom: 20,
  },
  directorInfo: {
    // Style cho container avatar và tên đạo diễn (layout ngang)
    flexDirection: "row",
    alignItems: "center",
  },
  directorAvatar: {
    // Style cho avatar đạo diễn
    marginRight: 10,
    backgroundColor: "#ffc83d", // Màu nền avatar đạo diễn
  },
  directorName: {
    // Style cho tên đạo diễn
    fontSize: 16,
  },
  actorsContainer: {
    // Style cho container danh sách diễn viên
    marginTop: 15,
  },
  actorsListContainer: {
    // Style cho container FlatList diễn viên (layout ngang)
    paddingVertical: 10,
  },
  actorItemContainer: {
    // Style cho container mỗi item diễn viên (avatar và tên)
    marginRight: 15,
    alignItems: "center",
  },
  actorAvatar: {
    // Style cho avatar diễn viên
    backgroundColor: "#ddd", // Màu nền avatar diễn viên
  },
  actorName: {
    // Style cho tên diễn viên
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
  infoTitle: {
    // Style cho tiêu đề "Nội dung"
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  seeMoreButton: {
    // Style cho container nút "Xem thêm/Thu gọn"
    marginTop: 0,
  },
  seeMoreButtonText: {
    // Style cho text nút "Xem thêm/Thu gọn"
    color: "#007bff", // Màu xanh dương
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FilmDetailScreen;
