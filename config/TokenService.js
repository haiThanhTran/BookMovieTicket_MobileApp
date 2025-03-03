// TokenService.js
import * as Keychain from 'react-native-keychain';

export const storeTokens = async (accessToken, refreshToken) => {
  try {
    console.log("storeTokens", accessToken,refreshToken);
    // Lưu cả 2 token dưới dạng JSON string
    await Keychain.setGenericPassword(
      'tokens', // Tùy chọn, không quan trọng
      JSON.stringify({ accessToken, refreshToken })
    );
    console.log('Tokens stored successfully');
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Lấy token
export const getTokens = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return JSON.parse(credentials.password);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    throw error;
  }
};

// Lấy Refresh Token
export const getRefreshToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials.username;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
  }
};

// Xóa token
export const clearTokens = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

export const testKeychain = async () => {
  try {
    await Keychain.setGenericPassword('test', '123');
    const creds = await Keychain.getGenericPassword();
    console.log('Keychain test:', creds);
  } catch (error) {
    console.error('Keychain NOT WORKING:', error);
  }
};

// Gọi hàm test khi khởi động app
testKeychain();