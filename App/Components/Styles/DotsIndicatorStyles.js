import { StyleSheet } from 'react-native'
import {
  Colors
} from '@resources'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingTop: 13,
    paddingBottom: 12
  },
  dotsIndicator: {
    width: 8,
    height: 8,
    backgroundColor: Colors.rgb_d8d8d8,
    borderRadius: 4,
    marginHorizontal: 3.5
  }
})
