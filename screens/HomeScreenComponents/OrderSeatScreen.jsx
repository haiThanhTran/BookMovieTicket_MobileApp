import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Card, Button } from "react-native-paper";
import axios from 'axios';
import {env} from "../../config/enviroment";
const BASE_URL = env.API_URL;

const OrderSeatScreen = () => {
  const route = useRoute();
  const { showtimeId,screenId } = route.params;
  const navigation = useNavigation();
  const [seatLayout, setSeatLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null); // State chỉ 1 ghế được chọn

  useEffect(() => {
    const fetchSeatLayout = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/showtime/showtimes/${showtimeId}`);
        const showtimeData = response.data;
        setSeatLayout(showtimeData.screenId.seatLayout);
        console.log("Seat layout: ", showtimeData.screenId.seatLayout);
      } catch (error) {
        console.error("Lỗi khi fetch seatLayout:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeatLayout();
  }, [showtimeId]);

  const handleSeatSelect = (seat) => {
    if (seat.status === 'booked') {
      return; // Không cho chọn ghế đã đặt
    }

    if (selectedSeat && selectedSeat.seatNumber === seat.seatNumber) {
      setSelectedSeat(null); // Deselect ghế nếu đã chọn ghế đó
    } else {
      setSelectedSeat(seat); // Chọn ghế mới
      console.log("Selected seat: ", seat);
    }
  };


  const renderSeat = (seat) => {
    let seatStyle = styles.seatAvailable;
    if (seat.status === "booked") {
      seatStyle = styles.seatBooked;
    } else if (selectedSeat && selectedSeat.seatNumber === seat.seatNumber) {
      seatStyle = styles.seatSelected; // Ghế đang chọn
    }

    return (
      <TouchableOpacity
        key={seat.seatNumber}
        style={[styles.seat, seatStyle]}
        onPress={() => handleSeatSelect(seat)}
        disabled={seat.status === "booked"}
      >
        <Text style={styles.seatText}>{seat.seatNumber}</Text>
      </TouchableOpacity>
    );
  };

  const renderSeatRow = (row, rowIndex) => (
    <View key={rowIndex.toString()} style={styles.seatRow}>
      {row.map((seat) => renderSeat(seat))}
    </View>
  );

  const handleContinueBooking = () => {
    if (!selectedSeat) {
      alert("Vui lòng chọn một ghế!"); // Hiển thị alert nếu chưa chọn ghế
      return;
    }

    // **TODO: Tính toán tổng tiền vé dựa trên loại ghế và giá vé suất chiếu (sẽ làm sau)**
    const totalPrice = 75000; // Giá vé mẫu (tạm thời)

    const bookingInfo = { // Tạo object thông tin đặt vé để truyền sang TransactionScreen
      showtimeId: showtimeId,
      selectedSeat: selectedSeat,
      totalPrice: totalPrice,
      screenId: screenId,
      
      // Thêm thông tin khác nếu cần (ví dụ: thông tin phim, rạp, suất chiếu...)
    };

    navigation.navigate("Thanh Toán", { bookingInfo: bookingInfo }); // Navigate to TransactionScreen, truyền bookingInfo
  };

  if (loading || !seatLayout) {
    return (
      <ActivityIndicator size="large" color="#ffc83d" style={styles.loading} />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenName}>
        Galaxy Mipec Long Biên - Phòng 1 - 2D Phụ Đề
      </Text>
      <ScrollView horizontal style={styles.seatChartContainer}>
        <View style={styles.seatChart}>
          {seatLayout.seats.map((row, rowIndex) =>
            renderSeatRow(row, rowIndex)
          )}
        </View>
      </ScrollView>

      <Text style={styles.screenText}>Màn hình</Text>
      <View style={styles.screen} />

      {/* Loại bỏ Seat Type Selector */}
      {/* <View style={styles.seatTypeSelector}>
        <Text style={styles.seatTypeLabel}>Loại ghế:</Text>
        </RadioButton.Group>
      </View> */}

      <View style={styles.seatLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.seat, styles.seatAvailable]} />
          <Text>Còn trống</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.seat, styles.seatBooked]} />
          <Text>Đã bán</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.seat, styles.seatSelected]} />
          <Text>Đang chọn</Text>
        </View>
      </View>

      <Card style={styles.bookingSummaryCard}>
        <Card.Content>
          <Text>
            {selectedSeat ? `1x ghế: ${selectedSeat.seatNumber}` : 'Vui lòng chọn ghế'}
          </Text>
          {/* Hiển thị thông tin ghế đã chọn động */}
          <Text style={styles.totalPrice}>
            Tổng Cộng: {selectedSeat ? '75,000đ' : '0đ'}
          </Text>
          {/* Hiển thị tổng tiền vé mẫu (tạm thời) */}
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        style={styles.continueButton}
        onPress={handleContinueBooking}
        disabled={!selectedSeat} // Disable nút Tiếp tục nếu chưa chọn ghế
      >
        Tiếp tục
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  loading: {
    marginTop: "50%",
  },
  screenName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  seatChartContainer: {
    marginBottom: 20,
  },
  seatChart: {
    // Style cho container sơ đồ ghế (grid)
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  seatRow: {
    flexDirection: "row",
  },
  seat: {
    width: 24,
    height: 24,
    margin: 4,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  seatText: {
    fontSize: 10,
    color: "black",
  },
  seatAvailable: {
    backgroundColor: "#fff", // Ghế trống màu trắng
    borderWidth: 1,
    borderColor: "#ccc",
  },
  seatBooked: {
    backgroundColor: "#999", // Ghế đã đặt màu xám
  },
  seatSelected: {
    backgroundColor: "#ffc83d", // Ghế đang chọn màu vàng
  },
  screenText: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
  screen: {
    height: 2,
    backgroundColor: "orange",
    width: "80%",
    alignSelf: "center",
    marginBottom: 20,
  },
  seatTypeSelector: {
    marginBottom: 20,
  },
  seatTypeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  seatLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookingSummaryCard: {
    marginBottom: 20,
  },
  bookingSummaryCardContent: {
    padding: 10, 
  },
  totalPrice: {
    fontWeight: "bold",
    fontSize: 16,
  },
  continueButton: {
    paddingVertical: 8,
  },
});

export default OrderSeatScreen;