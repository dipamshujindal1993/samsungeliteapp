import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts,
} from '@resources'

export default StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        backgroundColor: Colors.white,
    },

    suggestionContainer: {
        flexDirection: 'row',
        paddingLeft: 27,
        paddingRight: 24,
        paddingVertical: 19,
    },

    suggestion: {
        flex: 1,
        ...Fonts.style.regular_14,
        color: Colors.rgb_676767,
        paddingLeft: 9,
    },

    separator: {
        height: 0.5,
        backgroundColor: Colors.rgb_d8d8d8,
        marginLeft: 24,
    }
})