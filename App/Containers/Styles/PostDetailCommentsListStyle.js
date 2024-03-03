import { StyleSheet, Dimensions } from 'react-native'
import { Fonts, Colors } from '@resources'
const { width } = Dimensions.get('window')
export default StyleSheet.create({
    previewImage: {
        width: "100%",
        height: "100%"
    },
    preViewBackground: {
        backgroundColor: Colors.rgba_000000b3,
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
    LikeDislikeIcon: {
        paddingHorizontal: 0,
    },
    container: {
        flex: 1,
    },
    itemTime: {
        ...Fonts.style.regular_10,
        color: Colors.rgb_9b9b9b,
        marginLeft: 12,
        lineHeight: 12
    },
    carouselFirstItem: {
        height: 200,
        width: width - 120,
        marginLeft: 20,
        marginRight: 20,
    },
    carouselFirstItemInactive: {
        height: 200,
        width
    },
    carouselMiddleItem: {
        height: 200,
        width: width - 100,
        marginLeft: 20,
        marginRight: 20,
    },
    carouselMiddleItemInactive: {
        height: 200,
        width
    },
    carouselLastItem: {
        height: 200,
        width: width - 120,
        marginLeft: 20,
        marginRight: 20,
    },
    carouselLastItemInactive: {
        height: 200,
        width
    },
    carouselStyle: {
        marginTop: 7,
        width: width - 50
    },
    singleCaurosel: {
        height: 200,
        width: width - 50,
        borderRadius: 14,
    },
     multipleCurosel:{
        height: 200,
        width: width - 80,
        marginRight: 25,
        borderRadius: 14,
    },
    heroImage: {
        height: 200,
        width: '100%',
        borderRadius: 14,
        overflow: "hidden"
    },
    likeImage: {
        alignItems: 'center',
        paddingLeft: 24,
        flexDirection: 'row',
        marginTop: 30.8,
    },
    likeText: {
        ...Fonts.style.bold_12,
        color: Colors.rgb_a3a3a3,
    },
    repliesHeader: {
        width: '100%',
        height: 40,
        marginTop: 37.2,
        justifyContent: 'center',
        backgroundColor: Colors.rgb_fafafa,
    },
    repliesHeaderText: {
        ...Fonts.style.bold_12,
        color: Colors.rgb_4a4a4a,
        marginHorizontal: 23,
    },
    commentCarouselStyle: {
        marginTop: 8,
        marginBottom: 8,
    },
    itemAuthorDetails: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemCommentAuthorName: {
        ...Fonts.style.regular_10,
        color: Colors.rgb_a3a3a3,
        marginLeft: 4,
        lineHeight: 12
    },
    webViewStyle: {
        width: width - 65,
    },
    commentHeartIcon: {
        flexDirection: 'row',
        marginTop: 11,
    },
    commentLikeText: {
        ...Fonts.style.regular_10,
        color: Colors.rgb_a3a3a3,
        marginLeft: 5
    },
    mediaPlayer: {
        width: '100%',
        height: '100%'
    },
    commentHtmlStyle: {
        marginTop: 8
    },
    commentOptionMenu: {
        flexWrap: 'wrap',
        marginTop: 16,
        marginHorizontal: 8,
    },
    commentSection: {
        flexDirection: 'row',
        paddingLeft: 24,
        paddingTop: 8,
        paddingBottom: 9,
    },
    commentSectionContainer: {
        flex: 1
    },
    loaderMargin: {
        marginLeft:5
    }
})

