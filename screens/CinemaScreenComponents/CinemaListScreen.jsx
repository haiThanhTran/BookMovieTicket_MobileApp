import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { Appbar, ActivityIndicator, Button } from "react-native-paper";
import Modal from "react-native-modal";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { env } from "../../config/enviroment";

const BASE_URL = env.API_URL;

// Thêm object chứa tọa độ các rạp
const CINEMA_COORDINATES = {
  "CGV Vincom Bà Triệu": {
    latitude: 21.0119444,
    longitude: 105.8494444,
    address: "Tầng 6, Vincom Center Bà Triệu, 191 Bà Triệu, Hà Nội",
  },
  "Galaxy Mipec Long Biên": {
    latitude: 21.0419,
    longitude: 105.8862,
    address: "Tầng 5, TTTM Mipec Long Biên, Số 2, Long Biên, Hà Nội",
  },
  "CGV Aeon Mall Hà Đông": {
    latitude: 20.9847,
    longitude: 105.752,
    address: "Tầng 4, TTTM Aeon Mall Hà Đông, Dương Nội, Hà Đông, Hà Nội",
  },
  // Thêm các rạp khác tương tự
};

const CinemaListScreen = () => {
  const [cinemas, setCinemas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Fetch cinemas data
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/cinemas/cinemas`);
        const cinemasWithCoordinates = response.data.map((cinema) => ({
          ...cinema,
          coordinates: CINEMA_COORDINATES[cinema.name] || {
            // Fallback coordinates nếu không tìm thấy rạp trong danh sách
            latitude: 21.0245, // Tọa độ mặc định (có thể đặt ở trung tâm Hà Nội)
            longitude: 105.8412,
          },
          address: CINEMA_COORDINATES[cinema.name]?.address || cinema.address,
        }));
        setCinemas(cinemasWithCoordinates);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCinemas();
  }, []);

  const handleCinemaPress = (cinema) => {
    setSelectedCinema(cinema);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCinema(null);
  };

  const openGoogleMaps = () => {
    if (selectedCinema) {
      const { coordinates, address } = selectedCinema;
      const query = encodeURIComponent(address);
      const url = Platform.select({
        ios: `maps://app?q=${query}&ll=${coordinates.latitude},${coordinates.longitude}`,
        android: `google.navigation:q=${coordinates.latitude},${coordinates.longitude}`,
      });
      Linking.openURL(url).catch((err) =>
        console.error("Không thể mở Google Maps:", err)
      );
    }
  };

  const handleCallCinema = () => {
    if (selectedCinema?.phone) {
      Linking.openURL(`tel:${selectedCinema.phone}`);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleCinemaPress(item)}
    >
      <Image
        source={{
          uri:
            item.image ||
            "https://static.vecteezy.com/system/resources/previews/003/065/406/non_2x/flat-design-concept-cinema-icon-free-vector.jpg",
        }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.address}</Text>
        <Text style={styles.phone}>{item.phone || "1900 2224"}</Text>
      </View>
    </TouchableOpacity>
  );

  const CinemaModal = () => (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={handleCloseModal}
      onBackButtonPress={handleCloseModal}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{selectedCinema?.name}</Text>
          <TouchableOpacity onPress={handleCloseModal}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Map View */}
        <View style={styles.mapContainer}>
          {selectedCinema && (
            <MapView
              style={styles.map}
              initialRegion={{
                ...selectedCinema.coordinates,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              zoomEnabled={true}
              zoomControlEnabled={true}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              <Marker
                coordinate={selectedCinema.coordinates}
                title={selectedCinema.name}
                description={selectedCinema.address}
                pinColor="#FF6B00"
              />
            </MapView>
          )}
        </View>

        {/* Cinema Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Thông tin rạp</Text>
          <Text style={styles.detailsText}>{selectedCinema?.address}</Text>
          <Text style={styles.detailsText}>
            Điện thoại: {selectedCinema?.phone}
          </Text>

          {/* Facilities */}
          <View style={styles.facilitiesContainer}>
            <Text style={styles.facilitiesTitle}>Tiện ích</Text>
            <View style={styles.facilitiesList}>
              <Text style={styles.facilityItem}>✓ Bãi đỗ xe</Text>
              <Text style={styles.facilityItem}>✓ Wifi miễn phí</Text>
              <Text style={styles.facilityItem}>✓ Căn tin</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={openGoogleMaps}
              style={[styles.actionButton, styles.directionsButton]}
            >
              Chỉ đường
            </Button>
            <Button
              mode="outlined"
              onPress={handleCallCinema}
              style={[styles.actionButton, styles.callButton]}
            >
              Gọi điện
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.center} />
    );
  }

  return (
    <View style={styles.container}>
      <CinemaModal />
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
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
  },
  mapContainer: {
    height: 200,
    width: "100%",
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  detailsContainer: {
    padding: 15,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  facilitiesContainer: {
    marginTop: 15,
  },
  facilitiesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  facilitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  facilityItem: {
    fontSize: 14,
    color: "#666",
    marginRight: 15,
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  directionsButton: {
    backgroundColor: "#FF6B00",
  },
  callButton: {
    borderColor: "#FF6B00",
  },
});

export default CinemaListScreen;
