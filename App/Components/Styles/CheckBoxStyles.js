import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 38
    },
    checkboxContainer: {
        width: 26,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unCheckedBox: {
        width: 21,
        height: 21,
        borderRadius: 10.5,
        borderColor: Colors.rgb_b9b9b9,
        borderWidth: 1
    },
    answerText: {
        flex: 1,
        ...Fonts.style.regular_14,
        lineHeight: 18,
        color: Colors.rgb_4a4a4a,
        marginLeft: 17,
        alignSelf: 'center'
    },
})