import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts
} from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    listContainer: {
        borderColor: Colors.rgb_9b9b9b,
        borderTopWidth: 0.5
    },
    separator: {
        height: 0,
    },
    itemContainer: {
        flex: 1
    },
    itemDetailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingLeft: 26,
        paddingRight: 26,
        borderColor: Colors.rgb_9b9b9b,
        borderBottomWidth: 0.5
    },
    itemTitle: {
        ...Fonts.style.medium_14,
        color: Colors.rgb_4a4a4a,
        lineHeight: 16,
    },
    itemVideoContainer: {
        height: 201,
        marginHorizontal: 25,
        marginTop: 20,
        backgroundColor: Colors.rgb_d8d8d8,
        borderRadius: 14,
        elevation: 6,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: Colors.rgb_b9b9b9,
        shadowOpacity: 0.6,
        shadowRadius: 4
    },
    videoPlayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 14
    },
})