import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts,
} from '@resources'

export default StyleSheet.create({
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
    },

    backIcon: {
        padding: 12,
    },

    searchInput: {
        flex: 1,
        ...Fonts.style.regular_17,
        color: Colors.rgb_4a4a4a,
    },

    deleteIcon: {
        padding: 18,
    },
})