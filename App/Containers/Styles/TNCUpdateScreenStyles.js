import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    height: 264,
    width: '100%',
  },

  logo: {
    margin: 24,
    marginBottom: 36,
  },

  contentContainer: {
    flex: 1,
    marginHorizontal: 24,
  },

  title: {
    ...Fonts.style.light_16,
    color: Colors.rgb_464544,
    lineHeight: 24,
  },

  body: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_9b9b9b,
    lineHeight: 20,
    marginVertical: 8,
    letterSpacing: 0.3,
  },

  selectorContainer: {
    marginTop: 37.5,
    flexDirection: 'row',
  },

  selector: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_4a4a4a,
    letterSpacing: 0.3,
    lineHeight: 21,
  },

  blue: {
    color: Colors.rgb_4297ff,
  },

  declineButton: {
    marginBottom: 24,
    marginTop: 5,
  }
})