import { getData } from "@/config/AsyncStorageConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  Linking,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton, Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../context/ThemeContext";

const ProfileScreen = ({ navigation }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedUserInfo = await getData("userInfo");
      if (storedUserInfo) {
        console.log("User info", storedUserInfo);
        setUserInfo(storedUserInfo);
      }
    };
    fetchUserInfo();
  }, []);

  const handleHotlinePress = () => {
    Linking.openURL("tel:19002224");
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:hotro@galaxystudio.vn");
  };

  const handleCompanyInfoPress = () => {
    alert(
      "Galaxy Studio\n\n" +
        "Địa chỉ: 123 Nguyễn Du, Q.1, TP.HCM\n" +
        "Mã số thuế: 0123456789\n" +
        "Giấy phép kinh doanh: 123456789\n" +
        "Ngày cấp: 01/01/2024"
    );
  };

  const handleTermsPress = () => {
    alert(
      "Điều khoản sử dụng\n\n" +
        "1. Quy định chung\n" +
        "- Người dùng phải trên 13 tuổi\n" +
        "- Thông tin cung cấp phải chính xác\n\n" +
        "2. Quy định đặt vé\n" +
        "- Vé đã đặt không được hoàn/hủy\n" +
        "- Vui lòng kiểm tra kỹ thông tin trước khi đặt\n\n" +
        "3. Bảo mật thông tin\n" +
        "- Chúng tôi cam kết bảo vệ thông tin của bạn\n" +
        "- Không chia sẻ thông tin cho bên thứ ba"
    );
  };

  const handleLogoutPress = () => {
    alert("Bấm vào chính sách");
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userInfo");
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    setUserInfo(null);
    alert("User info removed");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Tài khoản
        </Text>
        <IconButton
          icon={isDarkMode ? "white-balance-sunny" : "moon-waning-crescent"}
          size={24}
          onPress={toggleTheme}
          color={theme.colors.primary}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Image
            source={require("../../assets/images/—Pngtree—popcorn cartoon mascots perfect for_19959629.png")}
            style={styles.mascotImage}
            resizeMode="contain"
          />

          <Text style={[styles.promotionTitle, { color: theme.colors.text }]}>
            Đăng Ký Thành Viên Ngay
          </Text>
          <Text
            style={[styles.promotionSubtitle, { color: theme.colors.text }]}
          >
            Nhận Quà Liền Tay
          </Text>
        </View>
        {userInfo ? (
          // Hiển thị thông tin người dùng nếu đã đăng nhập
          <View style={styles.buttonContainer}>
            <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
              Xin chào, {userInfo.username}!
            </Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Đăng ký")}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.registerButtonText}
            >
              Đăng ký
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Đăng nhập")}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.loginButtonText}
            >
              Đăng nhập
            </Button>
          </View>
        )}
        <View style={styles.infoSection}>
          <Pressable
            onPress={handleHotlinePress}
            style={[
              styles.infoItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
              Gọi ĐƯỜNG DÂY NÓNG:
            </Text>
            <Text style={styles.infoValueBlue}>19002224</Text>
            <IconButton
              icon="chevron-right"
              size={24}
              color={theme.colors.primary}
            />
          </Pressable>
          <Pressable
            onPress={handleEmailPress}
            style={[
              styles.infoItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
              Email:
            </Text>
            <Text style={styles.infoValueBlue}>hotro@galaxystudio.vn</Text>
            <IconButton
              icon="chevron-right"
              size={24}
              color={theme.colors.primary}
            />
          </Pressable>
          <Pressable
            onPress={handleCompanyInfoPress}
            style={[
              styles.infoItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
              Thông Tin Công Ty
            </Text>
            <IconButton
              icon="chevron-right"
              size={24}
              color={theme.colors.primary}
            />
          </Pressable>
          <Pressable
            onPress={handleTermsPress}
            style={[
              styles.infoItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
              Điều Khoản Sử Dụng
            </Text>
            <IconButton
              icon="chevron-right"
              size={24}
              color={theme.colors.primary}
            />
          </Pressable>

          {userInfo ? (
            <Pressable
              onPress={handleLogout}
              style={[
                styles.infoItem,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
                Đăng xuất
              </Text>
              <IconButton
                icon="chevron-right"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  bottomPadding: {
    height: 80, // Adjust based on your tab bar height
  },
  headerTitle: {
    display: "flex",
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
    marginTop: 20,
  },
  mascotImage: {
    width: 200,
    height: 200,
  },
  promotionTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  promotionSubtitle: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 4,
  },
  featureSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  featureItem: {
    alignItems: "center",
  },
  featureIcon: {
    width: 40,
    height: 40,
  },
  featureText: {
    marginTop: 8,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 10,
    borderBottomWidth: 5,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "600",
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#FF6B00",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF6B00",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FF6B00",
    fontSize: 16,
    fontWeight: "600",
  },
  infoSection: {
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#EEEEEE",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#EEEEEE",
    fontWeight: "700",
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333333",
  },
  infoValue: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
  infoValueBlue: {
    fontSize: 14,
    color: "#2196F3",
    flex: 1,
  },
  infoArrow: {
    margin: 0,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: "#999999",
  },
  activeNavIcon: {
    tintColor: "#0066CC",
  },
  activeNavText: {
    fontSize: 12,
    color: "#0066CC",
    marginTop: 4,
  },
  buttonContent: {
    height: 45,
    width: "100%",
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    marginRight: 5,
  },
  loginButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF6B00",
    borderRadius: 8,
    marginLeft: 5,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginButtonText: {
    color: "#FF6B00",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
