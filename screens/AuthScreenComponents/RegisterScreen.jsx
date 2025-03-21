// RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Vibration,
  Image,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Formik } from "formik";
import { registrationValidationSchema } from "../../config/ValidationSchema";
import axios from "react-native-axios";
import { ScrollView } from "react-native-gesture-handler";

const API_SERVER = "http://10.33.53.160:5000/user";

const RegisterScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values, { setSubmitting, setFieldError }) => {
    setLoading(true);
    try {
      console.log(values);
      const response = await axios.post(`${API_SERVER}/register`, values);
      console.log("response: " + JSON.stringify(response));

      if (response.status === 200) {
        navigation.navigate("Thành công", {
          content: "Vui lòng xác minh email của bạn",
          nextScreen: "Đăng nhập",
        });
      }
    } catch (error) {
      Vibration.vibrate(50);
      console.error("Error during registration:", error);

      if (error.response?.data?.error) {
        const errorMessage = error.response.data.error;
        setFieldError("email", errorMessage);
      } else if (error.request) {
        setFieldError(
          "email",
          "Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau."
        );
      } else {
        setFieldError("email", `Đã xảy ra lỗi: ${error.message}`);
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "customer",
      }}
      validationSchema={registrationValidationSchema}
      onSubmit={handleRegister}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.pop()}
            >
              <Text style={styles.backButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Mascot Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={require("../../assets/images/—Pngtree—popcorn cartoon mascots perfect for_19959629.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <Text style={styles.title}>Đăng Ký Tài Khoản Mới</Text>

              {/* Register Form */}
              <View style={styles.formContainer}>
                <TextInput
                  label="Tên người dùng"
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  error={touched.username && errors.username}
                  style={styles.input}
                  mode="outlined"
                  outlineColor={
                    touched.username && errors.username ? "#FF0000" : "#E0E0E0"
                  }
                  left={<TextInput.Icon icon="account" />}
                />
                {touched.username && errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}

                <TextInput
                  label="Email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  error={touched.email && errors.email}
                  style={styles.input}
                  mode="outlined"
                  outlineColor={
                    touched.email && errors.email ? "#FF0000" : "#E0E0E0"
                  }
                  keyboardType="email-address"
                  left={<TextInput.Icon icon="email" />}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <TextInput
                  label="Mật khẩu"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  error={touched.password && errors.password}
                  style={styles.input}
                  mode="outlined"
                  outlineColor={
                    touched.password && errors.password ? "#FF0000" : "#E0E0E0"
                  }
                  secureTextEntry
                  left={<TextInput.Icon icon="lock" />}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <TextInput
                  label="Xác nhận mật khẩu"
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  error={touched.confirmPassword && errors.confirmPassword}
                  style={styles.input}
                  mode="outlined"
                  outlineColor={
                    touched.confirmPassword && errors.confirmPassword
                      ? "#FF0000"
                      : "#E0E0E0"
                  }
                  secureTextEntry
                  left={<TextInput.Icon icon="lock-check" />}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.registerButton}
                  loading={loading || isSubmitting}
                  disabled={loading || isSubmitting}
                >
                  Đăng ký
                </Button>

                {/* Login Link */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Đã có tài khoản? </Text>
                  <Text
                    style={styles.loginLink}
                    onPress={() => navigation.navigate("Đăng nhập")}
                  >
                    Đăng nhập
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 10,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 20,
    color: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  registerButton: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#FF6B00",
    borderRadius: 4,
  },
  loginContainer: {
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: "#FF6B00",
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#000000",
  },
  loginLink: {
    color: "#FF6B00",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
