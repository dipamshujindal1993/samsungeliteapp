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
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: Colors.rgba_97979773,
    },

    image_info: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 14,
        marginVertical: 9,
    },

    profileInfo: {
        flex: 1,
        marginLeft: 13,
    },

    userName: {
        ...Fonts.style.bold_18,
    },

    storeAddress: {
        ...Fonts.style.medium_14,
        color: Colors.rgb_4a4a4a,
        marginTop: 3,
    },

    repCode: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_4a4a4a,
        marginTop: 5,
    },

    leaderboard_points: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.rgba_d8d8d833,
        borderTopWidth: 0.5,
        borderTopColor: Colors.rgba_97979773,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },

    positionContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },

    leaderboard: {
        ...Fonts.style.medium_16,
        color: Colors.rgb_737373,
        marginLeft: 14,
    },

    space: {
        flex: 1,
    },

    fsmPositionContainer: {
        minWidth: 65,
        borderRadius: 17,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.rgb_eaeaea,
        paddingHorizontal: 9,
        paddingVertical: 6,
        alignItems: 'center',
        marginRight: 10,
    },

    position: {
        ...Fonts.style.bold_20,
        color: Colors.rgb_4297ff,
    },

    hash: {
        ...Fonts.style.bold_13,
        color: Colors.rgb_4297ff,
    },

    divider: {
        width: 1,
        height: 22,
        backgroundColor: Colors.rgba_97979773,
    },

    pointsContainer: {
        flex: 1,
        alignItems: 'center',
    },

    points: {
        ...Fonts.style.bold_20,
        color: Colors.rgb_4297ff,
    },

    pointsLable: {
        marginTop: 5,
        ...Fonts.style.medium_12,
        color: Colors.rgb_6e6e6e,
    },
})