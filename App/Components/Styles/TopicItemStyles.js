import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '@resources'

export default StyleSheet.create({
    sectionContainer: {
        marginTop: 19
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 32,
        paddingHorizontal: 23
    },
    sectionTitle: {
        ...Fonts.style.bold_16,
        color: Colors.rgb_4a4a4a
    },
    seeAllTitle: {
        ...Fonts.style.bold_14,
        color: Colors.rgb_4297ff,
        padding: 6,
        textAlign: 'right'
    },
    itemContainer: {
        flexDirection: 'row',
        height: 92
    },
    itemSeparator: {
        height: 0.5,
        backgroundColor: Colors.rgb_e3e3e3,
        marginLeft: 24
    },
    itemImageContainer: {
        marginLeft: 24,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemImage: {
        marginVertical: 13,
        width: 96,
        height: 66,
        borderRadius: 12.5
    },
    itemTypeImage: {
        position: 'absolute'
    },
    itemDetailContainer: {
        flex: 1,
        marginTop: 15,
        marginHorizontal: 17
    },
    itemTypeContainer: {
        marginTop: 7,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemTitle: {
        ...Fonts.style.bold_14,
        color: Colors.rgb_4a4a4a
    },
    itemTitleMargin: {
        marginLeft: 6
    },
    itemType: {
        ...Fonts.style.regular_12,
        color: Colors.rgb_676767
    }
})