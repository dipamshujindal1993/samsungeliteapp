import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts,
} from '@resources'

export default StyleSheet.create({
    container: {
        marginTop: 5,
        marginBottom: 13,
        marginHorizontal: 24,
        borderRadius: 10,
        backgroundColor: Colors.rgb_4297ff,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 15,
    },

    channelName: {
        flex: 1,
        ...Fonts.style.bold_16,
        color: Colors.white,
        marginLeft: 13,
        marginTop: 16,
        marginBottom: 19,
    },

    btnChangeText: {
        ...Fonts.style.bold_12,
        color: Colors.white,
    },
})