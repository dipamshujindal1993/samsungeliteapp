import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  preferenceContainer: {
    flexDirection: 'row',
    paddingTop: 24.5,
    paddingBottom: 20.5,
    paddingLeft: 10,
    paddingRight: 13,
  },
  descriptionContainer: {
    flex: 1,
    paddingRight: 18,
  },
  preference: {
    ...Fonts.style.regular_14,
    color: Colors.rgb_4a4a4a,
  },
  description: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_9b9b9b,
    paddingTop: 6,
  },
  acceptTermsConditionsContainer: {
    paddingTop: 47,
    paddingBottom: 54,
    paddingHorizontal: 20,
  },
  acceptTermsConditions: {
    ...Fonts.style.medium_11,
    textAlign: 'center',
    lineHeight: 15,
    color: Colors.rgb_c2c2c2,
  },
  acceptTermsConditionsUnderline: {
    textDecorationLine: 'underline',
    textDecorationColor: Colors.rgb_c2c2c2,
  },
  cancelButton: {
    marginTop: 17,
  },
  cancelButtonText: {
    color: Colors.rgb_4297ff,
  },
})
