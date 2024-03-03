import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'

export default StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        marginTop: 21,
        marginBottom: 22,
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
        width: 96,
        height: 66,
        borderRadius: 9
    },
    itemTypeImage: {
        position: 'absolute'
    },
    itemDetailContainer: {
        flex: 1,
        marginLeft: 14,
        marginRight: 24,
    },
    itemTitle: {
        marginTop: 0,
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
    itemStatusContainer: {
        position: 'absolute',
        right: 0,
        bottom: 8,
    },
    itemStatus: {
        ...Fonts.style.black_10,
        color: Colors.white,
        marginHorizontal: 13,
        marginTop: 4,
        marginBottom: 5,
        textAlign: 'center'
    },
})