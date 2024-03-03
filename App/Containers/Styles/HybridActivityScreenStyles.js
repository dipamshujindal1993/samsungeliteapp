import { StyleSheet, Dimensions } from 'react-native'
import { ApplicationStyles, Colors, Fonts } from '@resources'

const { width } = Dimensions.get('window')
export default StyleSheet.create({
    ...ApplicationStyles.screen,
    carouselFirstItem: {
        marginLeft: 25,
        marginRight: 9,
    },
    carouselFirstItemInactive: {
        width: width + 16,
    },
    carouselMiddleItem: {
        marginHorizontal: 9,
    },
    carouselMiddleItemInactive: {
        width,
    },
    carouselLastItem: {
        marginLeft: 9,
        marginRight: 25,
    },
    carouselLastItemInactive: {
        width: width + 16,
    },
    heroImageContainer: {
        height: 201,
        backgroundColor: Colors.white,
        borderRadius: 14,
        elevation: 6,
        shadowOffset: { width: 0, height: 4 },
        shadowColor: Colors.rgb_b9b9b9,
        shadowOpacity: 0.6,
        shadowRadius: 4
    },
    heroImage: {
        padding: 0,
        height: '100%',
        width: '100%',
        borderRadius: 14
    },
    dotsContainer: {
        position: 'absolute',
        marginTop: 201,
        zIndex: 1
    },
    htmlContainer: {
        marginTop: 8,
    },
    contentTitle: {
        width: width - 50,
        color: Colors.rgb_464544,
        ...Fonts.style.medium_29,
        lineHeight: 31,
        textAlign: 'left',
        marginTop: 33,
    },
    contentDescription: {
        width: width - 48,
        color: Colors.rgb_4a4a4a,
        ...Fonts.style.regular_14,
        lineHeight: 18,
        marginTop: 8,
        textAlign: 'left',
    },
    cta: {
        marginTop: 17,
        marginBottom: 17,
        width: width - 48
    }
})