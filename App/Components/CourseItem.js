import React from 'react'
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native'

import ImageEx from '@components/ImageEx'
import { Colors, Constants } from '@resources'
import { formatString, getRelativeTimeFromNow } from '@utils/TextUtils'
import I18n from '@i18n'
import PlayIcon from '@svg/icon_play.svg'
import CompleteIcon from '@svg/icon_complete'

import styles from './Styles/CourseItemStyles'

function CourseItem(props) {
    const { item, onPress, style } = props

    const {
        activityId,
        activityName,
        activityType,
        activityImageUrl,
        childActivity,
        createdDate,
        isCompleted,
        status,
    } = item

    let itemResultAndPostedDate = `${getRelativeTimeFromNow(createdDate)}`

    if (childActivity && childActivity.length) {
        const completed = childActivity.filter((child, idx) => {
            if (child.isCompleted) {
                return child
            }
        })

        itemResultAndPostedDate = `${formatString(I18n.t('learn_courses.passed'), completed.length, childActivity.length)}${'  |  '}${getRelativeTimeFromNow(createdDate)}`
    }

    return (
        <TouchableOpacity style={[styles.itemContainer, { ...style }]} disabled={!onPress} onPress={() => onPress(activityId, activityType)}>
            <View style={styles.itemImageContainer}>
                <ImageEx
                    style={styles.itemImage}
                    source={{ uri: activityImageUrl }}
                />
                {activityType == Constants.ACTIVITY_TYPES.VIDEO &&
                    <View style={styles.itemTypeImage}>
                        <PlayIcon fill={Colors.rgb_ececec} width={24} height={24} />
                    </View>
                }
            </View>

            <View style={styles.itemDetailContainer}>
                <Text numberOfLines={2} style={styles.itemTitle}>{activityName}</Text>
                <Text style={styles.itemPostedDate}>{itemResultAndPostedDate}</Text>
                {status == Constants.COURSE_STATUSES.COMPLETED && <View style={styles.itemStatusContainer}>
                    <CompleteIcon width={22} height={22} fill={Colors.rgb_54da8d} />
                </View>}
            </View>
        </TouchableOpacity>
    )
}
export default CourseItem
