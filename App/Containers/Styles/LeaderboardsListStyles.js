import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '@resources'

export default StyleSheet.create({
    itemContainer: {
        height: 82,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    separator: {
        height: 1,
        marginLeft: 39,
        backgroundColor: Colors.rgb_e3e3e3,
    },

    rankContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    rankText: {
        ...Fonts.style.bold_14,
        width: 29,
        height: 16,
        marginHorizontal: 5,
        textAlign: 'center',
        color: Colors.rgb_4a4a4a,
    },

    contentContainer: {
        marginLeft: 13,
    },

    pointsContainer: {
        flexDirection: 'row',
        marginTop: 6,
    },

    nameText: {
        ...Fonts.style.medium_15,
        color: Colors.rgb_4a4a4a,
    },

    pointsText: {
        ...Fonts.style.bold_13,
    },

    ptsText: {
        ...Fonts.style.medium_13,
        marginLeft: 3,
    },
})