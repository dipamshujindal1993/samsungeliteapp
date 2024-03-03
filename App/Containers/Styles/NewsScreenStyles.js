import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 109,
    marginHorizontal: 24,
  },

  itemImage: {
    height: 65,
    width: 96,
    marginRight: 14,
    borderRadius: 8,
  },

  itemDetailContainer: {
    flex: 1,
  },

  itemTitle: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_4a4a4a,
  },

  itemDescription: {
    ...Fonts.style.regular_11,
    color: Colors.rgb_676767,
    marginTop: 8,
  },

  separator: {
    backgroundColor: Colors.rgb_e3e3e3,
    height: 1,
    marginLeft: 24,
  },

  proTag: {
    position: 'absolute',
    left: 3,
    top: 25,
    zIndex: 1,
  },
})
