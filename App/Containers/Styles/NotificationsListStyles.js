import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '@resources'

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    listItemcontainer: {
        flexDirection: "row",
        paddingHorizontal: 24,
        paddingTop: 9,
        paddingBottom: 18
    },
    dotContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.transparent,
    },
    unreadDot: {
        backgroundColor: Colors.rgb_4297ff
    },
    descContainer: {
        flex: 1,
        paddingLeft: 14
    },
    titleText: {
        ...Fonts.style.regular_15,
        color: Colors.rgb_4a4a4a
    },
    unreadText: {
        ...Fonts.style.bold_15
    },
    descText: {
        ...Fonts.style.regular_13,
        color: Colors.rgb_676767,
        paddingTop: 8,
    },
    timeText: {
        ...Fonts.style.regular_10,
        color: Colors.rgb_9b9b9b,
        paddingTop: 7,
    },
    itemStatusContainer: {
        position: 'absolute',
        right: 24,
        alignSelf: 'center',
    },
    separator: {
        backgroundColor: Colors.rgb_e3e3e3,
        height: 1,
        marginLeft: 24,
    },
    disabled: {
        opacity: 0.5
    },
})