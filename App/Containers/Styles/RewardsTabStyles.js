import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
    },

    pointsContainer: {
        marginHorizontal: 16,
        marginTop: 10,
    },

    myPointsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 42,
        backgroundColor: Colors.rgb_f2f2f2,
    },

    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    refreshText: {
        ...Fonts.style.bold_16,
        color: Colors.rgb_4297ff,
        marginLeft: 7,
        marginRight: 18,
    },

    allBordersRound: {
        borderRadius: 11,
    },

    topBordersRound: {
        borderTopLeftRadius: 11,
        borderTopRightRadius: 11,
    },

    bottomBordersRound: {
        borderBottomLeftRadius: 11,
        borderBottomRightRadius: 11,
    },

    myPointsText: {
        ...Fonts.style.medium_15,
        marginLeft: 18,
        lineHeight: 42,
        color: Colors.rgb_060606,
    },

    myPointsNumber: {
        ...Fonts.style.black_20,
        marginRight: 18,
        lineHeight: 42,
        color: Colors.rgb_4297ff,
    },

    pointsExpiringContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 42,
        backgroundColor: Colors.rgb_f9f9f9,
    },

    pointsExpiringTextContainer: {
        flexDirection: 'row',
        marginLeft: 18,
    },

    pointsExpiringText: {
        ...Fonts.style.medium_15,
        lineHeight: 42,
        color: Colors.rgb_060606,
    },

    pointsExpiringDate: {
        ...Fonts.style.bold_12,
        lineHeight: 42,
        marginLeft: 15,
        color: Colors.rgb_ff4337,
    },

    pointsExpiringNumber: {
        ...Fonts.style.bold_14,
        marginRight: 18,
        lineHeight: 42,
        color: Colors.rgb_ff4337,
    },

    rewardsContainer: {
        marginTop: 6,
    },

    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 125,
        marginHorizontal: 16,
    },

    separator: {
        height: 1,
        marginHorizontal: 16,
        backgroundColor: Colors.rgb_e3e3e3
    },

    itemImage: {
        marginHorizontal: 5,
        height: 84,
        width: 82,
        borderRadius: 10.4,
    },

    itemDetailContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 26,
        height: 97,
    },

    itemTitle: {
        ...Fonts.style.medium_16,
        color: Colors.rgb_4a4a4a,
    },

    itemDescription: {
        ...Fonts.style.medium_11,
        color: Colors.rgb_9b9b9b,
    },

    warningAndPtsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    warningContainer: {
        width: 73,
        height: 20,
        backgroundColor: Colors.rgb_4297ff,
        borderRadius: 3,
    },

    warningContainerHidden: {
        width: 73,
        height: 20,
        backgroundColor: Colors.white,
    },

    warningContainerGrey: {
        width: 73,
        height: 20,
        backgroundColor: Colors.rgb_9b9b9b,
        borderRadius: 3,
    },

    warningText: {
        ...Fonts.style.black_10,
        color: Colors.white,
        lineHeight: 20,
        alignSelf: 'center',
    },

    rewardPointsContainer: {
        flexDirection: 'row',
        marginRight: 8,
    },

    onlyPointsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    rewardPointsBlue: {
        ...Fonts.style.black_18,
        marginRight: 5,
        color: Colors.rgb_4297ff,
    },

    rewardPointsGrey: {
        ...Fonts.style.black_18,
        marginRight: 5,
        color: Colors.rgb_b9b9b9,
    },

    ptsBlue: {
        ...Fonts.style.bold_11,
        color: Colors.rgb_4297ff,
        lineHeight: 25
    },

    ptsGrey: {
        ...Fonts.style.bold_11,
        color: Colors.rgb_b9b9b9,
        lineHeight: 25
    },

    footerBoxContainer: {
        backgroundColor: Colors.rgb_f9f9f9,
        borderRadius: 8,
        marginTop: 18,
        marginHorizontal: 16,
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 24,
    },

    w9Info: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_9b9b9b,
        lineHeight: 20,
    },

    learnAllRules: {
        ...Fonts.style.black_14,
        color: Colors.rgb_4297ff,
        marginTop: 15,
    },
})
