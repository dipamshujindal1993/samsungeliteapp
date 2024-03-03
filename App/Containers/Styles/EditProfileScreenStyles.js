import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  imageContainer: {
    alignSelf: 'center',
    marginBottom: 29,
  },

  editIcon: {
    position: 'absolute',
    bottom: -10,
    right: 4,
    width: 32,
    height: 32,
    backgroundColor: Colors.rgb_4297ff,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  section: {
    marginHorizontal: 24,
    marginVertical: 20,
  },

  sectionTitleText: {
    ...Fonts.style.medium_15,
    color: Colors.rgba_000000d9,
    marginBottom: 25,
  },

  textInput: {
    marginVertical: 15,
  },

  optInAndOutContainer: {
    marginHorizontal: 24,
    flexDirection: 'column',
  },

  optInAndOutSectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optInAndOutTextContainer: {
    width: 250
  },

  optInAndOutTextTitle: {
    ...Fonts.style.medium_12,
    color: Colors.rgb_4a4a4a,
    lineHeight: 18,
  },

  optInAndOutTextContent: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_4a4a4a,
    marginTop: 5,
    lineHeight: 18,
  },

  switch: {
    alignSelf: 'baseline'
  },

  separator: {
    marginVertical: 20,
    backgroundColor: Colors.rgb_d8d8d8,
  },

  updateButton: {
    marginTop: 45,
    marginBottom: 37,
    height: 42,
  }
})