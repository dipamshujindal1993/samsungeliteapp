import { StyleSheet, Dimensions } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'
const { height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    contactUsContainer: {
        justifyContent: 'center',
        backgroundColor: Colors.rgb_ececec,
        borderRadius: 8,
        height: 52,
        marginTop: 10,
        marginBottom: 11,
        marginHorizontal: 24,
        paddingLeft: 30,
    },
    title: {
        ...Fonts.style.medium_15,
    },
    btnView: {
        alignContent: 'center',
    },
    view: {
        ...Fonts.style.bold_14,
        color: Colors.rgb_4297ff,
        lineHeight: 17,
    },
    faqTitle: {
        marginTop: 11,
        marginLeft: 24,
        ...Fonts.style.medium_15,
        color: Colors.rgb_000000
    },
    faqList: {
        marginTop: 10
    },
    TNCContainer: {
        paddingTop: 32,
        paddingLeft: 16
    },
    bottomSpace: {
        marginBottom: 16
    }
})