import { StyleSheet } from 'react-native'
import { Colors } from '@resources'

export default StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.rgb_4a4a4a,
    },

    image: {
        backgroundColor: Colors.rgb_9b9b9b,
        justifyContent: 'center',
        alignItems: 'center',
    },

    wreath: {
        position: 'absolute',
        top: -5,
    },
})