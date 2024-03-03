import { StyleSheet, Dimensions } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'
const { width } = Dimensions.get("screen")


export default StyleSheet.create({
    container: {
        flex: 1
    },
    headerRight: {
        backgroundColor: Colors.rgb_4297ff,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 24,
    },
    tabWidth: {
        width: (width - 48) / 2,
    },
    selectedMenu: {
        ...Fonts.style.bold_14,
        color: Colors.rgb_4297ff,
        marginRight: 16,
        paddingVertical: 12,
    },
    disabled: {
        opacity: 0.5
    },
})