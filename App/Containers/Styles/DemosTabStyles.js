import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '@resources'

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    gamesContainer: {
        maxHeight: 185
    },
    itemSeparator: {
        height: 0
    }
})