import { StyleSheet, Dimensions } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'
const { width } = Dimensions.get('window')

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    videoContentContainer: {
        height: 201,
        backgroundColor: Colors.white,
        borderRadius: 14,
        elevation: 6,
        shadowOffset: { width: 0, height: 4 },
        shadowColor: Colors.rgb_b9b9b9,
        shadowOpacity: 0.6,
        shadowRadius: 4
    },
    scrollView: {
        width: '100%',
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 25
    },
    contentHolder: {
        marginTop: 33
    },
    points: {
        marginTop: 10,
        color: Colors.rgb_4297ff,
        ...Fonts.style.bold_14,
        textAlign: 'left'
    },
    htmlContainer: {
        marginTop: 20,
    },
    contentTitle: {
        color: Colors.rgb_464544,
        ...Fonts.style.medium_29,
        lineHeight: 31,
        textAlign: 'left'
    },
    contentDescription: {
        marginTop: 20,
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_14,
        lineHeight: 18,
        textAlign: 'left'
    },
    cta: {
        marginTop: 17,
        marginBottom: 17,
        width: width - 48
    }
})