import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    questionTitle: {
        ...Fonts.style.medium_29,
        lineHeight: 36,
        color: Colors.rgb_4a4a4a,
        marginTop: 16,
    },

    questionText: {
        ...Fonts.style.light_16,
        lineHeight: 24,
        color: Colors.rgb_464544,
        marginTop: 32,
    },

    optionLeftSideView: {
        flex: 1,
    },
    optionContainer: {
        paddingBottom: 5,
    },
    optionButton: {
        paddingHorizontal: 24,
        flexDirection: 'row',
    },
    optionButtonPadding: {
        paddingBottom: 15
    }
});