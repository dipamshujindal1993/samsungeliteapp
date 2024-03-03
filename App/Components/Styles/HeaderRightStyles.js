import { StyleSheet } from 'react-native'
import {
    Colors, Fonts
} from '@resources'

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingRight: 17,
    },

    headerRightText: {
        ...Fonts.style.black_20,
        color: Colors.rgb_3692ff,
        marginRight: 24
    },

    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.rgb_4297ff,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 7,
    },
    badgeContainer: {
        backgroundColor: Colors.rgb_3c3c3c,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: -6,
        right: -5,
        paddingHorizontal: 3,
    },
    badgeText: {
        color: Colors.white,
        ...Fonts.style.bold_10,
    }
})