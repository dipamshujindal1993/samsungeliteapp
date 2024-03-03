import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        marginTop: 0,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 109
    },
    separator: {
        marginLeft: 24,
    },
    itemImage: {
        marginLeft: 25,
        height: 65,
        width: 96,
        borderRadius: 8,
    },
    itemDetailContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 14,
        marginRight: 14
    },
    itemTitle: {
        ...Fonts.style.bold_14,
        color: Colors.rgb_4a4a4a,
        lineHeight: 15
    },
    itemDescription: {
        ...Fonts.style.regular_11,
        color: Colors.rgb_676767,
        marginTop: 4
    },
    proTag: {
        position: 'absolute',
        top: 25,
        left: 28,
        zIndex: 1,
    }
})