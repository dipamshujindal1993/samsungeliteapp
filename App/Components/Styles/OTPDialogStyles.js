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
    marginHorizontal: 36,
    paddingVertical: 28,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: Colors.white,
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowColor: Colors.rgba_0000004c,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  title: {
    ...Fonts.style.medium_18,
    color: Colors.rgb_4a4a4a,
    letterSpacing: 0.1,
  },
  message: {
    ...Fonts.style.regular_14,
    color: Colors.rgb_4a4a4a,
    marginTop: 16,
    marginBottom: 15,
  },

  ctaView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  
  cta: {
    ...Fonts.style.medium_14,
    textAlign: 'center',
    letterSpacing: 1.25,
    lineHeight: 16,
    color: Colors.rgb_4297ff,
    minWidth: 75,
    marginTop: 20,
    paddingLeft: 9,
    paddingRight: 8,
    marginLeft: 8,
  },

  textInputContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginVertical: 15,
  },

  textInput: {
    color: Colors.white,
    height: 40,
  },

  textInputView: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: -40
  },

  otpDigitContainer: {
    height: 30,
    width: 20,
  },

  otpDigit: {
    ...Fonts.style.bold_26,
    color: Colors.rgb_000000,
  },

  middleSpaceLeft: {
    marginLeft: 13,
  },

  middleSpaceRight: {
    marginRight: 13,
  },
  
  errorMessage: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_ff4337,
    textAlign: 'center',
  },

  iosFooter: {
    height: 200
  },

  resendText: {
    ...Fonts.style.medium_12,
    color: Colors.rgb_4a4a4a,
    right: 27,
    position: 'absolute',
    top: 31,
  },
})
