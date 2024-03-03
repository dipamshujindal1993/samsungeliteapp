import {
  Platform,
  StyleSheet,
} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  webViewContainer: {
    flex: 1,
  },

  spinner: {
    backgroundColor: Colors.white,
  },

  container: {
    flex: 1,
    paddingHorizontal: 23,
    ...Platform.select({
      android: {
        marginBottom: 14,
      },
      ios: {
        marginBottom: 23,
      },
    }),
  },

  email: {
    ...Platform.select({
      android: {
        marginTop: 7,
      },
      ios: {
        marginTop: 14,
      },
    }),
  },

  password: {
    marginTop: 12,
  },

  errorMessage: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_ff4337,
    textAlign: 'center',
    marginTop: 32.5,
  },

  space: {
    flex: 1,
  },

  forgot_password: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_4297ff,
    marginTop: 4,
  },

  contact: {
    flexDirection: 'row',
    justifyContent: 'center',
    ...Platform.select({
      android: {
        marginTop: 10,
      },
      ios: {
        marginTop: 21,
      },
    }),
  },

  contact_prefix: {
    ...Fonts.style.light_12,
    color: Colors.rgb_89a1b8,
  },

  contact_email: {
    ...Fonts.style.medium_12,
    color: Colors.rgb_41a2ff,
  },
})
