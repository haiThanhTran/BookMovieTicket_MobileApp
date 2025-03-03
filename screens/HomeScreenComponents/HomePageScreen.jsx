import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Text, Card, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import axios from 'axios';
import { useSharedValue } from "react-native-reanimated";
import {env} from "../../config/enviroment";
const BASE_URL = env.API_URL;
const width = Dimensions.get("window").width;
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

const HomePageScreen = () => {
  const progress = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const [bannerImages, setBannerImages] = useState([
    "https://cdn.galaxycine.vn/media/2025/2/4/2048x682_1738637689353.jpg",
    "https://cdn.galaxycine.vn/media/2025/2/10/captambravenewworld-2048_1739183619915.jpg",
    "https://cdn.galaxycine.vn/media/2025/2/7/bo-tu-bao-thu-2048_1738898902037.jpg",
    "https://cdn.galaxycine.vn/media/2025/2/5/den-am-hon-2048_1738748436601.jpg",
    "https://cdn.galaxycine.vn/media/2025/2/11/nu-hon-bac-ty-san-ve-anh-trai-3_1739256207928.jpg",
    "https://cdn.galaxycine.vn/media/2025/2/13/rec-rec-3_1739415358816.jpg",
    "https://cdn.galaxycine.vn/media/2025/1/22/sua-bap-non-1_1737541223428.jpg",
    "https://cdn.galaxycine.vn/media/2024/12/31/samsung--2_1735640530505.jpg",
    "https://cdn.galaxycine.vn/media/2025/2/3/shopee-pay-2_1738565481057.jpg",
  ]);
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState("current");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const currentMoviesResponse = await axios.get(
          `${BASE_URL}/movie/movie/current`
        );
        const upcomingMoviesResponse = await axios.get(
          `${BASE_URL}/movie/movie/upcomingmovies`
        );

        setNowShowingMovies(currentMoviesResponse.data);
        setComingSoonMovies(upcomingMoviesResponse.data);
        console.log("Dữ liệu phim:", currentMoviesResponse.data);
        console.log("Dữ liệu phim:", upcomingMoviesResponse.data);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu phim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Auto-slide banner
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderMovieGrid = () => {
    const movies =
      selectedTab === "current" ? nowShowingMovies : comingSoonMovies;
    const rows = [];

    for (let i = 0; i < movies.length; i += 2) {
      const row = (
        <View key={i} style={styles.row}>
          <MovieCard movie={movies[i]} />
          {movies[i + 1] && <MovieCard movie={movies[i + 1]} />}
        </View>
      );
      rows.push(row);
    }

    return rows;
  };

  const MovieCard = ({ movie }) => (
    <View style={styles.movieCardContainer}>
      <Card
        style={styles.movieCard}
        onPress={() =>
          navigation.navigate("FilmDetailScreen", { movieId: movie._id })
        }
      >
        <View style={styles.imageContainer}>
          <Card.Cover
            source={{ uri: movie?.image }}
            style={styles.moviePoster}
          />
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>9.1</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>T13</Text>
          </View>
        </View>
        <Card.Content style={styles.movieCardContent}>
          <Title style={styles.movieTitle} numberOfLines={1}>
            {movie?.title}
          </Title>
        </Card.Content>
      </Card>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ffc83d" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Banner Slider */}
      <View>
        <Carousel
          width={width}
          height={width / 2}
          data={bannerImages}
          onProgressChange={(_, progressValue) => {
            progress.value = progressValue;
            setActiveIndex(Math.round(progressValue));
          }}
          mode="parallax"
          autoPlay
          autoPlayInterval={2000}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          )}
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 40,
          }}
        />

        {/* <Pagination.Basic
          progress={progress}
          length={bannerImages.length}
          dotStyle={styles.paginationDot}
          containerStyle={styles.paginationContainer}
        /> */}
      </View>

      {/* Custom Tab Bar */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "current" && styles.activeTab]}
            onPress={() => setSelectedTab("current")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "current" && styles.activeTabText,
              ]}
            >
              Đang chiếu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "upcoming" && styles.activeTab]}
            onPress={() => setSelectedTab("upcoming")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "upcoming" && styles.activeTabText,
              ]}
            >
              Sắp chiếu
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Movie Grid */}
      <View style={styles.movieGrid}>{renderMovieGrid()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  bannerContainer: {
    height: 200,
    position: "relative",
  },
  bannerImage: {
    height: 200,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  tabContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 2,
  },
  tab: {
    marginHorizontal: 15,
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#054E9B",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#054E9B",
    fontWeight: "bold",
  },
  movieGrid: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  movieCardContainer: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  movieCard: {
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
  },
  moviePoster: {
    height: CARD_WIDTH * 1.5,
    borderRadius: 8,
  },
  ratingContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 193, 7, 0.9)",
    borderRadius: 4,
    padding: 4,
  },
  ratingText: {
    color: "white",
    fontWeight: "bold",
  },
  dateContainer: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(255, 87, 34, 0.9)",
    borderRadius: 4,
    padding: 4,
  },
  dateText: {
    color: "white",
    fontWeight: "bold",
  },
  movieCardContent: {
    padding: 8,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default HomePageScreen;
