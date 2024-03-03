import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    rowItem: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingHorizontal: 36,
        paddingVertical: 18
    },
    rowIndex: {
        ...Fonts.style.bold_14,
        color: Colors.rgb_4a4a4a,
        minWidth: 24,
        lineHeight: 18,
    },
    rowTitle: {
        flex: 1,
        ...Fonts.style.regular_14,
        color: Colors.rgb_4a4a4a,
        lineHeight: 18,
        marginLeft: 4
    },
    rowSortView: {
        alignSelf: 'center',
        marginLeft: 13,
        width: 24,
        height: 8,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: Colors.rgb_b9b9b9
    },
})