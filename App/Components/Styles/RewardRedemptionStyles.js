import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
  container: {
    marginHorizontal: 24,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },

  titleImage: {
    alignSelf: 'center',
    width: 136,
    height: 140,
  },

  title: {
    ...Fonts.style.medium_24,
    alignSelf: 'center',
    marginTop: 15,
    color: Colors.rgb_464544,
  },

  redeemAvailable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.rgb_4297ff,
    marginHorizontal: -8,
    marginTop: 23,
    height: 52,
    borderRadius: 26,
  },

  redeemUnavailable: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.rgb_b9b9b9,
    marginHorizontal: -8,
    marginTop: 23,
    height: 52,
    borderRadius: 26,
  },

  redeemAvailableText: {
    ...Fonts.style.medium_15,
    marginLeft: 18,
    color: Colors.white,
  },

  redeemUnavailableText: {
    ...Fonts.style.medium_15,
    color: Colors.white,
  },

  redeemPoint: {
    ...Fonts.style.bold_20,
    marginRight: 18,
    color: Colors.white,
  },

  description: {
    ...Fonts.style.regular_14,
    marginTop: 26,
    color: Colors.rgb_4a4a4a,
  },
})
