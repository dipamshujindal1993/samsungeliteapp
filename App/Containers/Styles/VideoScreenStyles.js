import { StyleSheet, Dimensions } from 'react-native'
import {
    Colors,
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    videoContentContainer: {
        flex: 1,
        height: 207,
        backgroundColor: Colors.white,
        borderRadius: 14,
        elevation: 6,
        shadowOffset: { width: 0, height: 4 },
        shadowColor: Colors.rgb_b9b9b9,
        shadowOpacity: 0.6,
        shadowRadius: 4
    }
})