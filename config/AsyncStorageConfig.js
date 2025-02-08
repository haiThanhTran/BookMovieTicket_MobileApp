import AsyncStorage from '@react-native-async-storage/async-storage';

// Lưu dữ liệu
export const storeData = async (key, value) => {
  try {
    if (key == null || value == null) {
      throw new Error('Key hoặc value không được là null hoặc undefined');
    }
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// Lấy dữ liệu
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};

// Xóa dữ liệu
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};
