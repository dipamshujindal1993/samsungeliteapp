import { StyleSheet } from 'react-native'
import {
    ApplicationStyles,
    Colors,
    Fonts,
} from '@resources'

export default StyleSheet.create({
    ...ApplicationStyles.cardStyle1,
    icon: {
        marginLeft: 21,
        marginRight: 24,
        alignSelf: 'center',
    },
    title_info: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        ...Fonts.style.bold_16,
        color: Colors.rgb_4a4a4a,
    },
    info: {
        ...Fonts.style.regular_15,
        color: Colors.rgb_737373,
        marginTop: 9,
        lineHeight: 19.1,
        letterSpacing: -0.21,
    },
})