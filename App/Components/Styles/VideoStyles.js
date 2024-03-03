import {
    StyleSheet
} from 'react-native'

import {
    Colors,
} from '@resources'

export default StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    videoContainerStyles: {
        flex: 1,
        borderRadius: 14
    },
    videoPlayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: Colors.rgb_000000,
    },
    videoPlayerBorder: {
        borderRadius: 14
    },
    sliderFullScreen: {
        marginBottom: 24,
        marginHorizontal: 12
    },
    slider: {
        marginBottom: -1
    },
    toolBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 24,
        marginRight: 17
    },
})