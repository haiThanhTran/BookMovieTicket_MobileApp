import { AppRegistry } from 'react-native';
import App from '../App.js';
import { name as appName } from '../app.json';

// Đăng ký component gốc của ứng dụng
AppRegistry.registerComponent(appName, () => App);

export default App;