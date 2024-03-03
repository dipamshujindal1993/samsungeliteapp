import { StyleSheet } from 'react-native'
import {
    Colors,
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    descriptiveContainer: {
        flex: 1,
        paddingBottom: 24,
    },
    progressView: {
        backgroundColor: Colors.rgb_ececec,
        height: 3
    },
    progressBar: {
        position: 'absolute',
        backgroundColor: Colors.rgb_4297ff,
        height: 3,
        borderRadius: 1.5,
    },
    cta: {
        alignSelf: 'stretch',
        marginHorizontal: 24
    }
})