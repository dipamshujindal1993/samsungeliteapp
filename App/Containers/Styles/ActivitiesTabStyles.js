import { StyleSheet } from 'react-native'
import {
    ApplicationStyles,
    Colors
} from '@resources'

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    itemSeparator: {
        height: 0.5,
        backgroundColor: Colors.rgb_9b9b9b,
        marginLeft: 24
    }
})