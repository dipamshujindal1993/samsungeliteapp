import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  container: {
    paddingLeft: 23,
    paddingRight: 22,
  },
  textInput: {
    paddingTop: 20,
  },
  nextEnabled: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_4297ff,
    paddingLeft: 6,
    paddingRight: 23,
    paddingVertical: 12,
  },
  nextDisabled: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_4b5461,
    paddingLeft: 6,
    paddingRight: 23,
    paddingVertical: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  firstColumn: {
    flex: 1,
    marginRight: 7.5,
  },
  secondColumn: {
    flex: 1,
    marginLeft: 7.5,
  },
})
