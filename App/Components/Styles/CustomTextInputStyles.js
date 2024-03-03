import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  label_info: {
    flexDirection: 'row',
  },
  label: {
    ...Fonts.style.light_12,
    color: Colors.rgb_3e4a59,
  },
  icon: {
    paddingHorizontal: 9.6,
  },
  textInput: {
    ...Fonts.style.regular_18,
    color: Colors.rgb_24272b,
    paddingVertical: 10,
  },
  showHidePassword: {
    ...Fonts.style.medium_14,
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: 10,
  },
  errorMessage: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_ff4337,
    textAlign: 'center',
    marginTop: 32.5,
  },
  counterNumber: {
    ...Fonts.style.light_12,
    color: Colors.rgb_9b9b9b,
    letterSpacing: 0.3,
    lineHeight: 14,
    textAlign: 'right',
  },
})
