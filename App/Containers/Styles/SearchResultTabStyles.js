import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts,
} from '@resources'

export default StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        paddingLeft: 24,
        paddingRight: 14.1,
        paddingTop: 21,
        paddingBottom: 23,
    },

    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: 96,
        height: 65,
        borderRadius: 8,
    },

    icon: {
        position: 'absolute',
    },

    name_description: {
        flex: 1,
        marginLeft: 14,
    },

    name: {
        ...Fonts.style.bold_14,
        lineHeight: 15.4,
        color: Colors.rgb_4a4a4a,
    },

    description: {
        ...Fonts.style.regular_11,
        color: Colors.rgb_676767,
        marginTop: 8,
    },
})