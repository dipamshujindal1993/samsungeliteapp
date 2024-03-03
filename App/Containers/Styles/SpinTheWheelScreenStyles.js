import { Dimensions, StyleSheet, Platform } from 'react-native'
import { Colors, Fonts } from '@resources'

const windowWidth = Dimensions.get('window').width

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  headerTitleText: {
    ...Fonts.style.medium_17,
    color: Colors.rgb_4a4a4a,
  },

  headerRightText: {
    ...Fonts.style.black_20,
    color: Colors.rgb_4297ff,
    marginRight: 24,
  },

  hintText: {
    ...Fonts.style.regular_14,
    color: Colors.rgb_4a4a4a,
    alignSelf: 'center',
  },

  goodLuckText: {
    ...Fonts.style.bold_26,
    color: Colors.rgb_4a4a4a,
    alignSelf: 'center',
    marginTop: 32,
  },

  wheelContainer: {
    alignItems: 'center',
    marginTop: 40,
  },

  picker: {
    marginBottom: -50,
  },

  wheelValueText: {
    ...Fonts.style.medium_14,
    color: Colors.white,
    textAlign: 'center',
  },

  resultContainer: {
    flex: 1,
    alignItems: 'center',
  },

  playAgainButton: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.rgb_4297ff,
    height: 52,
    width: windowWidth - 32,
    marginHorizontal: 16,
    borderRadius: 26,
  },

  playAgainButtonDisabled: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.rgb_b9b9b9,
    height: 52,
    width: windowWidth - 32,
    marginHorizontal: 16,
    borderRadius: 26,
  },

  resultText: {
    ...Fonts.style.bold_26,
    color: Colors.rgb_4a4a4a,
    marginTop: 48,
    marginBottom: 18,
    textAlign: 'center',
    width: 228,
  },

  emoji: {
    fontSize: 86,
    marginTop: 52,
  },

  watchNotificationText: {
    ...Fonts.style.medium_16,
    color: Colors.rgb_545454,
    lineHeight: 24,
    textAlign: 'center',
    width: 228,
  },

  prizeText: {
    ...Fonts.style.light_32,
    color: Colors.rgb_464544,
    marginTop: 4,
  },

  noPrizeMessage: {
    ...Fonts.style.light_20,
    color: Colors.rgb_5f5f5f,
    textAlign: 'center',
    width: 290,
  },

  points: {
    ...Fonts.style.light_56,
    color: Colors.rgb_4a4a4a,
    lineHeight: 66,
    marginTop: 8,
  },

  pointsText: {
    ...Fonts.style.black_14,
    color: Colors.rgb_4a4a4a,
    marginTop: 6,
  },

  playAgainButtonText: {
    ...Fonts.style.medium_15,
    marginLeft: 18,
    color: Colors.white,
  },

  playAgainButtonDisabledText: {
    ...Fonts.style.medium_15,
    color: Colors.white,
  },

  playAgainPoint: {
    ...Fonts.style.bold_20,
    marginRight: 18,
    color: Colors.white,
  },

  wheelfaceImage: {
    width: 300,
    height: 300,
  },

  wheelValueContainer: {
    width: 120,
    alignItems: 'center'
  },

  threeValues_topLeft: {
    position: 'absolute',
    transform: [
      {rotate: '-60deg'},
      {translateX: Platform.OS === 'ios' ? -77 : -77},
      {translateY: Platform.OS === 'ios' ? 40 : 40},
    ]
  },

  threeValues_topRight: {
    position: 'absolute',
    transform: [
      {rotate: '60deg'},
      {translateX: Platform.OS === 'ios' ? 168 : 166},
      {translateY: Platform.OS === 'ios' ? -117 : -117},
    ]
  },

  threeValues_bottom: {
    position: 'absolute',
    transform: [
      {rotate: '180deg'},
      {translateX: Platform.OS === 'ios' ? -90 : -90},
      {translateY: Platform.OS === 'ios' ? -251 : -251},
    ]
  },

  fourValues_topLeft: {
    position: 'absolute',
    transform: [
      {rotate: '-45deg'},
      {translateX: Platform.OS === 'ios' ? -37 : -37},
      {translateY: Platform.OS === 'ios' ? 51 : 51},
    ]
  },

  fourValues_bottomLeft: {
    position: 'absolute',
    marginBottom: 0,
    transform: [
      {rotate: '-135deg'},
      {translateX: Platform.OS === 'ios' ? -163 : -162},
      {translateY: Platform.OS === 'ios' ? -149 : -149},
    ]
  },

  fourValues_bottomRight: {
    position: 'absolute',
    transform: [
      {rotate: '135deg'},
      {translateX: Platform.OS === 'ios' ? 35 : 34},
      {translateY: Platform.OS === 'ios' ? -276 : -276},
    ]
  },

  fourValues_topRight: {
    position: 'absolute',
    transform: [
      {rotate: '45deg'},
      {translateX: Platform.OS === 'ios' ? 164 : 163},
      {translateY: Platform.OS === 'ios' ? -77 : -77},
    ]
  },

  fiveValues_topLeft: {
    position: 'absolute',
    transform: [
      {rotate: '-36deg'},
      {translateX: Platform.OS === 'ios' ? -10 : -10},
      {translateY: Platform.OS === 'ios' ? 50 : 50},
    ]
  },

  fiveValues_bottomLeft: {
    position: 'absolute',
    transform: [
      {rotate: '-108deg'},
      {translateX: Platform.OS === 'ios' ? -163 : -162},
      {translateY: Platform.OS === 'ios' ? -75 : -75},
    ]
  },

  fiveValues_bottom: {
    position: 'absolute',
    marginBottom: 0,
    transform: [
      {rotate: '180deg'},
      {translateX: Platform.OS === 'ios' ? -90 : -90},
      {translateY: Platform.OS === 'ios' ? -259 : -259},
    ]
  },

  fiveValues_bottomRight: {
    position: 'absolute',
    transform: [
      {rotate: '108deg'},
      {translateX: Platform.OS === 'ios' ? 107 : 108},
      {translateY: Platform.OS === 'ios' ? -247 : -247},
    ]
  },

  fiveValues_topRight: {
    position: 'absolute',
    transform: [
      {rotate: '36deg'},
      {translateX: Platform.OS === 'ios' ? 156 : 156},
      {translateY: Platform.OS === 'ios' ? -56 : -56},
    ]
  },
})
