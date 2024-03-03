import {
  Dimensions,
  StyleSheet,
} from 'react-native'
import { Fonts, Colors } from '@resources'
const { width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  tabWidth: {
    width: (width - 48) / 2,
  },

  period: {
    ...Fonts.medium_12,
    color: Colors.rgb_4a4a4a,
    marginLeft: 12,
    paddingVertical: 10,
  },
})