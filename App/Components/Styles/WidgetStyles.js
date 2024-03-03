import { StyleSheet } from 'react-native'
import {
    ApplicationStyles,
    Colors,
    Fonts,
} from '@resources'

export default StyleSheet.create({
    ...ApplicationStyles.widget,
    message: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_545454,
        textAlign: 'center',
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    refresh: {
        ...Fonts.style.bold_16,
        color: Colors.rgb_4297ff,
        marginLeft: 7,
    },
})