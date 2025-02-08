// RegisterScreen.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Formik } from "formik";
import { registrationValidationSchema } from "../../config/ValidationSchema";
import axios from "axios";

const API_SERVER = "http://192.162.13.101:5000/user";

const RegisterScreen = ({ navigation }) => {
  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      console.log(values);
      const response = await axios.post(`${API_SERVER}/register`, values);
      console.log("response: " + JSON.stringify(response));
      if (response.status === 200) {
        // Xử lý phản hồi thành công từ API (ví dụ: điều hướng đến màn hình đăng nhập)
        navigation.navigate("Đăng nhập");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error during registration:", error);
        // Máy chủ đã phản hồi với mã trạng thái không nằm trong phạm vi 2xx
        if (error.response.data) {
          // Giả sử API trả về đối tượng lỗi với các trường tương ứng
          setErrors(error.response.data);
        } else {
          // Xử lý khi không có dữ liệu lỗi cụ thể
          setErrors({
            general: "Đã xảy ra lỗi, nhưng không có thông tin chi tiết.",
          });
        }
      } else if (error.request) {
        console.error("Error during registration:", error);
        // Yêu cầu đã được gửi nhưng không nhận được phản hồi
        setErrors({
          general: "Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau.",
        });
      } else {
        console.error("Error during registration:", error);
        // Xảy ra lỗi trong quá trình thiết lập yêu cầu
        setErrors({ general: `Đã xảy ra lỗi: ${error.message}` });
      }
    } finally {
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
      }) => (
        <View style={styles.container}>
          <TextInput
            label="Tên người dùng"
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username}
            error={touched.username && errors.username}
            style={styles.input}
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
            keyboardType="email-address"
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
            secureTextEntry
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
            secureTextEntry
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Đăng ký
          </Button>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
});

export default RegisterScreen;
