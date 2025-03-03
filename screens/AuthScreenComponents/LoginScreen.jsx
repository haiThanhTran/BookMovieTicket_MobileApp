import React, { useState } from "react";
import { View, StyleSheet, Vibration, Image, TouchableOpacity } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Formik } from "formik";
import { loginValidationSchema } from "../../config/ValidationSchema";
import axios from 'react-native-axios';

const API_SERVER = "http://192.162.13.101:5000/mobile";
import { storeData } from "../../config/AsyncStorageConfig";
import { ScrollView } from "react-native-gesture-handler";

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    setLoading(true);
    try {
      console.log(values);
      const response = await axios.post(`${API_SERVER}/login`, values);
      if (response.status === 200) {
        const { accessToken, refreshToken, userInfo } = response.data;
        console.log("Login success:", response.data);
        storeData("userInfo", userInfo);
        storeData("accessToken", accessToken);
        storeData("refreshToken", refreshToken);
        navigation.navigate("Thành công", {
          content: "Đăng nhập thành công",
          nextScreen: "Trang chủ",
        });
      }
    } catch (error) {
      Vibration.vibrate(50);
      console.log("Error during login:", error.response.data.error);
      if (error.response.data.error) {
        const errorMessage = error.response.data.error;
        setFieldError("email", errorMessage);
      } else if (error.request) {
        setErrors({
          general: "Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau.",
        });
      } else {
        setErrors({ general: `Đã xảy ra lỗi: ${error.message}` });
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={loginValidationSchema}
      onSubmit={handleLogin}
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
            <Text style={styles.title}>Đăng Nhập Với Tài Khoản Của Bạn</Text>

            {/* Login Form */}
            <View style={styles.formContainer}>
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
                left={<TextInput.Icon icon="account" />}
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

              {/* Forgot Password */}
              <Text
                style={styles.forgotPassword}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                Quên mật khẩu?
              </Text>

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.loginButton}
                loading={loading || isSubmitting}
                disabled={loading || isSubmitting}
              >
                Đăng nhập
              </Button>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Người dùng mới ! </Text>
                <Text
                  style={styles.registerLink}
                  onPress={() => navigation.navigate("Đăng ký")}
                >
                  Đăng ký
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 10,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 20,
    color: '#000',
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
  forgotPassword: {
    color: "#1976D2",
    textAlign: "right",
    marginTop: 8,
    marginBottom: 24,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: "#FF6B00",
    borderRadius: 4,
  },
  registerContainer: {
    gap:5,
    borderTopWidth: 1,
    borderTopColor: "#FF6B00",
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: "#000000",
  },
  registerLink: {
    color: "#FF6B00",
    fontWeight: "bold",
  },
});

export default LoginScreen;
