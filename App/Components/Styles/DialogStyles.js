import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts
} from '@resources'

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.rgba_00000099,
    justifyContent: 'center',
  },
  dialogView: {
    marginHorizontal: 34,
    paddingTop: 23,
    paddingBottom: 17,
    paddingLeft: 33,
    paddingRight: 27,
    borderRadius: 14,
    backgroundColor: Colors.white,
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowColor: Colors.rgba_0000004c,
    shadowOpacity: 0.2,
    shadowRadius: 6
  },
  title: {
    ...Fonts.style.medium_20,
    color: Colors.rgb_4a4a4a,
  },
  message: {
    ...Fonts.style.regular_16,
    lineHeight: 22,
    color: Colors.rgba_0000008a,
    marginTop: 12
  },
  ctaView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  cta: {
    ...Fonts.style.medium_14,
    textAlign: 'center',
    letterSpacing: 0.5,
    color: Colors.rgb_4297ff,
    minWidth: 75,
    paddingTop: 11,
    paddingBottom: 9,
    paddingLeft: 9,
    paddingRight: 8,
    marginLeft: 8,
  },
  ctaDisabled: {
    opacity: 0.3
  },
  iosFooter: {
    height: 200
  },
})
