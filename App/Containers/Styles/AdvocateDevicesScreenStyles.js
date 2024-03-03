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
    scrollView: {
        width: '100%',
    },
    contentContainer: {
        flexGrow: 1,
    },
    contentHolder: {
        paddingHorizontal: 24,
        paddingVertical: 24
    },
    separator: {
        width: '100%',
        height: 0.5,
    },
    deviceRow: {
        marginTop: 22
    },
    contentTitle: {
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.bold_18,
        textAlign: 'left',
        marginBottom: 20
    },
    profileContainer: {
        marginBottom: 13
    },
    rowContainer:{
        flex: 1, 
        flexDirection: 'row'
    },
    profileLeft: {
        width: 'auto',
        paddingRight: 25
    },
    profileRight:{
        width: 'auto',
        textAlign: 'left'
    },
    name: {
        ...Fonts.style.bold_18,
        lineHeight: 22
    },
    email: {
        ...Fonts.style.medium_14,
        color: Colors.rgb_4a4a4a,
        lineHeight: 18
    },
    repCode: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_4a4a4a,
        lineHeight: 18
    },
    deviceLeft: {
        width: '40%',
    },
    deviceRight: {
        width: '60%',
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_14,
        height: Fonts.size.s26,
        lineHeight: Fonts.size.s26,
        textAlign: 'right'
    },
    historyContainer: {
        paddingHorizontal: 16,
        paddingVertical: 18,
        backgroundColor: Colors.rgb_f9f9f9,
        borderRadius: 12
    },
    historyRow: {
        paddingVertical: 15
    },
    historyRowFirst: {
        paddingBottom: 15
    },
    historyRowLast: {
        paddingTop: 15
    },
    historyLeft: {
        width: '70%',
        ...Fonts.style.regular_14,
        color: Colors.rgb_4a4a4a,
    },
    historyRight:{
        width: '30%',
        textAlign: 'right',
        ...Fonts.style.bold_12
    },
    historyErrorContainer: {
        marginTop: 77
    },
    historyErrorMessage: {
        textAlign: 'center',
        ...Fonts.style.regular_12,
        color: Colors.rgb_4a4a4a,
        marginBottom: 6
    },
    historyErrorCTA: {
        flex: 1,
        alignItems: 'center',
    },
    historyErrorCTAText: {
        color: Colors.rgb_4297ff,
        width: 'auto',
        ...Fonts.style.bold_16,
        marginLeft: 7,
        lineHeight: 15
    },
    dialogBodyContainer: {
      marginTop: 20
    },
    textInputStyles: {
      ...Fonts.style.medium_16,
      color: Colors.rgb_000000
    }
});