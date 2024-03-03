import {
    StyleSheet,
    Dimensions
} from 'react-native'

import {
    Colors,
    Fonts,
} from '@resources'

const { width } = Dimensions.get('window')

export default StyleSheet.create({
    defaultContainerStyle: {
        justifyContent: 'center',
        width: parseInt(width) - 16,
        paddingVertical: 17,
        paddingHorizontal: 16,
        backgroundColor: Colors.rgba_000000d9,
        borderRadius: 24
    },
    textStyle: {
        ...Fonts.style.regular_12,
        color: Colors.white,
        textAlign: 'center'
    }
})