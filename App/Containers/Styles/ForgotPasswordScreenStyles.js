import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts,
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 24,
        marginBottom: 47,
    },

    email: {
        marginTop: 3,
    },

    infoMessage: {
        ...Fonts.style.regular_14,
        color: Colors.rgb_c7c7c7,
        marginTop: 19.2,
    },

    errorMessage: {
        ...Fonts.style.regular_14,
        color: Colors.rgb_ff4b38,
        marginTop: 19.2,
    },

    space: {
        flex: 1,
    },
})