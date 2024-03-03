import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    heroImageContainer: {
        height: 201,
        backgroundColor: Colors.white,
        borderRadius: 14,
        elevation: 6,
        shadowOffset: { width: 0, height: 4 },
        shadowColor: Colors.rgb_b9b9b9,
        shadowOpacity: 0.6,
        shadowRadius: 4
    },
    heroImage: {
        padding: 0,
        height: '100%',
        width: '100%',
        borderRadius: 14
    },
    scrollView: {
        width: '100%',
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 25
    },
    contentHolder: {
        marginTop: 16
    },
    htmlContainer: {
        marginTop: 10,
    },
    contentTitle: {
        color: Colors.rgb_464544,
        ...Fonts.style.medium_24,
        lineHeight: 31,
        textAlign: 'left'
    },
    proTag: {
        position: 'absolute',
        left: 9,
        top: 9,
        zIndex: 1,
    }
})