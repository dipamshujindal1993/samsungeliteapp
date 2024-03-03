import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts,
} from '@resources'

export default StyleSheet.create({
    bottomTabBarStyle: {
        backgroundColor: Colors.white,
    },

    bottomTabLabelStyle: {
        ...Fonts.style.regular_9,
    },
})