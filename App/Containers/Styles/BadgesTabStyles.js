import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 93,
    marginHorizontal: 24,
  },

  separator: {
    backgroundColor: Colors.rgb_e6e6e6,
  },

  imageContainer: {
    alignItems: 'center',
    backgroundColor: Colors.rgb_f9f9f9,
    borderColor: Colors.rgb_ececec,
    borderRadius: 32,
    borderWidth: 1,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },

  image: {
    height: 44,
    width: 44,
  },

  descriptionContainer: {
    flex: 1,
    marginLeft: 25,
  },

  badgeNameText: {
    ...Fonts.style.bold_18,
    color: Colors.rgb_000000,
    lineHeight: 22,
  },

  badgeDescriptionText: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_4a4a4a,
    lineHeight: 18,
  }
})