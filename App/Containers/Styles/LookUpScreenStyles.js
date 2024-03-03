import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  separator: {
    backgroundColor: Colors.rgb_e6e6e6,
  },

  pointBankContainer: {
    alignItems: 'center',
    backgroundColor: Colors.rgb_f2f2f2,
    borderRadius: 11.1,
    flexDirection: 'row',
    height: 47,
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 18,
  },

  pointBankText: {
    ...Fonts.style.medium_15,
    color: Colors.rgb_060606,
    lineHeight: 18,
  },

  pointBankValue: {
    ...Fonts.style.black_20,
    color: Colors.rgb_4297ff,
    lineHeight: 23,
  },

  repItemContainer: {
    flexDirection: 'row',
    height: 92,
    alignItems: 'center',
  },

  profileImage: {
    borderRadius: 32,
    height: 64,
    marginLeft: 26,
    marginRight: 25,
    width: 64,
  },

  fullName: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_000000,
    lineHeight: 22,
  },

  emailOrRepCode: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_4a4a4a,
    lineHeight: 18,
  },

  errorContainer: {
    alignItems: 'center',
    paddingTop: 96,
  },

  errorMessageText: {
    ...Fonts.style.regular_15,
    color: Colors.rgb_757575,
    marginTop: 31,
  },

  awardItemContainer: {
    flexDirection: 'row',
    height: 79,
    alignItems: 'center',
  },

  awardTextContainer: {
    flex: 1,
    marginHorizontal: 24,
  },

  awardTitleText: {
    ...Fonts.style.medium_16,
    color: Colors.rgb_000000,
    marginBottom: 4,
  },

  awardDescriptionText: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_4a4a4a,
  },

  awardPoint: {
    ...Fonts.style.bold_20,
    marginRight: 24,
  },

  dialogBodyContainer: {
    marginTop: 20,
  },

  dialogDescriptionText: {
    ...Fonts.style.regular_14,
    color: Colors.rgb_4a4a4a,
    marginBottom: 16,
  },

  textInputStyles: {
    ...Fonts.style.medium_16,
    color: Colors.rgb_000000,
    lineHeight: 16,
    marginTop: 13,
  },
})
