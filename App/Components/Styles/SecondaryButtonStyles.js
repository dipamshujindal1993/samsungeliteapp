import { StyleSheet } from 'react-native'
import {
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
    ...Fonts.style.medium_13,
  },
})
