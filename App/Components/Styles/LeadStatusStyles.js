import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  
  statusText: {
    ...Fonts.style.bold_11,
    letterSpacing: -0.3,
    color: Colors.rgb_989898,
    top: 1
  },

  statusTextReverse: {
    paddingRight: 14,
  },

  statusTextNormal: {
    paddingLeft: 10,
  },

  reverse: {
    flexDirection: 'row-reverse',
  },

  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
})
