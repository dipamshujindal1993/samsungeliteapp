import { StyleSheet } from 'react-native';
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({

  container: {
    backgroundColor: Colors.white,
  },
  text: {
    ...Fonts.style.regular_14,
    color: Colors.rgb_2A2E32
  },
  
});
