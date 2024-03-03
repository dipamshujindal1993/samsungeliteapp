import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
    headerTitleText: {
        ...Fonts.style.medium_17,
        color: Colors.rgb_4a4a4a,
    },

    headerRightText: {
        ...Fonts.style.black_20,
        color: Colors.rgb_4297ff,
        marginRight: 24
    }
})