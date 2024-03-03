import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1
    },
    seprateTopView: {
        flex: 1
    },
    seprateBottomView: {
        marginBottom: 20,
        marginHorizontal: 24
    },
    submitButton: {
        backgroundColor: Colors.rgb_4297ff,
        width: '100%',
        borderRadius: 21,
        height: 42
    },
    submitDefaultButton: {
        backgroundColor: Colors.rgb_4297ff,
        borderRadius: 21,
        height: 42,
        opacity: 0.3,
        width: '100%',
    },

    feedbackView: {
        marginVertical: 32,
        marginHorizontal: 24
    },
    feedbackErrorTxt: {
        textAlign: 'left',
        color: Colors.rgb_d02a2d,
        lineHeight: Fonts.size.s16,
        paddingBottom: 8,
        ...Fonts.style.bold_12
    },
    feedbackTxt: {
        textAlign: 'left',
        color: Colors.rgb_464544,
        lineHeight: Fonts.size.s16,
        ...Fonts.style.light_12
    },
    feedbackCorrectTxt: {
        textAlign: 'left',
        color: Colors.rgb_4297ff,
        lineHeight: Fonts.size.s16,
        paddingBottom: 8,
        ...Fonts.style.bold_12
    }
});