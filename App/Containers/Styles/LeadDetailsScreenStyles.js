import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '@resources'

const checkBoxImage = {
    height: 22, 
    width: 22 
}

const cardShadow = {
    borderRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    shadowColor: Colors.rgba_00000033,
    shadowOpacity: 0.8,
    shadowRadius: 4
}

export default StyleSheet.create({
    baseView: {
        flex: 1,
        backgroundColor: Colors.white
    },
    shadows: {
        height: 2,
        shadowRadius: 2,
        shadowOpacity: 1.0,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowColor: Colors.black,
        elevation: 4,
    },
    rowAndSpaceBetween: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
    divider: {
        height: 4,
        width: '100%',
        backgroundColor: Colors.rgb_d8d8d8
    },
    leadNameText: {
        ...Fonts.style.bold_18,
        color: Colors.rgb_2a2e32,
    },
    leadCarrierText: {
        ...Fonts.style.regular_14,
        color: Colors.rgb_4a4a4a,
        marginTop: 4
    },
    leadDetailsView: {
        flexDirection: 'row',
        backgroundColor: Colors.white
    },
    interestView: {
        ...cardShadow,
        backgroundColor: Colors.rgb_fafafa,
        paddingHorizontal: 16,
        paddingTop: 13,
        paddingBottom: 21,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    statusView: {
        ...cardShadow,
        backgroundColor: Colors.rgb_fafafa,
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 27,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    historyView: {
        backgroundColor: Colors.white,
        paddingHorizontal: 32,
        paddingVertical: 20,
        marginVertical: 8,
    },
    leadPhoneNumber: {
        color: Colors.rgb_9b9b9b,
        ...Fonts.style.regular_12,
    },
    leadStatusDetail: {
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_12,
        marginHorizontal: 2,
        fontWeight: 'bold'
    },
    leadMailAddress: {
        color: Colors.rgb_9b9b9b,
        ...Fonts.style.regular_12,
        marginTop: 8
    },
    btnView: {
        borderRadius: 4, 
        borderWidth: 0.5, 
        borderColor: Colors.rgb_4a4a4a, 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginLeft: 12
    },
    btnText: {
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_12,
    },
    cellTitleText: {
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.bold_16,
        letterSpacing: -0.4
    },
    interestBodyText: {
        marginVertical: 16,
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_14,
    },
    interestLinkText: {
        marginTop: 16,
        backgroundColor: Colors.transparent
    },
    learningContentTitle: {
        marginTop: 11,
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_14,
    },
    learningContentLink: {
        color: Colors.rgb_1428a0,
        textDecorationColor: Colors.rgb_1428a0,
        textDecorationLine: 'underline',
        ...Fonts.style.regular_14,
        marginTop: 12,
    },
    statusHelpButton: {
        height: 18, 
        width: 18, 
        borderColor: Colors.rgb_4a4a4a, 
        borderRadius: 9, 
        borderWidth: 0.8, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectStatusView: {
        flexDirection: 'row',
        marginTop: 16,
        height: 46,
        backgroundColor: Colors.rgb_4297ff,
        borderRadius: 5
    },
    selectStatusInlineView: {
        flex: 3, 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        flexDirection: 'row'
    },
    statusColorBGIndicator:{
        borderRadius: 10, 
        height: 18, 
        width: 18, 
        marginHorizontal: 18,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statusColorIndicator:{
        borderRadius: 6, 
        height: 12, 
        width: 12, 
        marginHorizontal: 4
    },
    selectedStatusText: {
        color: Colors.white,
        ...Fonts.style.regular_16,
        letterSpacing: -0.4
    },
    notificationTitle: {
        ...Fonts.style.regular_15,
        marginTop: 18,
        marginBottom: 4,
        color: Colors.rgb_4a4a4a,
        letterSpacing: -0.38,
    },
    notificationNoteText: {
        ...Fonts.style.regular_13,
        color: Colors.rgb_4a4a4a,
        marginBottom: 16,
        letterSpacing: -0.33,
    },
    itemSoldDateText:{
        ...Fonts.style.regular_11,
        marginTop: 7,
        color: Colors.rgb_9b9b9b,
        letterSpacing: -0.28,
    },
    itemSoldProductsText:{
        ...Fonts.style.regular_14,  
        color: Colors.rgb_4a4a4a,
        letterSpacing: -0.35,
        marginTop: 16,
    },
    notificationDate: {
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_13,
        marginBottom: 12,
        letterSpacing: -0.33,
    },
    notificationTime: {
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.bold_13,
        letterSpacing: -0.33,
    },
    notificationSeparator: {
        height: 0.5, 
        backgroundColor: Colors.rgb_b9b9b9
    },
    sortOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    sortLayoutView: {
        backgroundColor: Colors.white,
        paddingTop: 26,
        paddingLeft: 24,
        paddingBottom: 24,
        marginTop: -30,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    sortTransparentView: { 
        flex: 2, 
        backgroundColor: Colors.rgba_0000008a,
    },
    sortByTxt: {
        ...Fonts.style.medium_18,
        color: Colors.rgb_4a4a4a,
        marginBottom: 21,
    },
    sortItemView: {
        paddingTop: 24,
        paddingBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkBox:{
         ...checkBoxImage,
         tintColor: Colors.rgb_1428a0
    },
    expand:{
        ...checkBoxImage,
        marginRight: 11,
   },
    checkBoxUnCheckedView:{
        ...checkBoxImage,
        borderColor: Colors.rgb_b9b9b9, 
        borderRadius: 11, 
        borderWidth: 0.8  
    },
    sortTypeText: {
        ...Fonts.style.regular_14,
        color: Colors.rgb_4a4a4a,
        marginLeft: 15
    },
    loading_spinner_container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      },
})
