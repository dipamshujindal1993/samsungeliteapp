import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts
} from '@resources'

export default StyleSheet.create({
  proContainer: {
    width: 32,
    height: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.rgb_fffaf2,
    borderColor: Colors.rgb_dab680,
  },
  proText: {
    ...Fonts.style.blackItalic_13,
    color: Colors.rgb_dab680,
  },
})