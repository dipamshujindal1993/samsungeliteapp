import { Dimensions, StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

const windowWidth = Dimensions.get('window').width

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  titleImage: {
    height: 140,
    width: 136,
  },

  title: {
    ...Fonts.style.medium_24,
    alignSelf: 'center',
    marginVertical: 15,
    color: Colors.rgb_464544,
  },

  contentContainer: {
    alignSelf: 'stretch',
    backgroundColor: Colors.rgb_f9f9f9,
    borderRadius: 8,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  updateContentContainer: {
    width: '100%',
  },

  contentTitleText: {
    ...Fonts.style.bold_18,
    color: Colors.rgb_4a4a4a,
    marginBottom: 20,
  },

  descriptionText: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_9b9b9b,
    lineHeight: 20,
  },

  descriptionErrorText: {
    ...Fonts.style.regular_12,
    alignSelf: 'center',
    color: Colors.rgb_ff4337,
    lineHeight: 20,
  },

  keepCurrentText: {
    ...Fonts.style.medium_13,
    alignSelf: 'center',
    color: Colors.rgb_4297ff,
    lineHeight: 15,
    marginTop: 21,
  },

  changeEmailText: {
    ...Fonts.style.black_14,
    color: Colors.rgb_4297ff,
    lineHeight: 16,
    marginTop: 5,
  },

  emailTextInput: {
    marginBottom: 9,
  },

  space: {
    flex: 1,
  },

  buttonCTA: {
    width: windowWidth - 48,
  }
})