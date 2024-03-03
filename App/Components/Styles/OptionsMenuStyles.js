import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts,
} from '@resources'

export default StyleSheet.create({
    iconContainer: {
        padding: 12,
    },
    textStyle: {
        ...Fonts.style.medium_12,
        color: Colors.rgb_4297ff,
        marginRight: 24,
        paddingVertical: 12,
    },
})