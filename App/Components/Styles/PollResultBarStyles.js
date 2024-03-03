import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
        //marginLeft: 83,
        flexDirection: 'row',
        alignItems: 'center'
    },
    resultView: {
        marginRight: 12,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.rgb_e6e6e6
    },
    resultBar: {
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.rgb_4297ff
    },
    resultText: {
        ...Fonts.style.regular_10,
        lineHeight: 16,
        color: Colors.rgb_969696,
        marginRight: 36,
    }
})