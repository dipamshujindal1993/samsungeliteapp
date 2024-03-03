import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import LoadingSpinner from '@components/LoadingSpinner'
import ImageEx from '@components/ImageEx'

import {
    Colors,
    Constants,
} from '@resources'

import GameIcon from '@svg/icon_game'
import MissionIcon from '@svg/icon_rocket'
import CompleteIcon from '@svg/icon_complete'
import ProTag from '@components/ProTag'

import styles from './Styles/CarouselStyles'

renderType = (item, type, employeeType, isProContent) => {
    if (employeeType == Constants.EMPLOYEE_TYPES.ADVOCATE
        && (item.category == Constants.NEWS_CATEGORIES.PRO || isProContent)) {
        return (
            <ProTag style={styles.proTag} />
        )
    } else if (type == Constants.CAROUSEL_TYPES.GAME
        || type == Constants.CAROUSEL_TYPES.MISSION) {
        return (
            <View style={[styles.typeContainer, styles.iconContainer]}>
                {type == Constants.CAROUSEL_TYPES.GAME && <GameIcon width={18} height={18} fill={Colors.rgb_4a4a4a} />}
                {type == Constants.CAROUSEL_TYPES.MISSION && <MissionIcon width={18} height={18} fill={Colors.rgb_4a4a4a} />}
            </View>
        )
    }
}

renderStatus = (status) => {
    if (status == Constants.INITIATIVE_STATUS.COMPLETE || status == Constants.COURSE_STATUSES.COMPLETED) {
        return (
            <View style={styles.statusContainer}>
                <CompleteIcon width={18} height={18} fill={Colors.rgb_4297ff} />
            </View>
        )
    }
}

renderHeroImage = (item, itemStyle, type, employeeType, isProContent) => {
    return (
        <View style={[styles.heroImageContainer, itemStyle]}>
            <ImageEx
                style={styles.heroImage}
                source={{ uri: item.activityImageUrl || item.bannerimageUrl || item.cardImageIdentifier }}
            />
            {renderType(item, type, employeeType, isProContent)}
            {renderStatus(item.status)}
        </View>
    )
}

renderTitleText = (title) => {
    return (
        <Text style={styles.gameCardTitleText} numberOfLines={1}>{title}</Text>
    )
}

renderCarouselItem = (item, index, data, itemStyle, onPressSelectItem, type, employeeType, isProContent) => {
    var style = styles.firstItem
    if (data.length > 1 && data.length == index + 1) {
        style = styles.lastItem
    } else if (index > 0) {
        style = styles.item
    }
    return (
        <TouchableOpacity key={index} style={[style, itemStyle]} onPress={() => onPressSelectItem(item)}>
            {renderHeroImage(item, itemStyle, type, employeeType, isProContent)}
            {renderTitleText(item.activityName || item.bannerName || item.initiativeName)}
        </TouchableOpacity>
    )
}

function Carousel(props) {
    const {
        data,
        style,
        itemStyle,
        onPressSelectItem,
        type,
        employeeType,
        loadedAll,
        loadMore,
    } = props

    isCloseToRight = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.width + contentOffset.x >= contentSize.width - 150
    }

    if (data && data.length) {
        return (
            <ScrollView style={[styles.container, { ...style }]} horizontal={true} showsHorizontalScrollIndicator={false}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToRight(nativeEvent) && !loadedAll && loadMore) {
                        loadMore()
                    }
                }}>
                {data.map((item, index) => {
                    return renderCarouselItem(item, index, data, itemStyle, onPressSelectItem, type, employeeType, item.optionalInteger1 == Constants.PRO_CONTENT)
                })}
                {!loadedAll && loadMore && <View style={styles.loadingContainer}>
                    <LoadingSpinner />
                </View>}
            </ScrollView>
        )
    } else {
        return null
    }
}

const mapStateToProps = (state) => ({
    employeeType: state.user.summary ? state.user.summary.employeeType : undefined,
})

export default connect(mapStateToProps)(Carousel)