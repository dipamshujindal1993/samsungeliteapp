import 'react-native-gesture-handler'
import '@config/ReactotronConfig'
import { AppRegistry } from 'react-native';
import App from '@containers/App'
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
