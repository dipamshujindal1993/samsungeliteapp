import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
  separator: {
    marginLeft: 16,
  },

  itemContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    marginHorizontal: 24,
  },

  contentContainer: {
    flex: 1,
  },

  pointContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 24,
  },

  titleText: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_545454,
    marginTop: 18,
  },

  descriptionText: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_727272,
    marginTop: 7,
  },

  plusSign: {
    ...Fonts.style.bold_20,
    color: Colors.rgb_4297ff,
  },

  minusSign: {
    ...Fonts.style.bold_26,
    color: Colors.rgb_ff4339,
  },

  pointNumber: {
    ...Fonts.style.bold_20,
    color: Colors.rgb_000000,
  },
})