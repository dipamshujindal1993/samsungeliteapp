import { StyleSheet } from 'react-native'
import {
    Colors,
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContentContainer: {
        flexGrow : 1,
        justifyContent : 'center'
    },
    singleSelectOptionContainer: {
        paddingHorizontal: 24
    },
    cta: {
        alignSelf: 'stretch',
        marginHorizontal: 24,
        marginBottom: 24
    }
})