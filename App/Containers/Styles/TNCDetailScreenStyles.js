import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  text: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_9b9b9b,
    lineHeight: 20,
  },
})