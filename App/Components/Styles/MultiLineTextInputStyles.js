import { StyleSheet } from 'react-native'

import {
    Colors,
    Fonts,
} from '@resources'

export default StyleSheet.create({
    container: {
        paddingHorizontal: 24
    },
    textInput: {
        ...Fonts.style.regular_12,
        letterSpacing: 0.3,
        color: Colors.rgb_4a4a4a,
        paddingBottom: 7,
    },
    lengthLimitText: {
        ...Fonts.style.light_12,
        textAlign: 'right',
        color: Colors.rgb_b9b9b9,
        marginRight: 13,
        marginTop: 5
    },
    errorMessage: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_ff4337,
        textAlign: 'center',
        marginTop: 32.5,
    },
    label_info: {
        flexDirection: 'row',
    },
    label: {
        ...Fonts.style.light_12,
        color: Colors.rgb_3e4a59,
        flex: 1
    },
    icon: {
        paddingHorizontal: 9.6,
    },
})
