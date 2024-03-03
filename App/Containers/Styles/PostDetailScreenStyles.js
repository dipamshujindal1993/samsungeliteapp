import { StyleSheet, Dimensions } from 'react-native'
import { Fonts, Colors } from '@resources'
const { width } = Dimensions.get('window')

export default StyleSheet.create({

    safeArea: {
        flex: 1,
        marginTop: 20,
    },
    previewImage: {
        height:'100%',
        borderRadius: 26,
    },
    preViewBackground: {
        backgroundColor: Colors.rgba_000000b3,
        flex:1,
        justifyContent: 'center'
    },

    playIconView: {
        backgroundColor: Colors.rgba_00000033,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        alignItems: "center",
        justifyContent: "center"
    },

    optioMenu: {
        marginRight: 16
    },

    optionMenuText: {
        ...Fonts.medium_12,
        color: Colors.rgb_4a4a4a,
        marginLeft: 12,
        paddingVertical: 10,
    },

    LikeDislikeIcon: {
        paddingHorizontal: 5,
    },
    container: {
        flex: 1,
    },
    itemContainer: {
        alignItems: 'flex-start',
        paddingLeft: 24,
    },
    itemTopLevelContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    itemAuthorDetailContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    itemOtherDetailContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    itemAuthorName: {
        ...Fonts.style.bold_13,
        color: Colors.rgb_4a4a4a,
        marginLeft: 11,
    },
    itemTime: {
        ...Fonts.style.regular_10,
        color: Colors.rgb_9b9b9b,
        marginLeft: 11,
    },
    itemComment: {
        ...Fonts.style.regular_10,
        color: Colors.rgb_9b9b9b,
        marginLeft: 4,
    },
    itemPostTitle: {
        ...Fonts.style.bold_17,
        color: Colors.rgb_4a4a4a,
        marginRight: 24,
        marginTop: 10.4
    },
    htmlContainer: {
        marginTop: 9.6,
    },
    separator: {
        height: 0.5,
        backgroundColor: Colors.rgb_e1e1e1
    },
    carouselFirstItem: {
        height: 200,
        width: width - 70,
        marginLeft: 20,
        marginRight: 20,
    },
    carouselFirstItemInactive: {
        height: 200,
        width
    },
    carouselMiddleItem: {
        height: 200,
        width: width - 70,
        marginLeft: 20,
        marginRight: 20,
    },
    carouselMiddleItemInactive: {
        height: 200,
        width
    },
    carouselLastItem: {
        height: 200,
        width: width - 70,
        marginLeft: 20,
        marginRight: 20,
    },
    carouselLastItemInactive: {
        height: 200,
        width
    },
    carouselStyle: {
        marginTop: 28
    },

    singleCaurosel: {
        height: 200,
        width: width - 50,
        marginLeft: 25,
        marginLeft: 25,
        borderRadius: 14,
    },

    heroImage: {
        height: 200,
        width: '100%',
        borderRadius: 14,
        overflow: "hidden"
    },

    likeImage: {
        paddingLeft: 24,
        flexDirection: 'row',
        marginTop: 34.8,
    },
    likeText: {
        ...Fonts.style.bold_12,
        color: Colors.rgb_a3a3a3,
    },
    mediaPlayer: {
        width: '100%',
        height: '100%'
    },
    replyView: {
        width: 100,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 16,
        borderRadius: 24,
        borderWidth: 0.5,
        borderColor: Colors.rgb_e6e6e6,
        backgroundColor: Colors.white,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: Colors.rgba_0000004c,
        shadowRadius: 4,
        shadowOpacity: 0.2,
        elevation: 6,
    },
    replyText: {
        ...Fonts.style.regular_14,
        color: Colors.rgb_4297ff,
        lineHeight: 20,
        marginLeft: 13,
    },
    addCommentContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    sortTransparentView: { 
        flex: 2, 
        backgroundColor: Colors.rgba_0000008a,
    },
    loaderMargin: {
        marginLeft:10,
    }
})

