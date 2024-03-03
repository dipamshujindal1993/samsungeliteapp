import { Dimensions, Platform, StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

const windowWidth = Dimensions.get('window').width

export default StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerLeft: {
    marginLeft: Platform.OS === 'ios' ? 8 : 0,
  },

  headerTextInput: {
    ...Fonts.style.regular_17,
    color: Colors.rgb_4a4a4a,
    width: Platform.OS === 'ios' ? windowWidth - 100 : windowWidth - 88,
  },

  clearIcon: {
    marginRight: 18,
  },

  container: {
    flex: 1,
  },
})
