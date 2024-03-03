import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  container: {
    borderRadius: 21.5,
    paddingBottom: 14,
    paddingTop: 13,
    paddingHorizontal: 96,
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    ...Fonts.style.medium_13,
    color: Colors.white,
  },
})
