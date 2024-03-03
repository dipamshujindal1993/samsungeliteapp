import {
  StyleSheet,
  Dimensions
} from 'react-native'
import {
  Colors
} from '@resources'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    width: Dimensions.get('window').width - 48,
  },
  spinner: {
    backgroundColor: Colors.white,
  },
})