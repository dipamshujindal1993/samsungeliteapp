import { Platform } from 'react-native'

const family = {
  black: Platform.OS === 'android' ? 'Roboto-Black' : 'SFProDisplay-Black',
  blackItalic: Platform.OS === 'android' ? 'Roboto-BlackItalic' : 'SFProDisplay-BlackItalic',
  light: Platform.OS === 'android' ? 'Roboto-Light' : 'SFProDisplay-Light',
  regular: Platform.OS === 'android' ? 'Roboto-Regular' : 'SFProDisplay-Regular',
  medium: Platform.OS === 'android' ? 'Roboto-Medium' : 'SFProDisplay-Medium',
  bold: Platform.OS === 'android' ? 'Roboto-Bold' : 'SFProDisplay-Bold',
}

const size = {
  s9: 9,
  s10: 10,
  s11: 11,
  s12: 12,
  s13: 13,
  s14: 14,
  s15: 15,
  s16: 16,
  s17: 17,
  s18: 18,
  s20: 20,
  s22: 22,
  s23: 23,
  s24: 24,
  s26: 26,
  s29: 29,
  s30: 30,
  s32: 32,
  s33: 33,
  s36: 36,
  s45: 45,
  s48: 48,
  s56: 56,
}

const style = {
  black_10: {
    fontFamily: family.black,
    fontSize: size.s10,
  },
  black_12: {
    fontFamily: family.black,
    fontSize: size.s12,
  },
  black_14: {
    fontFamily: family.black,
    fontSize: size.s14,
  },
  black_18: {
    fontFamily: family.black,
    fontSize: size.s18,
  },
  black_20: {
    fontFamily: family.black,
    fontSize: size.s20,
  },
  black_22: {
    fontFamily: family.black,
    fontSize: size.s22,
  },
  black_48: {
    fontFamily: family.black,
    fontSize: size.s48,
  },
  blackItalic_13: {
    fontFamily: family.blackItalic,
    fontSize: size.s13,
  },
  light_12: {
    fontFamily: family.light,
    fontSize: size.s12,
  },
  light_16: {
    fontFamily: family.light,
    fontSize: size.s16,
  },
  light_20: {
    fontFamily: family.light,
    fontSize: size.s20,
  },
  light_24: {
    fontFamily: family.light,
    fontSize: size.s24,
  },
  light_56: {
    fontFamily: family.light,
    fontSize: size.s56,
  },
  regular_9: {
    fontFamily: family.regular,
    fontSize: size.s9,
  },
  regular_10: {
    fontFamily: family.regular,
    fontSize: size.s10,
  },
  regular_11: {
    fontFamily: family.regular,
    fontSize: size.s11,
  },
  regular_12: {
    fontFamily: family.regular,
    fontSize: size.s12,
  },
  regular_13: {
    fontFamily: family.regular,
    fontSize: size.s13,
  },
  regular_14: {
    fontFamily: family.regular,
    fontSize: size.s14,
  },
  regular_15: {
    fontFamily: family.regular,
    fontSize: size.s15,
  },
  regular_16: {
    fontFamily: family.regular,
    fontSize: size.s16,
  },
  regular_17: {
    fontFamily: family.regular,
    fontSize: size.s17,
  },
  regular_18: {
    fontFamily: family.regular,
    fontSize: size.s18,
  },
  regular_20: {
    fontFamily: family.regular,
    fontSize: size.s20,
  },
  regular_22: {
    fontFamily: family.regular,
    fontSize: size.s22,
  },
  medium_10: {
    fontFamily: family.medium,
    fontSize: size.s10,
  },
  medium_11: {
    fontFamily: family.medium,
    fontSize: size.s11,
  },
  medium_12: {
    fontFamily: family.medium,
    fontSize: size.s12,
  },
  medium_13: {
    fontFamily: family.medium,
    fontSize: size.s13,
  },
  medium_14: {
    fontFamily: family.medium,
    fontSize: size.s14,
  },
  medium_15: {
    fontFamily: family.medium,
    fontSize: size.s15,
  },
  medium_16: {
    fontFamily: family.medium,
    fontSize: size.s16,
  },
  medium_17: {
    fontFamily: family.medium,
    fontSize: size.s17,
  },
  medium_18: {
    fontFamily: family.medium,
    fontSize: size.s18,
  },
  medium_20: {
    fontFamily: family.medium,
    fontSize: size.s20,
  },
  medium_23: {
    fontFamily: family.medium,
    fontSize: size.s23,
  },
  medium_24: {
    fontFamily: family.medium,
    fontSize: size.s24,
  },
  medium_29: {
    fontFamily: family.medium,
    fontSize: size.s29
  },
  medium_33: {
    fontFamily: family.medium,
    fontSize: size.s33,
  },
  bold_10: {
    fontFamily: family.bold,
    fontSize: size.s10,
  },
  bold_11: {
    fontFamily: family.bold,
    fontSize: size.s11,
  },
  bold_12: {
    fontFamily: family.bold,
    fontSize: size.s12,
  },
  bold_13: {
    fontFamily: family.bold,
    fontSize: size.s13,
  },
  bold_14: {
    fontFamily: family.bold,
    fontSize: size.s14,
  },
  bold_15: {
    fontFamily: family.bold,
    fontSize: size.s15,
  },
  bold_16: {
    fontFamily: family.bold,
    fontSize: size.s16,
  },
  bold_17: {
    fontFamily: family.bold,
    fontSize: size.s17,
  },
  bold_18: {
    fontFamily: family.bold,
    fontSize: size.s18,
  },
  bold_20: {
    fontFamily: family.bold,
    fontSize: size.s20,
  },
  bold_26: {
    fontFamily: family.bold,
    fontSize: size.s26,
  },
  bold_45: {
    fontFamily: family.bold,
    fontSize: size.s45,
  },
  light_32: {
    fontFamily: family.light,
    fontSize: size.s32
  },
}

export default {
  family,
  size,
  style
}