import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Button, HelperText } from "react-native-paper";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";

const BASE_URL = "http://192.162.13.101:5000"; // **TODO: Thay YOUR_BACKEND_BASE_URL nếu cần**

const TransactionScreen = () => {
  const route = useRoute();
  const { showtimeId, selectedSeat, totalPrice, screenId } =
    route.params.bookingInfo; // Nhận showtimeId và selectedSeats từ route params
  console.log("Route Params:", route.params.bookingInfo);

  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  console.log("Showtime ID:", showtimeId);
  console.log("Selected Seats:", selectedSeat);
  console.log("Total Price:", totalPrice);
  console.log("Screen ID:", screenId);

  const validateEmail = (text) => {
    // Basic email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!regex.test(text));
  };

  const handlePayment = async () => {
    if (emailError || !email) {
      setEmailError(true); // Hiển thị lỗi nếu email không hợp lệ hoặc trống
      return;
    }
    const row = selectedSeat.seatNumber[0]; // "E"
    const col = parseInt(selectedSeat.seatNumber.slice(1)); // 10
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/bookings/bookings`, {
        // Gọi API POST /bookings
        showtimeId: showtimeId,
        seats: [{ row, col, seatType: selectedSeat.type }],

        paymentMethod: "Tại quầy", // Phương thức thanh toán
        paymentStatus: "success", // Trạng thái thanh toán ban đầu là success (vì thanh toán tại quầy)
        customerEmail: email, // Thêm email khách hàng
        screenId: screenId,
      });

      console.log("Đặt vé thành công:", response.data);
      setBookingSuccess(true); // Cập nhật trạng thái đặt vé thành công
      setBookingCode(response.data.bookingCode); // Lưu mã đặt vé
      // **TODO: Có thể navigate đến màn hình xác nhận đặt vé sau này**
    } catch (error) {
      console.error("Lỗi khi đặt vé:", error);
      // **TODO: Xử lý lỗi hiển thị cho người dùng (ví dụ: thông báo lỗi)**
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.push("Trang Chủ")}
          >
            <Text style={styles.backButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerInput}>
          <Text style={styles.successText}>Thành công!</Text>
          <Text style={styles.successText}>
            Vui lòng check thông tin vé ở email của bạn.
          </Text>
          <Text style={styles.bookingCodeText}>
            Mã đặt vé của bạn: {bookingCode}
          </Text>

          {/* **TODO: Thêm nút "Về trang chủ" hoặc "Xem vé" nếu cần */}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.push("Trang Chủ")}
        >
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerInput}>
        <Text style={styles.title}>Vui lòng nhập email nhận vé</Text>
        <TextInput
          label="Email nhận vé"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholder=" Email...."
          onBlur={() => validateEmail(email)} // Validate khi blur khỏi input
        />
        {emailError && (
          <HelperText type="error" visible={emailError}>
            Email không hợp lệ
          </HelperText>
        )}

        <Button
          mode="contained-tonal"
          onPress={handlePayment}
          style={styles.payButton}
          loading={loading}
          disabled={loading}
        >
          Xác Nhận
        </Button>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#ffc83d"
            style={styles.loadingIndicator}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    // justifyContent: "center",
  },
  header: {
    height: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 5,
    top: 10,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 20,
    color: '#000',
  },
  containerInput: {
    flex: 1,
    justifyContent: "center",
  },
  TextInput: {
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  payButton: {
    marginTop: 20,
    paddingVertical: 5,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  successText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  bookingCodeText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default TransactionScreen;
