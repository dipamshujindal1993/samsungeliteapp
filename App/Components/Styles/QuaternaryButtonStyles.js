import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
  } from '@resources'

export default StyleSheet.create({
  container: {
    borderRadius: 21.5,
    backgroundColor: Colors.rgb_4a4a4a,
    paddingBottom: 14,
    paddingTop: 13,
    paddingHorizontal: 28.5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    color: Colors.white,
    ...Fonts.style.medium_13
  },
})
