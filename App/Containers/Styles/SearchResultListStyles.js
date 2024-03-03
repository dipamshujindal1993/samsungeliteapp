import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '@resources'

export default StyleSheet.create({
    itemContainer: {
        height: 109,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 25,
        paddingVertical: 20
    },
    thumbImage: {
        width: 96,
        height: 65,
        backgroundColor: Colors.rgb_b9b9b9,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    descriptionContainer: {
        flex: 1,
        paddingHorizontal: 14
    },
    titleText: {
        ...Fonts.style.bold_14,
        lineHeight: 15.4,
        color: Colors.rgb_4a4a4a
    },
    descriptionText: {
        ...Fonts.style.regular_11,
        marginTop: 5,
        color: Colors.rgb_676767
    },
    separator: {
        height: 1,
        marginLeft: 24,
        backgroundColor: Colors.rgb_e3e3e3,
    }
})