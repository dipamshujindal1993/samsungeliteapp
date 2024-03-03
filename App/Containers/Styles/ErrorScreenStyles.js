import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts
} from '@resources'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  fullContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Fonts.style.medium_16,
    color: Colors.rgb_4a4a4a,
    textAlign: 'center',
    lineHeight: 18,
  },
  message: {
    ...Fonts.style.regular_14,
    color: Colors.rgb_9b9b9b,
    marginTop: 11,
    paddingHorizontal: 66,
    textAlign: 'center',
    lineHeight: 18
  },
  button: {
    marginTop: 54
  },
  icon: {
    ...Fonts.style.black_48,
    color: Colors.rgb_4a4a4a,
  },
  errorTitle: {
    ...Fonts.style.regular_15,
    color: Colors.rgb_757575,
    marginTop: 28,
    textAlign: 'center',
    paddingHorizontal: 72,
  },
  errorMessage: {
    ...Fonts.style.regular_13,
    lineHeight: 22,
    color: Colors.rgb_969696,
    marginTop: 23,
    textAlign: 'center',
    paddingHorizontal: 38,
  },
  cta: {
    marginTop: 51,
    paddingHorizontal: 40,
  },
})
