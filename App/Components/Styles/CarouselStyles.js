import {
    StyleSheet,
    Platform,
} from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
    container: {
        marginTop: 14,
    },
    firstItem: {
        paddingLeft: 24,
    },
    item: {
        paddingLeft: 20,
    },
    lastItem: {
        paddingLeft: 20,
        paddingRight: 24,
    },
    loadingContainer: {
        marginRight: 24,
    },

    heroImageContainer: {
        height: 146,
        width: 260,
        backgroundColor: Colors.white,
        borderRadius: 14,
        backgroundColor: Colors.rgb_f9f9f9,
        shadowColor: Colors.rgb_b9b9b9,
        shadowOpacity: 1,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        ...Platform.select({
            android: {
                elevation: 4,
            },
        }),
    },

    heroImage: {
        height: '100%',
        width: '100%',
        borderRadius: 14
    },

    typeContainer: {
        position: 'absolute',
        top: 7,
        left: 6,
        width: 32,
        height: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    statusContainer: {
        position: 'absolute',
        top: 6,
        right: 9,
        backgroundColor: Colors.white,
        borderRadius: 10,
    },

    proTag: {
        position: 'absolute',
        top: 7,
        left: 6,
        zIndex: 1,
    },

    pro: {
        ...Fonts.style.blackItalic_13,
        color: Colors.rgb_dab680,
    },

    iconContainer: {
        backgroundColor: Colors.rgb_f9f9f9,
        borderColor: Colors.rgb_eaeaea,
    },

    gameCardTitleText: {
        width: 260,
        color: Colors.rgb_464544,
        ...Fonts.style.regular_13,
        paddingTop: 10,
    },
})