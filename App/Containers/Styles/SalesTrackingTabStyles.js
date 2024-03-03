import {StyleSheet} from 'react-native'
import {Fonts, Colors} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    parentContainer:{
        marginHorizontal: 24,
    },
    campaignName: {
        ...Fonts.style.bold_20,
        color: Colors.rgb_000000,
    },
    dateText: {
        marginTop: 10,
        ...Fonts.style.light_12,
        color: Colors.rgb_504e4e,
    },
    statsTotallyWeeklyView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25
    },
    statsText: {
        ...Fonts.style.bold_18,
        color: Colors.rgb_4a4a4a,
    },
    updatedText: {
        marginTop: 2,
        ...Fonts.style.light_12,
        color: Colors.rgb_464544,
    },
    totalWeeklyView: {
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.rgb_eaeaea,
        backgroundColor: Colors.rgb_f9f9f9,
        height: 35
    },
    totallySelectedView: {
        backgroundColor: Colors.rgb_4297ff,
        width: 100,
        justifyContent: 'center',
        borderRadius: 20,
    },
    totallyUnSelectedView: {
        backgroundColor: Colors.rgb_f9f9f9,
        width: 80,
        justifyContent: 'center',
        borderRadius: 20,
    },
    weeklySelectedView: {
        backgroundColor: Colors.rgb_f9f9f9, width: 80,
        justifyContent: 'center',
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20
    },
    weeklyUnSelectedView: {
        backgroundColor: Colors.rgb_4297ff,
        width: 100,
        justifyContent: 'center',
        borderRadius: 20
    },

    totallySelectedTextView: {
        textAlign: 'center',
        color: Colors.rgba_ffffffcc,
        ...Fonts.style.regular_12,
    },
    totallyUnSelectedTextView: {
        textAlign: 'center',
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_12,
    },
    weeklySelectedTextView: {
        textAlign: 'center',
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_12,
    },
    weeklyUnSelectedTextView: {
        textAlign: 'center',
        color: Colors.rgba_ffffffcc,
        ...Fonts.style.regular_12,
    },
    pointsView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
        marginHorizontal: 40
    },
    pointsChildView: {
        alignItems: 'center'
    },
    pointsText: {
        ...Fonts.style.bold_45,
        color: Colors.rgb_4a4a4a,
    },
    divider: {
        height: 20,
        width: 1,
        backgroundColor: Colors.rgb_989898,
        marginTop: 10
    },
    pointsEarnedText: {
        marginTop: 6,
        ...Fonts.style.medium_12,
        color: Colors.rgb_4a4a4a,
    },
    pointsByDeviceText: {
        ...Fonts.style.bold_18,
        color: Colors.rgb_4a4a4a,
        marginTop: 39
    },
    pointsListContainer: {
         marginTop: 21,
         marginBottom:300,
         borderRadius:10
    },
    pointsByDeviceLoadingView: {
        minHeight:100,
        backgroundColor: Colors.rgb_f9f9f9,
        marginHorizontal:24
    },
    pointsByDeviceLoadedView: {
        minHeight:0,
        backgroundColor: 'white'
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.rgb_f9f9f9,
        marginHorizontal:24
    },
    itemContainerFirstItem:{
        borderTopRightRadius: 10,
        borderTopLeftRadius:10,
    },
    itemContainerLastItem:{
        borderBottomRightRadius: 10,
        borderBottomLeftRadius:10,
    },
    itemName: {
        margin: 18,
        ...Fonts.style.regular_14,
        color: Colors.rgb_4a4a4a,
    },
    separator: {
        marginHorizontal: 40,
        height: 0.5,
        backgroundColor: Colors.rgb_b9b9b9,
    },
    messageTextStyle: {
        textAlign: 'center',
        paddingHorizontal:'15%',
    }
})
