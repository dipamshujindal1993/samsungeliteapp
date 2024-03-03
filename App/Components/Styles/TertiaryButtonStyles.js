import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingBottom: 14,
    paddingTop: 13,
    paddingHorizontal: 96,
  },
  text: {
    ...Fonts.style.medium_11,
    color: Colors.rgb_c2c2c2,
  },
})
