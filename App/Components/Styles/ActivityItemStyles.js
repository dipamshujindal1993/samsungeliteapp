import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '@resources'

export default StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        height: 109
    },
    itemSeparator: {
        height: 0.5,
        backgroundColor: Colors.rgb_9b9b9b,
        marginLeft: 24
    },
    itemImageContainer: {
        marginLeft: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemImage: {
        marginTop: 21,
        marginBottom: 23,
        width: 96,
        height: 66,
        borderRadius: 9
    },
    itemTypeImage: {
        position: 'absolute'
    },
    itemDetailContainer: {
        flex: 1,
        marginTop: 20,
        marginBottom: 17,
        marginHorizontal: 14
    },
    itemTitle: {
        ...Fonts.style.bold_14,
        color: Colors.rgb_4a4a4a,
        lineHeight: 15.4,
        paddingBottom: 4.4
    },
    itemPostedDate: {
        ...Fonts.style.regular_11,
        color: Colors.rgb_676767,
        marginTop: 4.4
    },
    itemPointsContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    itemPoints: {
        ...Fonts.style.bold_20,
        color: Colors.rgb_000000,
    },
    itemPointsTitle: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_4a4a4a,
        marginTop: 7,
        marginLeft: 3
    },
    proTag: {
        position: 'absolute',
        bottom: -6,
    },
})