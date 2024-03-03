import { StyleSheet } from 'react-native'

const TRACK_SIZE = 8
const THUMB_SIZE = 23

export default StyleSheet.create({
    container: {
        height: 23,
        justifyContent: 'center'
    },
    track: {
        height: TRACK_SIZE,
        borderRadius: TRACK_SIZE / 2,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14
    },
    thumb: {
        position: 'absolute',
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
    },
    touchArea: {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
});