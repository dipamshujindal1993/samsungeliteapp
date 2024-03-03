import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  container: {
    marginRight: 16,
    backgroundColor: Colors.transparent
  },
  text: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_b9b9b9,
  },
})
