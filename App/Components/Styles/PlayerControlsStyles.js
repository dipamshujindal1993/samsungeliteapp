import { StyleSheet } from 'react-native'


export default StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'transparent',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    closeIcon: {
        position: 'absolute',
        marginTop: 24,
        marginRight: 17
    },
    controlsRow: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch'
    },
    toolbarRow: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    playerControls: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    playButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40
    },
    sliderContainer: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    sliderStyle: {
        justifyContent: 'center',
        alignSelf: 'stretch',
        height: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        borderBottomLeftRadius: 46,
        borderBottomRightRadius: 46
    },
    track: {
        height: 8
    },
    thumb: {
        width: 23,
        height: 23,
        borderRadius: 11.5,
        backgroundColor: 'white'
    },
    thumbTouchSize: {
        width: 40,
        height: 40
    }
})