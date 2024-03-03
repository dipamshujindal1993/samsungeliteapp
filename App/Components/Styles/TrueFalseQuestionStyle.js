import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
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
        marginBottom: 21,
    },

    trueFalseView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24
    },
    trueFalseButton: {
        alignItems: 'center',
        width: 156,
        paddingTop: 53,
        paddingBottom: 24,
    },
    selectedTrueFalseButton: {
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: Colors.rgb_f9f9f9,
        borderColor: Colors.rgb_d8d8d8
    },
    trueFalseButtonTxt: {
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.light_24,
        paddingTop: 53,
    },
});