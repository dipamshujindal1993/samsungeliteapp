import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
  button: {
    backgroundColor: Colors.rgb_4297ff,
    borderRadius: 14,
    height: 28,
    width: 28,
  },

  buttonDisabled: {
    backgroundColor: Colors.rgb_b9b9b9,
  },

  signContainer: {
    height: 28,
    position: 'relative',
    width: 28,
  },

  centerHorizontalLine: {
    backgroundColor: Colors.white,
    height: 4,
    left: 7,
    position: 'absolute',
    top: 12,
    width: 14,
  },

  centerVerticalLine: {
    backgroundColor: Colors.white,
    height: 14,
    left: 12,
    position: 'absolute',
    top: 7,
    width: 4,
  },

  minusHorizontalLine: {
    backgroundColor: Colors.white,
    height: 4,
    left: 8.5,
    position: 'absolute',
    top: 12,
    width: 11,
  }
});